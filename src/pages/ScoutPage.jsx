import { useNavigate } from 'react-router-dom'
import { Zap, Search, Users, TrendingUp, Award } from 'lucide-react'

const FEATURES = [
  { icon: Search, title: '정밀 탐색', desc: '스킬, 학교, 지역, 프로젝트 단계별로 원하는 빌더를 찾으세요', color: 'var(--spark)' },
  { icon: Users, title: '직접 연락', desc: '마음에 드는 빌더에게 스카우트·협업·멘토링 제안을 직접 보내세요', color: 'var(--blue)' },
  { icon: TrendingUp, title: '성장 추적', desc: '빌더의 프로젝트 이력과 성장 과정을 한눈에 파악하세요', color: 'var(--green)' },
  { icon: Award, title: '인재 검증', desc: '실제 프로젝트로 검증된 청소년 인재를 만나보세요', color: 'var(--purple)' },
]

const SCOUT_TYPES = [
  { label: '인턴십 제안', emoji: '💼', desc: '방학 인턴, 파트타임 협업' },
  { label: '창업팀 모집', emoji: '🚀', desc: '공동창업자, 팀원 합류' },
  { label: '프로젝트 의뢰', emoji: '⚡', desc: '실제 비즈니스 문제 해결' },
  { label: '멘토링', emoji: '💡', desc: '성장 조언과 네트워크 연결' },
]

export default function ScoutPage() {
  const navigate = useNavigate()

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* 히어로 */}
      <section style={{ padding: '64px 0', borderBottom: '1px solid var(--line-1)', background: 'linear-gradient(180deg, var(--bg-2) 0%, var(--bg-0) 100%)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 100, border: '1px solid rgba(245,158,11,.3)', background: 'var(--spark-dim)', marginBottom: 20 }}>
            <Zap size={12} color="var(--spark)" fill="var(--spark)" />
            <span style={{ fontSize: 12, color: 'var(--spark)', fontFamily: 'var(--f-mono)', letterSpacing: '0.05em' }}>FOR SCOUTS & MENTORS</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px,5vw,48px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.04em', marginBottom: 16 }}>
            다음 세대의<br /><span style={{ color: 'var(--spark)' }}>불꽃을 발견하세요</span>
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-3)', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.7 }}>
            아이디어 단계부터 실제 서비스까지 만들어낸 청소년 빌더들이 Sparkship에 있습니다. 지금 탐색하고 직접 연락하세요.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-spark btn-lg" onClick={() => navigate('/builders')}>
              <Search size={16} /> 빌더 탐색하기
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/signup')}>
              스카우터로 가입
            </button>
          </div>
        </div>
      </section>

      {/* 연락 유형 */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--spark)', letterSpacing: '0.15em', marginBottom: 8 }}>HOW IT WORKS</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em' }}>어떤 형태로든 연결하세요</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 12 }}>
            {SCOUT_TYPES.map(t => (
              <div key={t.label} className="card" style={{ padding: '24px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{t.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{t.label}</div>
                <div style={{ fontSize: 13, color: 'var(--text-3)' }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 기능 */}
      <section style={{ padding: '64px 0', borderTop: '1px solid var(--line-1)', background: 'var(--bg-1)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: 16 }}>
            {FEATURES.map(f => (
              <div key={f.title} className="card" style={{ padding: '24px 20px' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${f.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <f.icon size={20} color={f.color} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '64px 0', borderTop: '1px solid var(--line-1)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12 }}>지금 시작하세요</h2>
          <p style={{ color: 'var(--text-3)', marginBottom: 28, fontSize: 14 }}>가입 후 즉시 빌더 탐색 및 연락이 가능합니다</p>
          <button className="btn btn-spark btn-lg" onClick={() => navigate('/signup')}>
            스카우터로 무료 가입 <Zap size={16} fill="currentColor" />
          </button>
        </div>
      </section>
    </div>
  )
}
