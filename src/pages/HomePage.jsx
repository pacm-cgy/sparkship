import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, ArrowRight, Search, ChevronRight, Star, Users, Cpu, Globe, Code2, BookOpen } from 'lucide-react'
import { useProjects } from '../hooks/useData'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import ProjectCard from '../components/ui/ProjectCard'

const CATS = [
  {key:'all',label:'전체'},{key:'ai',label:'AI',icon:Cpu},
  {key:'web',label:'웹',icon:Globe},{key:'app',label:'앱',icon:Code2},
  {key:'education',label:'교육',icon:BookOpen},
]
const STATS = [
  {key:'total_builders',label:'청소년 빌더',unit:'명',desc:'포트폴리오 등록'},
  {key:'total_projects',label:'프로젝트',unit:'개',desc:'아이디어 ~ 출시'},
  {key:'total_contacts',label:'스카우트 연락',unit:'건',desc:'기업 발굴 의뢰'},
]

export default function HomePage() {
  const navigate = useNavigate()
  const [cat,setCat] = useState('all')

  const { data:statsData=[] } = useQuery({
    queryKey:['sparkship_stats'],
    queryFn:async()=>{ const{data}=await supabase.from('sparkship_stats').select('*'); return data||[] }
  })
  const statMap = Object.fromEntries(statsData.map(s=>[s.key,s.value]))
  const { data:featured=[], isLoading } = useProjects({ featured:true, limit:6 })
  const { data:latest=[] } = useProjects({ limit:8 })
  const display = cat==='all' ? (featured.length?featured:latest).slice(0,6)
    : latest.filter(p=>p.category===cat).slice(0,6)

  return (
    <div>
      {/* ── 히어로 */}
      <section className="sp-hero">
        <div className="sp-hero-bg"/>
        <div className="sp-hero-grid"/>
        <div className="sp-hero-badge"><Zap size={11} fill="currentColor"/>BETA — 지금 무료로 시작하세요</div>
        <h1 className="sp-hero-title">
          청소년 창업가의<br/>
          <span style={{ color:'var(--spark)' }}>가능성을 발견하세요</span>
        </h1>
        <p className="sp-hero-sub">
          아이디어부터 실제 서비스까지. 청소년 창업가의 포트폴리오와 기업 스카우터가 직접 연결되는 플랫폼.
        </p>
        <div className="sp-hero-actions">
          <button className="btn btn-spark btn-lg" onClick={()=>navigate('/signup')}>
            포트폴리오 등록하기 <ArrowRight size={16}/>
          </button>
          <button className="btn btn-outline btn-lg" onClick={()=>navigate('/explore')}>
            <Search size={15}/> 프로젝트 탐색
          </button>
        </div>
        <div className="sp-hero-stats">
          {STATS.map(s=>(
            <div key={s.key} style={{ textAlign:'center' }}>
              <div className="sp-hero-stat-num">{statMap[s.key]?Number(statMap[s.key]).toLocaleString():0}{s.unit}</div>
              <div className="sp-hero-stat-label">{s.label}</div>
              <div className="sp-hero-stat-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 프로젝트 갤러리 */}
      <section className="sp-section" style={{ borderTop:'1px solid var(--line-1)' }}>
        <div className="container">
          <div className="sp-section-header">
            <div>
              <div className="sp-section-eyebrow">FEATURED PROJECTS</div>
              <h2 className="sp-section-title">주목받는 프로젝트</h2>
              <p className="sp-section-subtitle">청소년 빌더들의 최신 창업 프로젝트</p>
            </div>
            <Link to="/explore" className="btn btn-ghost" style={{ flexShrink:0 }}>
              전체 보기 <ChevronRight size={14}/>
            </Link>
          </div>
          <div className="sp-filter-bar" style={{ marginBottom:24 }}>
            {CATS.map(c=><button key={c.key} className={`sp-filter-btn${cat===c.key?' active':''}`} onClick={()=>setCat(c.key)}>{c.label}</button>)}
          </div>
          {isLoading ? (
            <div className="sp-grid-3">
              {[...Array(6)].map((_,i)=>(
                <div key={i} style={{ borderRadius:'var(--r-xl)',overflow:'hidden',border:'1px solid var(--line-1)' }}>
                  <div className="skeleton" style={{ aspectRatio:'16/9',width:'100%' }}/>
                  <div style={{ padding:18,display:'flex',flexDirection:'column',gap:8 }}>
                    <div className="skeleton" style={{ height:17,width:'68%',borderRadius:4 }}/>
                    <div className="skeleton" style={{ height:13,width:'90%',borderRadius:4 }}/>
                  </div>
                </div>
              ))}
            </div>
          ) : display.length>0 ? (
            <div className="sp-grid-3">{display.map(p=><ProjectCard key={p.id} project={p}/>)}</div>
          ) : (
            <div className="sp-empty">
              <p className="sp-empty-title">첫 번째 프로젝트를 등록해보세요</p>
              <button className="btn btn-spark" onClick={()=>navigate('/new')} style={{ marginTop:8 }}>
                등록하기 <ArrowRight size={14}/>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── 스카우터 CTA */}
      <section style={{ borderTop:'1px solid var(--line-1)',padding:'64px 0' }}>
        <div className="container">
          <div style={{
            background:'var(--bg-card)',border:'1px solid var(--spark-border)',
            borderRadius:'var(--r-2xl)',padding:'clamp(32px,5vw,56px)',
            display:'flex',alignItems:'center',justifyContent:'space-between',
            gap:40,flexWrap:'wrap',position:'relative',overflow:'hidden',
          }}>
            <div style={{ position:'absolute',top:-80,right:-80,width:320,height:320,background:'radial-gradient(circle,rgba(245,158,11,.07) 0%,transparent 70%)',pointerEvents:'none' }}/>
            <div>
              <div className="sp-section-eyebrow" style={{ marginBottom:8 }}>FOR SCOUTS</div>
              <h2 style={{ fontFamily:'var(--f-display)',fontSize:'clamp(22px,3vw,30px)',fontWeight:800,letterSpacing:'-.04em',lineHeight:1.2,marginBottom:12 }}>
                차세대 창업가를<br/>직접 발굴하세요
              </h2>
              <p style={{ color:'var(--text-3)',fontSize:14,lineHeight:1.7,maxWidth:380 }}>
                청소년 창업가들의 포트폴리오를 보고, 직접 연락해 투자·멘토링·협업 기회를 만드세요.
              </p>
            </div>
            <div style={{ display:'flex',flexDirection:'column',gap:10,flexShrink:0 }}>
              <button className="btn btn-spark btn-lg" onClick={()=>navigate('/scout')}>
                <Star size={15}/> 스카우터 시작하기
              </button>
              <button className="btn btn-outline" onClick={()=>navigate('/explore')}>
                프로젝트 둘러보기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 빌더 섹션 */}
      <section style={{ borderTop:'1px solid var(--line-1)',background:'var(--bg-1)',padding:'64px 0' }}>
        <div className="container">
          <div className="sp-section-header">
            <div>
              <div className="sp-section-eyebrow">BUILDERS</div>
              <h2 className="sp-section-title">이달의 빌더</h2>
              <p className="sp-section-subtitle">주목할 만한 청소년 창업가들</p>
            </div>
            <Link to="/builders" className="btn btn-ghost" style={{ flexShrink:0 }}>
              전체 보기 <ChevronRight size={14}/>
            </Link>
          </div>
          <div className="sp-empty" style={{ padding:'48px 0' }}>
            <Users size={36} style={{ opacity:.2,marginBottom:8 }}/>
            <p className="sp-empty-title">빌더들이 합류하면 여기에 표시됩니다</p>
            <button className="btn btn-spark" onClick={()=>navigate('/signup')} style={{ marginTop:12,display:'flex',alignItems:'center',gap:6 }}>
              <Zap size={14}/> 빌더로 합류하기
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
