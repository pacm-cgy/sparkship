import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, ArrowRight, Search, ChevronRight, Star, Users, Cpu, Globe, Code2, BookOpen, Rocket, Target, Award, TrendingUp } from 'lucide-react'
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

// ── 온보딩 유도 스텝 카드 (빈 상태에서 표시) ────────────────────
function OnboardingSteps({ onAction }) {
  const steps = [
    {
      step: '01',
      icon: <Rocket size={22} color="#f97316" />,
      title: '포트폴리오 만들기',
      desc: '아이디어, 프로토타입, 완성 서비스까지 — 단계별로 프로젝트를 등록하세요',
      cta: '지금 등록하기',
      href: '/new',
      color: 'rgba(249,115,22,0.08)',
      border: 'rgba(249,115,22,0.2)',
    },
    {
      step: '02',
      icon: <Target size={22} color="#f59e0b" />,
      title: '챌린지 참여하기',
      desc: 'PACM 창업 챌린지에 참여하여 기업의 실제 문제를 해결하고 주목받으세요',
      cta: '챌린지 보기',
      href: '/explore',
      color: 'rgba(245,158,11,0.08)',
      border: 'rgba(245,158,11,0.2)',
    },
    {
      step: '03',
      icon: <Award size={22} color="#22c55e" />,
      title: '기업 스카우터 연결',
      desc: '완성된 포트폴리오가 기업 스카우터에게 직접 노출됩니다. 인턴·협업 기회를 잡으세요',
      cta: '스카우터 보기',
      href: '/scout',
      color: 'rgba(34,197,94,0.08)',
      border: 'rgba(34,197,94,0.2)',
    },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
      {steps.map(s => (
        <Link key={s.step} to={s.href} style={{ textDecoration: 'none' }}>
          <div style={{
            background: s.color, border: `1px solid ${s.border}`,
            borderRadius: 'var(--r-xl)', padding: '28px 24px',
            cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
            height: '100%',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: '11px', color: 'var(--text-3)', marginBottom: '14px', letterSpacing: '1px' }}>
              STEP {s.step}
            </div>
            <div style={{ marginBottom: '10px' }}>{s.icon}</div>
            <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-1)', marginBottom: '8px', lineHeight: 1.3 }}>
              {s.title}
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-3)', lineHeight: 1.6, marginBottom: '18px' }}>
              {s.desc}
            </p>
            <div style={{
              fontFamily: 'var(--f-mono)', fontSize: '11px',
              color: '#f97316', letterSpacing: '1px',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              {s.cta} <ArrowRight size={11} />
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

// ── Insightship 연동 배너 ─────────────────────────────────────────
function InsightshipBanner() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #080a14 0%, #0f1626 100%)',
      border: '1px solid rgba(99,102,241,0.25)',
      borderRadius: 'var(--r-xl)', padding: '24px 28px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: '20px', flexWrap: 'wrap', marginTop: '40px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '40px', height: '40px',
          background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px', flexShrink: 0,
        }}>💡</div>
        <div>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', color: '#818cf8', letterSpacing: '2px', marginBottom: '4px' }}>
            INSIGHTSHIP · 연계 서비스
          </div>
          <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-1)' }}>
            창업 인사이트가 필요하신가요?
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '2px' }}>
            AI 트렌드 분석 · 창업 뉴스 · 인사이트 아티클 — 무료 제공
          </div>
        </div>
      </div>
      <a
        href="https://www.insightship.pacm.kr"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          flexShrink: 0,
          background: 'transparent', color: '#818cf8',
          border: '1px solid rgba(99,102,241,0.4)',
          fontFamily: 'var(--f-mono)', fontSize: '11px',
          fontWeight: 700, letterSpacing: '1px',
          padding: '8px 18px', textDecoration: 'none',
          transition: 'all 0.2s',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; e.currentTarget.style.borderColor = '#818cf8' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)' }}
      >
        Insightship 방문하기 <ArrowRight size={11} />
      </a>
    </div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const [cat, setCat] = useState('all')

  const { data: statsData = [] } = useQuery({
    queryKey: ['sparkship_stats'],
    queryFn: async () => { const { data } = await supabase.from('sparkship_stats').select('*'); return data || [] }
  })
  const statMap = Object.fromEntries(statsData.map(s => [s.key, s.value]))
  const { data: featured = [], isLoading } = useProjects({ featured: true, limit: 6 })
  const { data: latest = [] } = useProjects({ limit: 8 })
  const { data: topBuilders = [] } = useQuery({
    queryKey: ['top_builders'],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, startup_name, school, bio')
        .eq('role', 'builder')
        .limit(6)
      return data || []
    }
  })

  const display = cat === 'all'
    ? (featured.length ? featured : latest).slice(0, 6)
    : latest.filter(p => p.category === cat).slice(0, 6)

  const isEmpty = !isLoading && display.length === 0
  const noBuilders = !isLoading && topBuilders.length === 0

  return (
    <div>
      {/* ── 히어로 */}
      <section className="sp-hero">
        <div className="sp-hero-bg" />
        <div className="sp-hero-grid" />
        <div className="sp-hero-badge"><Zap size={11} fill="currentColor" />BETA — 지금 무료로 시작하세요</div>
        <h1 className="sp-hero-title">
          청소년 창업가의<br />
          <span style={{ color: 'var(--spark)' }}>가능성을 발견하세요</span>
        </h1>
        <p className="sp-hero-sub">
          아이디어부터 실제 서비스까지. 청소년 창업가의 포트폴리오와 기업 스카우터가 직접 연결되는 플랫폼.
        </p>
        <div className="sp-hero-actions">
          <button className="btn btn-spark btn-lg" onClick={() => navigate('/signup')}>
            포트폴리오 등록하기 <ArrowRight size={16} />
          </button>
          <button className="btn btn-outline btn-lg" onClick={() => navigate('/explore')}>
            <Search size={15} /> 프로젝트 탐색
          </button>
        </div>
        <div className="sp-hero-stats">
          {STATS.map(s => (
            <div key={s.key} style={{ textAlign: 'center' }}>
              <div className="sp-hero-stat-num">{statMap[s.key] ? Number(statMap[s.key]).toLocaleString() : 0}{s.unit}</div>
              <div className="sp-hero-stat-label">{s.label}</div>
              <div className="sp-hero-stat-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 프로젝트 갤러리 */}
      <section className="sp-section" style={{ borderTop: '1px solid var(--line-1)' }}>
        <div className="container">
          <div className="sp-section-header">
            <div>
              <div className="sp-section-eyebrow">FEATURED PROJECTS</div>
              <h2 className="sp-section-title">주목받는 프로젝트</h2>
              <p className="sp-section-subtitle">청소년 빌더들의 최신 창업 프로젝트</p>
            </div>
            <Link to="/explore" className="btn btn-ghost" style={{ flexShrink: 0 }}>
              전체 보기 <ChevronRight size={14} />
            </Link>
          </div>
          <div className="sp-filter-bar" style={{ marginBottom: 24 }}>
            {CATS.map(c => (
              <button key={c.key} className={`sp-filter-btn${cat === c.key ? ' active' : ''}`} onClick={() => setCat(c.key)}>
                {c.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="sp-grid-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden', border: '1px solid var(--line-1)' }}>
                  <div className="skeleton" style={{ aspectRatio: '16/9', width: '100%' }} />
                  <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div className="skeleton" style={{ height: 17, width: '68%', borderRadius: 4 }} />
                    <div className="skeleton" style={{ height: 13, width: '90%', borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : !isEmpty ? (
            <div className="sp-grid-3">{display.map(p => <ProjectCard key={p.id} project={p} />)}</div>
          ) : (
            /* 빈 상태 → 온보딩 3단계 카드 */
            <div>
              <div style={{
                textAlign: 'center', padding: '40px 0 32px',
                borderBottom: '1px solid var(--line-1)', marginBottom: '32px',
              }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)',
                  borderRadius: '100px', padding: '6px 16px', marginBottom: '20px',
                }}>
                  <Zap size={12} color="#f97316" fill="#f97316" />
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: '11px', color: '#f97316', letterSpacing: '1px' }}>
                    첫 번째 빌더가 되어보세요
                  </span>
                </div>
                <h3 style={{ fontFamily: 'var(--f-display)', fontSize: '22px', fontWeight: 800, marginBottom: '10px', letterSpacing: '-0.03em' }}>
                  아직 등록된 프로젝트가 없습니다
                </h3>
                <p style={{ color: 'var(--text-3)', fontSize: '14px', maxWidth: '420px', margin: '0 auto', lineHeight: 1.7 }}>
                  지금 바로 포트폴리오를 등록하고 기업 스카우터에게 발견될 기회를 만드세요
                </p>
              </div>
              <OnboardingSteps />
              <InsightshipBanner />
            </div>
          )}
        </div>
      </section>

      {/* ── 스카우터 CTA */}
      <section style={{ borderTop: '1px solid var(--line-1)', padding: '64px 0' }}>
        <div className="container">
          <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--spark-border)',
            borderRadius: 'var(--r-2xl)', padding: 'clamp(32px,5vw,56px)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 40, flexWrap: 'wrap', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, background: 'radial-gradient(circle,rgba(245,158,11,.07) 0%,transparent 70%)', pointerEvents: 'none' }} />
            <div>
              <div className="sp-section-eyebrow" style={{ marginBottom: 8 }}>FOR SCOUTS</div>
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(22px,3vw,30px)', fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1.2, marginBottom: 12 }}>
                차세대 창업가를<br />직접 발굴하세요
              </h2>
              <p style={{ color: 'var(--text-3)', fontSize: 14, lineHeight: 1.7, maxWidth: 380 }}>
                청소년 창업가들의 포트폴리오를 보고, 직접 연락해 투자·멘토링·협업 기회를 만드세요.
              </p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px', flexWrap: 'wrap' }}>
                {['인재 발굴', 'CSR 활동', '인턴십 연결', '멘토링'].map(t => (
                  <span key={t} style={{
                    fontFamily: 'var(--f-mono)', fontSize: '10px',
                    color: '#f97316', background: 'rgba(249,115,22,0.08)',
                    border: '1px solid rgba(249,115,22,0.2)',
                    padding: '3px 10px', borderRadius: '2px',
                  }}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
              <button className="btn btn-spark btn-lg" onClick={() => navigate('/scout')}>
                <Star size={15} /> 스카우터 시작하기
              </button>
              <button className="btn btn-outline" onClick={() => navigate('/explore')}>
                프로젝트 둘러보기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 빌더 섹션 */}
      <section style={{ borderTop: '1px solid var(--line-1)', background: 'var(--bg-1)', padding: '64px 0' }}>
        <div className="container">
          <div className="sp-section-header">
            <div>
              <div className="sp-section-eyebrow">BUILDERS</div>
              <h2 className="sp-section-title">이달의 빌더</h2>
              <p className="sp-section-subtitle">주목할 만한 청소년 창업가들</p>
            </div>
            <Link to="/builders" className="btn btn-ghost" style={{ flexShrink: 0 }}>
              전체 보기 <ChevronRight size={14} />
            </Link>
          </div>

          {noBuilders ? (
            /* 빌더 없음 → 참여 유도 강화 */
            <div style={{
              background: 'var(--bg-card)', border: '1px dashed rgba(249,115,22,0.3)',
              borderRadius: 'var(--r-xl)', padding: '48px 32px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.7 }}>🚀</div>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: '20px', fontWeight: 800, marginBottom: '10px', letterSpacing: '-0.02em' }}>
                첫 번째 빌더가 되어주세요
              </div>
              <p style={{ color: 'var(--text-3)', fontSize: '14px', maxWidth: '360px', margin: '0 auto 24px', lineHeight: 1.7 }}>
                포트폴리오를 등록하면 이달의 빌더로 선정될 기회가 생깁니다.<br />
                기업 스카우터들이 주목하고 있습니다.
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="btn btn-spark" onClick={() => navigate('/signup')} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Zap size={14} /> 빌더로 합류하기
                </button>
                <button className="btn btn-outline" onClick={() => navigate('/new')}>
                  프로젝트 등록하기
                </button>
              </div>
              <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', maxWidth: '500px', margin: '32px auto 0' }}>
                {[
                  { icon: '🎯', text: '기업 스카우터 직접 연결' },
                  { icon: '🏆', text: '우수 빌더 시상' },
                  { icon: '💼', text: '인턴십 기회 제공' },
                ].map(item => (
                  <div key={item.text} style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid var(--line-1)',
                    borderRadius: 'var(--r-lg)', padding: '14px 10px', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '22px', marginBottom: '6px' }}>{item.icon}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)', lineHeight: 1.4 }}>{item.text}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {topBuilders.map(b => (
                <Link key={b.id} to={`/profile/${b.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'var(--bg-card)', border: '1px solid var(--line-1)',
                    borderRadius: 'var(--r-xl)', padding: '20px', textAlign: 'center',
                    transition: 'border-color 0.2s, transform 0.2s',
                    cursor: 'pointer',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--spark)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line-1)'; e.currentTarget.style.transform = 'none' }}
                  >
                    <div style={{
                      width: '52px', height: '52px', borderRadius: '50%',
                      background: 'rgba(249,115,22,0.15)', border: '2px solid rgba(249,115,22,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 10px', fontSize: '20px', fontWeight: 700, color: '#f97316',
                      overflow: 'hidden',
                    }}>
                      {b.avatar_url
                        ? <img src={b.avatar_url} alt={b.display_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : (b.display_name?.[0] || '?')}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{b.display_name}</div>
                    {b.startup_name && <div style={{ fontSize: '11px', color: '#f97316', fontFamily: 'var(--f-mono)', marginBottom: '4px' }}>{b.startup_name}</div>}
                    {b.school && <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{b.school}</div>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
