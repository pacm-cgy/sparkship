import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Zap, MapPin, Github } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export default function BuildersPage() {
  const [search, setSearch] = useState('')
  const [skill, setSkill] = useState('')

  const { data: builders = [], isLoading } = useQuery({
    queryKey: ['builders', search, skill],
    queryFn: async () => {
      let q = supabase.from('sparkship_profiles')
        .select('*, projects:sparkship_projects(count)')
        .eq('role', 'builder')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(40)
      if (search) q = q.or(`display_name.ilike.%${search}%,bio.ilike.%${search}%,school.ilike.%${search}%`)
      if (skill) q = q.contains('skills', [skill])
      const { data, error } = await q
      if (error) throw error
      return data || []
    }
  })

  const allSkills = [...new Set(builders.flatMap(b => b.skills || []))].slice(0, 20)

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--spark)', letterSpacing: '0.15em', marginBottom: 8 }}>BUILDERS</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16 }}>청소년 빌더</h1>
        <p style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 20 }}>프로젝트를 만들고 있는 청소년 창업가들을 탐색하세요</p>

        <div style={{ position: 'relative', maxWidth: 440, marginBottom: 16 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="이름, 학교, 자기소개로 검색..."
            style={{ paddingLeft: 42 }} />
        </div>

        {allSkills.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button className={`tag ${!skill ? 'active' : ''}`} onClick={() => setSkill('')}>전체</button>
            {allSkills.map(s => (
              <button key={s} className={`tag ${skill === s ? 'active' : ''}`} onClick={() => setSkill(skill === s ? '' : s)}>{s}</button>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--text-4)', fontFamily: 'var(--f-mono)' }}>
        {isLoading ? '로딩 중...' : `${builders.length}명의 빌더`}
      </div>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 12 }}>
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{ height: 160 }} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 12 }}>
          {builders.map(b => (
            <Link key={b.id} to={`/u/${b.username}`} style={{ display: 'block' }}>
              <div className="card card-spark" style={{ padding: '20px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--spark-dim)', border: '1px solid var(--spark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: 'var(--spark)', flexShrink: 0 }}>
                    {(b.display_name||'U')[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 1 }}>{b.display_name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-4)', fontFamily: 'var(--f-mono)' }}>@{b.username}</div>
                  </div>
                  {b.is_verified && <span className="badge badge-spark" style={{ fontSize: 9 }}>✓</span>}
                </div>

                {b.bio && (
                  <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {b.bio}
                  </p>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: b.skills?.length ? 10 : 0 }}>
                  {b.school && (
                    <span style={{ fontSize: 12, color: 'var(--text-4)', display: 'flex', alignItems: 'center', gap: 3 }}>
                      🏫 {b.school}
                    </span>
                  )}
                  {b.location && (
                    <span style={{ fontSize: 12, color: 'var(--text-4)', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <MapPin size={10} /> {b.location}
                    </span>
                  )}
                </div>

                {b.skills?.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {b.skills.slice(0, 4).map(s => (
                      <span key={s} className="tag" style={{ fontSize: 10, padding: '1px 7px' }}>{s}</span>
                    ))}
                    {b.skills.length > 4 && <span style={{ fontSize: 10, color: 'var(--text-4)', padding: '2px 4px' }}>+{b.skills.length - 4}</span>}
                  </div>
                )}

                <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--line-1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-4)', fontFamily: 'var(--f-mono)' }}>
                    <Zap size={10} style={{ verticalAlign: 'middle', marginRight: 3, color: 'var(--spark)' }} />
                    프로젝트 {b.projects?.[0]?.count || 0}개
                  </span>
                  {b.github_url && <Github size={12} color="var(--text-4)" />}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!isLoading && builders.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-4)' }}>
          <Zap size={40} style={{ marginBottom: 12, opacity: 0.2 }} />
          <p style={{ fontSize: 16, color: 'var(--text-3)' }}>아직 등록된 빌더가 없습니다</p>
        </div>
      )}
    </div>
  )
}
