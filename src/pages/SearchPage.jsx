import { useState, useEffect } from 'react'
import { Search, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ProjectCard from '../components/ui/ProjectCard'

export default function SearchPage() {
  const [q, setQ] = useState('')
  const [results, setResults] = useState({ projects:[], builders:[] })
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('projects')

  useEffect(() => {
    if (!q.trim()) { setResults({projects:[],builders:[]}); return }
    const timer = setTimeout(async () => {
      setLoading(true)
      const [{ data:proj }, { data:bld }] = await Promise.all([
        supabase.from('projects').select('*,owner:sparkship_profiles(display_name,avatar_url,username)')
          .or(`title.ilike.%${q}%,tagline.ilike.%${q}%`).limit(12),
        supabase.from('sparkship_profiles').select('*')
          .or(`display_name.ilike.%${q}%,username.ilike.%${q}%,bio.ilike.%${q}%`).limit(8),
      ])
      setResults({ projects:proj||[], builders:bld||[] })
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [q])

  const total = results.projects.length + results.builders.length

  return (
    <div className="sp-page">
      <div className="page-header">
        <div className="page-header-inner">
          <div className="sp-section-eyebrow">SEARCH</div>
          <h1 style={{ fontFamily:'var(--f-display)',fontSize:'clamp(24px,3vw,32px)',fontWeight:800,letterSpacing:'-.04em',marginBottom:20 }}>전체 검색</h1>
          <div style={{ position:'relative',maxWidth:560 }}>
            <Search size={16} style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'var(--text-3)',pointerEvents:'none' }}/>
            <input autoFocus value={q} onChange={e=>setQ(e.target.value)}
              placeholder="프로젝트, 빌더, 태그로 검색..."
              style={{ paddingLeft:44,fontSize:15,height:48 }}/>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop:32,paddingBottom:80 }}>
        {q.trim() && (
          <>
            <div style={{ display:'flex',gap:4,marginBottom:24,borderBottom:'1px solid var(--line-1)',paddingBottom:0 }}>
              {[{key:'projects',label:`프로젝트 (${results.projects.length})`},{key:'builders',label:`빌더 (${results.builders.length})`}].map(t=>(
                <button key={t.key} onClick={()=>setTab(t.key)}
                  style={{ padding:'8px 16px',background:'none',border:'none',cursor:'pointer',fontSize:14,fontWeight:tab===t.key?600:400,
                    color:tab===t.key?'var(--text-1)':'var(--text-3)',
                    borderBottom:tab===t.key?'2px solid var(--spark)':'2px solid transparent',
                    marginBottom:-1,transition:'var(--t-fast)' }}>
                  {t.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div style={{ textAlign:'center',padding:'60px 0',color:'var(--text-3)',fontSize:14 }}>검색 중...</div>
            ) : total===0 ? (
              <div className="sp-empty" style={{ paddingTop:60 }}>
                <Search size={36} style={{ opacity:.2,marginBottom:8 }}/>
                <p className="sp-empty-title">결과가 없습니다</p>
                <p className="sp-empty-desc">"{q}"에 대한 검색 결과가 없습니다</p>
              </div>
            ) : tab==='projects' ? (
              results.projects.length>0 ? (
                <div className="sp-grid-3">{results.projects.map(p=><ProjectCard key={p.id} project={p}/>)}</div>
              ) : <p style={{ color:'var(--text-3)',fontSize:14 }}>프로젝트 결과 없음</p>
            ) : (
              results.builders.length>0 ? (
                <div className="sp-grid-4">
                  {results.builders.map(b=>(
                    <Link key={b.id} to={`/u/${b.username}`} style={{ textDecoration:'none' }}>
                      <div className="sp-builder-card">
                        <div className="sp-avatar sp-avatar-lg">
                          {b.avatar_url?<img src={b.avatar_url} alt={b.display_name}/>:(b.display_name?.[0]||'U').toUpperCase()}
                        </div>
                        <div style={{ fontFamily:'var(--f-display)',fontSize:14,fontWeight:700 }}>{b.display_name||b.username}</div>
                        <div style={{ fontSize:12,color:'var(--text-4)' }}>@{b.username}</div>
                        {b.bio&&<p style={{ fontSize:12,color:'var(--text-3)',textAlign:'center',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden' }}>{b.bio}</p>}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : <p style={{ color:'var(--text-3)',fontSize:14 }}>빌더 결과 없음</p>
            )}
          </>
        )}

        {!q.trim() && (
          <div className="sp-empty" style={{ paddingTop:80 }}>
            <Search size={40} style={{ opacity:.2,marginBottom:8 }}/>
            <p className="sp-empty-title">무엇을 찾고 있나요?</p>
            <p className="sp-empty-desc">프로젝트 이름, 빌더 이름, 기술 태그 등을 검색해보세요</p>
          </div>
        )}
      </div>
    </div>
  )
}
