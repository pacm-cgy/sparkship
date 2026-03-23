import { useNavigate } from 'react-router-dom'
import { Star, Search, MessageSquare, Zap, CheckCircle } from 'lucide-react'

const FEATURES = [
  { icon:'🔍', title:'프로젝트 탐색', desc:'AI·웹·앱 등 카테고리별로 청소년 창업가의 프로젝트를 한눈에 확인' },
  { icon:'📩', title:'직접 연락', desc:'마음에 드는 빌더에게 스카우트 문의를 바로 전송' },
  { icon:'📊', title:'포트폴리오 분석', desc:'프로젝트 진행 단계, 기술 스택, 성과 지표를 상세히 확인' },
  { icon:'🤝', title:'멘토링 연결', desc:'투자·멘토링·협업 등 다양한 방식으로 청소년 창업가를 지원' },
]
const PLANS = [
  { name:'Free', price:0, features:['프로필 열람 무제한','월 5회 연락','기본 검색 필터'], cta:'무료로 시작', featured:false },
  { name:'Scout Pro', price:29000, period:'월', features:['연락 무제한','고급 필터 (기술스택·단계·연령)','읽음 확인','우선 노출'], cta:'Pro 시작하기', featured:true },
  { name:'Enterprise', price:null, features:['팀 계정 (최대 10명)','전담 매니저','커스텀 계약','API 연동'], cta:'문의하기', featured:false },
]

export default function ScoutPage() {
  const navigate = useNavigate()

  return (
    <div className="sp-page">
      {/* 히어로 */}
      <section style={{ borderBottom:'1px solid var(--line-1)',padding:'72px 0',textAlign:'center',position:'relative',overflow:'hidden' }}>
        <div style={{ position:'absolute',inset:0,background:'radial-gradient(ellipse 800px 500px at 50% 0%,rgba(245,158,11,.06) 0%,transparent 65%)',pointerEvents:'none' }}/>
        <div className="container" style={{ position:'relative' }}>
          <div className="sp-section-eyebrow" style={{ marginBottom:16 }}>FOR SCOUTS</div>
          <h1 style={{ fontFamily:'var(--f-display)',fontSize:'clamp(32px,5vw,56px)',fontWeight:800,letterSpacing:'-.05em',lineHeight:1.05,marginBottom:20 }}>
            차세대 창업가를<br/><span style={{ color:'var(--spark)' }}>직접 발굴하세요</span>
          </h1>
          <p style={{ fontSize:'clamp(15px,2vw,17px)',color:'var(--text-3)',maxWidth:520,margin:'0 auto 36px',lineHeight:1.7 }}>
            Sparkship에서 청소년 창업가의 포트폴리오를 탐색하고, 투자·멘토링·협업 기회를 만드세요.
          </p>
          <div style={{ display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap' }}>
            <button className="btn btn-spark btn-lg" onClick={()=>navigate('/builders')}><Star size={15}/> 빌더 탐색하기</button>
            <button className="btn btn-outline btn-lg" onClick={()=>navigate('/signup')}>스카우터 등록</button>
          </div>
        </div>
      </section>

      {/* 기능 그리드 */}
      <section className="sp-section">
        <div className="container">
          <div style={{ textAlign:'center',marginBottom:40 }}>
            <div className="sp-section-eyebrow">FEATURES</div>
            <h2 className="sp-section-title">스카우터를 위한 기능</h2>
          </div>
          <div className="sp-grid-4">
            {FEATURES.map((f,i)=>(
              <div key={i} style={{ background:'var(--bg-card)',border:'1px solid var(--line-1)',borderRadius:'var(--r-xl)',padding:24,transition:'var(--t-mid)' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--spark-border)';e.currentTarget.style.transform='translateY(-2px)'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--line-1)';e.currentTarget.style.transform='none'}}>
                <div style={{ fontSize:28,marginBottom:14 }}>{f.icon}</div>
                <div style={{ fontFamily:'var(--f-display)',fontSize:15,fontWeight:700,marginBottom:8,letterSpacing:'-.02em' }}>{f.title}</div>
                <p style={{ fontSize:13,color:'var(--text-3)',lineHeight:1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 요금제 */}
      <section style={{ borderTop:'1px solid var(--line-1)',background:'var(--bg-1)',padding:'64px 0' }}>
        <div className="container">
          <div style={{ textAlign:'center',marginBottom:40 }}>
            <div className="sp-section-eyebrow">PRICING</div>
            <h2 className="sp-section-title">합리적인 요금제</h2>
            <p className="sp-section-subtitle">청소년 빌더 발굴에 필요한 모든 것</p>
          </div>
          <div className="sp-grid-3" style={{ maxWidth:900,margin:'0 auto' }}>
            {PLANS.map((p,i)=>(
              <div key={i} className={`pricing-card${p.featured?' featured':''}`}
                style={{ position:'relative',boxShadow:p.featured?'var(--shadow-spark)':'none' }}>
                {p.featured&&<span className="badge badge-spark" style={{ position:'absolute',top:-12,left:'50%',transform:'translateX(-50%)' }}>추천</span>}
                <div>
                  <div style={{ fontSize:13,fontWeight:600,color:'var(--text-3)',marginBottom:8 }}>{p.name}</div>
                  {p.price!==null ? (
                    <div>
                      <span style={{ fontFamily:'var(--f-display)',fontSize:32,fontWeight:800,letterSpacing:'-.04em' }}>
                        {p.price===0?'무료':p.price.toLocaleString()+'원'}
                      </span>
                      {p.period&&<span style={{ fontSize:13,color:'var(--text-3)',marginLeft:4 }}>/{p.period}</span>}
                    </div>
                  ) : (
                    <div style={{ fontFamily:'var(--f-display)',fontSize:24,fontWeight:800 }}>문의</div>
                  )}
                </div>
                <div style={{ display:'flex',flexDirection:'column',gap:8,flex:1 }}>
                  {p.features.map((f,j)=>(
                    <div key={j} style={{ display:'flex',alignItems:'center',gap:8,fontSize:13,color:'var(--text-2)' }}>
                      <CheckCircle size={14} color="var(--green)" style={{ flexShrink:0 }}/>{f}
                    </div>
                  ))}
                </div>
                <button
                  className={`btn ${p.featured?'btn-spark':'btn-outline'}`}
                  style={{ width:'100%',justifyContent:'center',marginTop:4 }}
                  onClick={()=>navigate(p.price===null?'/contact/support':'/signup')}>
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
