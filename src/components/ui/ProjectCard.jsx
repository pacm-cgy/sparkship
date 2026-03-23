import { Link } from 'react-router-dom'
import { Zap, Eye, Heart } from 'lucide-react'

const STAGE = {
  idea:      { label: '아이디어',   cls: 'badge-gray'   },
  prototype: { label: '프로토타입', cls: 'badge-blue'   },
  mvp:       { label: 'MVP',        cls: 'badge-purple' },
  launched:  { label: '출시됨',     cls: 'badge-green'  },
  revenue:   { label: '수익화',     cls: 'badge-spark'  },
  funded:    { label: '투자유치',   cls: 'badge-spark'  },
}
const CAT = { app:'앱',web:'웹',ai:'AI',hardware:'하드웨어',social:'소셜',education:'교육',commerce:'커머스',content:'콘텐츠',game:'게임',other:'기타' }
const GRAD = {
  ai:       'linear-gradient(135deg,#0e0920 0%,#0a1228 100%)',
  web:      'linear-gradient(135deg,#081420 0%,#0a1628 100%)',
  app:      'linear-gradient(135deg,#120a2a 0%,#0c1228 100%)',
  education:'linear-gradient(135deg,#081810 0%,#081420 100%)',
  commerce: 'linear-gradient(135deg,#1c090a 0%,#160a0a 100%)',
  social:   'linear-gradient(135deg,#14082a 0%,#1c0818 100%)',
  game:     'linear-gradient(135deg,#080e1c 0%,#080a1e 100%)',
  default:  'linear-gradient(135deg,var(--bg-3) 0%,var(--bg-4) 100%)',
}

export default function ProjectCard({ project }) {
  if (!project) return null
  const stage = STAGE[project.stage] || STAGE.idea
  const grad  = GRAD[project.category]  || GRAD.default

  return (
    <Link to={`/p/${project.id}`} style={{ display:'block', textDecoration:'none' }}>
      <article className="sp-project-card">
        {/* 썸네일 */}
        <div className="sp-project-thumb" style={{ background: project.thumbnail_url ? undefined : grad }}>
          {project.thumbnail_url
            ? <img src={project.thumbnail_url} alt={project.title} loading="lazy" />
            : <Zap size={28} color="var(--spark)" strokeWidth={1.5} style={{ opacity:.55 }} />
          }
          <div style={{ position:'absolute',top:10,left:10,display:'flex',gap:5 }}>
            {project.is_featured && <span className="badge badge-spark">⚡ Featured</span>}
          </div>
          <div style={{ position:'absolute',top:10,right:10 }}>
            <span className={`badge ${stage.cls}`}>{stage.label}</span>
          </div>
        </div>

        {/* 본문 */}
        <div className="sp-project-body">
          <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:8,marginBottom:6 }}>
            <h3 className="sp-project-title">{project.title}</h3>
            {project.category && (
              <span className="badge badge-gray" style={{ flexShrink:0,marginTop:2 }}>
                {CAT[project.category]||project.category}
              </span>
            )}
          </div>
          <p className="sp-project-desc" style={{ display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden' }}>
            {project.tagline||'소개 없음'}
          </p>
          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:'auto',paddingTop:4 }}>
            {project.owner ? (
              <div style={{ display:'flex',alignItems:'center',gap:7 }}>
                <div style={{ width:22,height:22,borderRadius:6,background:'var(--spark-dim)',border:'1px solid var(--spark-border)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:'var(--spark)',flexShrink:0 }}>
                  {project.owner.avatar_url
                    ? <img src={project.owner.avatar_url} alt="" style={{ width:'100%',height:'100%',objectFit:'cover',borderRadius:6 }} />
                    : (project.owner.display_name||'U')[0].toUpperCase()}
                </div>
                <span style={{ fontSize:12,color:'var(--text-3)',fontWeight:500 }}>{project.owner.display_name}</span>
              </div>
            ) : <div />}
            <div style={{ display:'flex',alignItems:'center',gap:10 }}>
              {project.view_count>0 && <span style={{ display:'flex',alignItems:'center',gap:3,fontSize:12,color:'var(--text-4)' }}><Eye size={12}/>{project.view_count}</span>}
              {project.like_count>0 && <span style={{ display:'flex',alignItems:'center',gap:3,fontSize:12,color:'var(--text-4)' }}><Heart size={12}/>{project.like_count}</span>}
            </div>
          </div>
          {project.tags?.length>0 && (
            <div style={{ display:'flex',gap:5,flexWrap:'wrap',marginTop:10 }}>
              {project.tags.slice(0,3).map(t => <span key={t} className="badge badge-gray" style={{ fontSize:10 }}>#{t}</span>)}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
