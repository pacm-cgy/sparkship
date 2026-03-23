import { Link, useNavigate } from 'react-router-dom'
import { Zap, ArrowRight, Sparkles, Users, Search, Code2, Cpu, Globe, BookOpen, ShoppingBag, Gamepad2 } from 'lucide-react'
import { useProjects } from '../hooks/useData'
import ProjectCard from '../components/ui/ProjectCard'

const CATEGORIES = [
  { key: 'all', label: '전체', icon: null },
  { key: 'ai', label: 'AI', icon: Cpu },
  { key: 'web', label: '웹', icon: Globe },
  { key: 'app', label: '앱', icon: Code2 },
  { key: 'education', label: '교육', icon: BookOpen },
  { key: 'commerce', label: '커머스', icon: ShoppingBag },
  { key: 'game', label: '게임', icon: Gamepad2 },
]

const STATS = [
  { label: '청소년 빌더', value: '0', unit: '명', desc: '포트폴리오 등록' },
  { label: '프로젝트', value: '0', unit: '개', desc: '아이디어 ~ 출시' },
  { label: '스카우트 연락', value: '0', unit: '건', desc: '기업 발굴 의뢰' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const { data: featuredProjects = [], isLoading } = useProjects({ featured: true, limit: 6 })
  const { data: latestProjects = [] } = useProjects({ limit: 8 })

  return (
    <div>
      {/* ── 히어로 섹션 */}
      <section style={{
        padding: '80px 0 64px',
        borderBottom: '1px solid var(--line-1)',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* 배경 그로우 */}
        <div style={{
          position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(245,158,11,.06) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 100, border: '1px solid rgba(245,158,11,.3)', background: 'var(--spark-dim)', marginBottom: 24 }}>
            <Zap size={12} color="var(--spark)" fill="var(--spark)" />
            <span style={{ fontSize: 12, color: 'var(--spark)', fontFamily: 'var(--f-mono)', letterSpacing: '0.05em' }}>BETA — 지금 무료로 시작하세요</span>
          </div>

          <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.04em', marginBottom: 20 }}>
            청소년 창업가의<br />
            <span style={{ color: 'var(--spark)' }}>가능성을 발견하세요</span>
          </h1>

          <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: 'var(--text-3)', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.7 }}>
            아이디어 단계부터 실제 서비스까지. 청소년 창업가들의 프로젝트 포트폴리오와 기업이 직접 연결되는 플랫폼.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-spark btn-lg" onClick={() => navigate('/signup')}>
              포트폴리오 등록하기 <ArrowRight size={16} />
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/explore')}>
              <Search size={16} /> 프로젝트 탐색
            </button>
          </div>

          {/* 통계 */}
          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', marginTop: 56, flexWrap: 'wrap' }}>
            {STATS.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--spark)', letterSpacing: '-0.03em', fontFamily: 'var(--f-mono)' }}>
                  {s.value}<span style={{ fontSize: 16, color: 'var(--text-3)' }}>{s.unit}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 2 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-4)', fontFamily: 'var(--f-mono)' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 추천 프로젝트 */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
            <div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--spark)', letterSpacing: '0.15em', marginBottom: 6 }}>FEATURED PROJECTS</div>
              <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em' }}>추천 프로젝트</h2>
            </div>
            <Link to="/explore" className="btn btn-ghost btn-sm" style={{ color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
              전체 보기 <ArrowRight size={14} />
            </Link>
          </div>

          {isLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 320 }} />)}
            </div>
          ) : featuredProjects.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {featuredProjects.map(p => <ProjectCard key={p.id} project={p} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-4)' }}>
              <Zap size={40} style={{ marginBottom: 12, opacity: 0.2 }} />
              <p style={{ fontSize: 16, color: 'var(--text-3)', marginBottom: 6 }}>첫 번째 프로젝트를 등록해보세요</p>
              <p style={{ fontSize: 13 }}>Sparkship이 아직 비어있습니다. 당신의 프로젝트가 첫 번째가 될 수 있습니다.</p>
              <button className="btn btn-spark" style={{ marginTop: 20 }} onClick={() => navigate('/signup')}>
                지금 시작하기
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── 서비스 특징 */}
      <section style={{ padding: '64px 0', borderTop: '1px solid var(--line-1)', background: 'var(--bg-1)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--spark)', letterSpacing: '0.15em', marginBottom: 8 }}>WHY SPARKSHIP</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' }}>불꽃은 발견될 때 빛난다</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {[
              { icon: Sparkles, title: '프로젝트 포트폴리오', desc: '아이디어부터 실제 서비스까지. 나의 창업 여정을 세상에 보여주세요. 코드, 데모, 팀 정보까지 한 곳에.', color: 'var(--spark)' },
              { icon: Search, title: '기업 스카우트', desc: '기업 담당자가 직접 청소년 빌더를 발굴합니다. 프로젝트 수준과 성장 가능성을 기준으로 연락합니다.', color: 'var(--blue)' },
              { icon: Users, title: '빌더 커뮤니티', desc: '같은 목표를 가진 청소년 창업가들과 연결하세요. 팀원을 모집하고, 피드백을 주고받으세요.', color: 'var(--green)' },
            ].map((f, i) => (
              <div key={i} className="card" style={{ padding: '28px 24px' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${f.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <f.icon size={22} color={f.color} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA */}
      <section style={{ padding: '64px 0', borderTop: '1px solid var(--line-1)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Zap size={20} color="var(--spark)" fill="var(--spark)" />
            <span style={{ fontSize: 14, color: 'var(--spark)', fontFamily: 'var(--f-mono)' }}>POWERED BY PACM</span>
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 14 }}>
            당신의 불꽃을 세상에 보여주세요
          </h2>
          <p style={{ color: 'var(--text-3)', fontSize: 15, marginBottom: 28 }}>
            지금 Sparkship에 프로젝트를 등록하면 기업 스카우터가 직접 발견합니다.
          </p>
          <button className="btn btn-spark btn-lg" onClick={() => navigate('/signup')}>
            무료로 시작하기 <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  )
}
