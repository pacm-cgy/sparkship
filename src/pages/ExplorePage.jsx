import { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useProjects } from '../hooks/useData'
import ProjectCard from '../components/ui/ProjectCard'

const CATS  = [
  {key:'all',label:'전체'},{key:'ai',label:'AI'},{key:'web',label:'웹'},
  {key:'app',label:'앱'},{key:'education',label:'교육'},{key:'commerce',label:'커머스'},
  {key:'social',label:'소셜'},{key:'game',label:'게임'},{key:'other',label:'기타'},
]
const STAGES = [
  {key:'all',label:'전체 단계'},{key:'idea',label:'아이디어'},
  {key:'prototype',label:'프로토타입'},{key:'mvp',label:'MVP'},
  {key:'launched',label:'출시됨'},{key:'revenue',label:'수익화'},
]

export default function ExplorePage() {
  const [search,setSearch] = useState('')
  const [cat,setCat] = useState('all')
  const [stage,setStage] = useState('all')

  const { data:projects=[], isLoading } = useProjects({
    search:search||undefined,
    category:cat==='all'?undefined:cat,
    stage:stage==='all'?undefined:stage,
    limit:24,
  })

  return (
    <div className="sp-page">
      <div className="page-header">
        <div className="page-header-inner">
          <div className="sp-section-eyebrow">EXPLORE</div>
          <h1 style={{ fontFamily:'var(--f-display)',fontSize:'clamp(24px,3vw,32px)',fontWeight:800,letterSpacing:'-.04em',marginBottom:6 }}>프로젝트 탐색</h1>
          <p style={{ color:'var(--text-3)',fontSize:14,marginBottom:24 }}>청소년 창업가들의 프로젝트를 발견하고 연결되세요</p>
          <div style={{ position:'relative',maxWidth:500,marginBottom:20 }}>
            <Search size={15} style={{ position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',color:'var(--text-4)',pointerEvents:'none' }}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="프로젝트, 빌더, 태그로 검색..." style={{ paddingLeft:40 }}/>
          </div>
          <div style={{ display:'flex',gap:16,flexWrap:'wrap',alignItems:'center' }}>
            <div className="sp-filter-bar">
              {CATS.map(c=><button key={c.key} className={`sp-filter-btn${cat===c.key?' active':''}`} onClick={()=>setCat(c.key)}>{c.label}</button>)}
            </div>
            <select value={stage} onChange={e=>setStage(e.target.value)} style={{ width:'auto',padding:'5px 12px',fontSize:13,flexShrink:0 }}>
              {STAGES.map(s=><option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop:32,paddingBottom:80 }}>
        <div style={{ marginBottom:20,fontSize:13,color:'var(--text-4)',fontFamily:'var(--f-mono)' }}>
          {isLoading?'검색 중...':`${projects.length}개 프로젝트`}
        </div>
        {isLoading ? (
          <div className="sp-grid-3">
            {[...Array(6)].map((_,i)=>(
              <div key={i} style={{ borderRadius:'var(--r-xl)',overflow:'hidden',border:'1px solid var(--line-1)' }}>
                <div className="skeleton" style={{ aspectRatio:'16/9',width:'100%' }}/>
                <div style={{ padding:18,display:'flex',flexDirection:'column',gap:8 }}>
                  <div className="skeleton" style={{ height:17,width:'68%',borderRadius:4 }}/>
                  <div className="skeleton" style={{ height:13,width:'95%',borderRadius:4 }}/>
                  <div className="skeleton" style={{ height:13,width:'55%',borderRadius:4 }}/>
                </div>
              </div>
            ))}
          </div>
        ) : projects.length>0 ? (
          <div className="sp-grid-3">
            {projects.map(p=><ProjectCard key={p.id} project={p}/>)}
          </div>
        ) : (
          <div className="sp-empty" style={{ paddingTop:100 }}>
            <SlidersHorizontal size={40} style={{ opacity:.25,marginBottom:8 }}/>
            <p className="sp-empty-title">프로젝트가 없습니다</p>
            <p className="sp-empty-desc">필터를 조정하거나 다른 검색어를 입력해보세요</p>
          </div>
        )}
      </div>
    </div>
  )
}
