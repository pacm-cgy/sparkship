import { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useProjects } from '../hooks/useData'
import ProjectCard from '../components/ui/ProjectCard'

const CATS = ['all','ai','web','app','education','commerce','social','game','other']
const STAGES = ['all','idea','prototype','mvp','launched','revenue']
const CAT_LABEL = { all:'전체', ai:'AI', web:'웹', app:'앱', education:'교육', commerce:'커머스', social:'소셜', game:'게임', other:'기타' }
const STAGE_LABEL = { all:'전체', idea:'아이디어', prototype:'프로토타입', mvp:'MVP', launched:'출시됨', revenue:'수익화' }

export default function ExplorePage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [stage, setStage] = useState('all')

  const { data: projects = [], isLoading } = useProjects({
    search: search || undefined,
    category: category === 'all' ? undefined : category,
    stage: stage === 'all' ? undefined : stage,
    limit: 24
  })

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      {/* 헤더 */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--spark)', letterSpacing: '0.15em', marginBottom: 8 }}>EXPLORE</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>프로젝트 탐색</h1>

        {/* 검색 */}
        <div style={{ position: 'relative', maxWidth: 480, marginBottom: 20 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="프로젝트 이름, 설명, 태그로 검색..."
            style={{ paddingLeft: 42 }} />
        </div>

        {/* 카테고리 필터 */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          {CATS.map(c => (
            <button key={c} className={`tag ${category === c ? 'active' : ''}`}
              onClick={() => setCategory(c)}>{CAT_LABEL[c]}</button>
          ))}
        </div>
        {/* 스테이지 필터 */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {STAGES.map(s => (
            <button key={s} className={`tag ${stage === s ? 'active' : ''}`}
              onClick={() => setStage(s)} style={{ fontSize: 11 }}>{STAGE_LABEL[s]}</button>
          ))}
        </div>
      </div>

      {/* 결과 */}
      <div style={{ marginBottom: 16, fontSize: 13, color: 'var(--text-4)', fontFamily: 'var(--f-mono)' }}>
        {isLoading ? '검색 중...' : `${projects.length}개 프로젝트`}
      </div>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{ height: 320 }} />)}
        </div>
      ) : projects.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {projects.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-4)' }}>
          <SlidersHorizontal size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
          <p style={{ fontSize: 16, color: 'var(--text-3)' }}>조건에 맞는 프로젝트가 없습니다</p>
          <p style={{ fontSize: 13 }}>필터를 조정하거나 다른 검색어를 입력해보세요</p>
        </div>
      )}
    </div>
  )
}
