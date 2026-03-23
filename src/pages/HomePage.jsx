import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, ArrowRight, Search, Cpu, Globe, Code2, BookOpen, ShoppingBag, Gamepad2, Users, Star, ChevronRight } from 'lucide-react'
import { useProjects } from '../hooks/useData'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import ProjectCard from '../components/ui/ProjectCard'

const CATS = [
  { key: 'all', label: '전체' },
  { key: 'ai', label: 'AI', icon: Cpu },
  { key: 'web', label: '웹', icon: Globe },
  { key: 'app', label: '앱', icon: Code2 },
  { key: 'education', label: '교육', icon: BookOpen },
  { key: 'commerce', label: '커머스', icon: ShoppingBag },
  { key: 'game', label: '게임', icon: Gamepad2 },
]

const STATS = [
  { key: 'total_builders', label: '청소년 빌더', unit: '명', desc: '포트폴리오 등록' },
  { key: 'total_projects', label: '프로젝트', unit: '개', desc: '아이디어 ~ 출시' },
  { key: 'total_contacts', label: '스카우트 연락', unit: '건', desc: '기업 발굴 의뢰' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const [cat, setCat] = useState('all')

  const { data: statsData = [] } = useQuery({
    queryKey: ['sparkship_stats'],
    queryFn: async () => {
      const { data } = await supabase.from('sparkship_stats').select('*')
      return data || []
    }
  })
  const statMap = Object.fromEntries(statsData.map(s => [s.key, s.value]))
  const { data: featuredProjects = [], isLoading } = useProjects({ featured: true, limit: 6 })
  const { data: latestProjects = [] } = useProjects({ limit: 8 })

  const displayProjects = cat === 'all'
    ? (featuredProjects.length ? featuredProjects : latestProjects).slice(0, 6)
    : latestProjects.filter(p => p.category === cat).slice(0, 6)

  return (
    <div>
      {/* ── 히어로 */}
      <section className="sp-hero">
        <div className="sp-hero-bg" />
        <div className="sp-hero-grid" />

        <div className="sp-hero-badge">
          <Zap size={11} fill="currentColor" />
          BETA — 지금 무료로 시작하세요
        </div>

        <h1 className="sp-hero-title">
          청소년 창업가의<br />
          <span className="text-spark">가능성을 발견하세요</span>
        </h1>

        <p className="sp-hero-sub">
          아이디어 단계부터 실제 서비스까지. 청소년 창업가들의 포트폴리오와 기업 스카우터가 직접 연결되는 플랫폼.
        </p>

        <div className="sp-hero-actions">
          <button className="btn-spark btn-lg" onClick={() => navigate('/signup')}>
            포트폴리오 등록하기 <ArrowRight size={16} />
          </button>
          <button className="btn-outline btn-lg" onClick={() => navigate('/explore')}>
            <Search size={15} /> 프로젝트 탐색
          </button>
        </div>

        {/* 통계 */}
        <div className="sp-hero-stats">
          {STATS.map(s => (
            <div key={s.key} style={{ textAlign: 'center' }}>
              <div className="sp-hero-stat-num">
                {statMap[s.key] ? Number(statMap[s.key]).toLocaleString() : '0'}{s.unit}
              </div>
              <div className="sp-hero-stat-label">{s.label}</div>
              <div className="sp-hero-stat-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 프로젝트 갤러리 */}
      <section className="sp-section" style={{ borderTop: '1px solid var(--line-1)' }}>
        <div className="sp-container">

          <div className="sp-section-header">
            <div>
              <div className="sp-section-eyebrow">FEATURED PROJECTS</div>
              <h2 className="sp-section-title">주목받는 프로젝트</h2>
              <p className="sp-section-subtitle">청소년 빌더들의 최신 창업 프로젝트</p>
            </div>
            <Link to="/explore" className="btn-ghost" style={{ flexShrink: 0 }}>
              전체 보기 <ChevronRight size={14} />
            </Link>
          </div>

          {/* 카테고리 필터 */}
          <div className="sp-filter-bar" style={{ marginBottom: 28 }}>
            {CATS.map(c => (
              <button
                key={c.key}
                className={`sp-filter-btn${cat === c.key ? ' active' : ''}`}
                onClick={() => setCat(c.key)}
              >
                {c.icon && <c.icon size={13} />}
                {c.label}
              </button>
            ))}
          </div>

          {/* 그리드 */}
          {isLoading ? (
            <div className="sp-grid-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden', border: '1px solid var(--line-1)' }}>
                  <div className="sp-skeleton" style={{ aspectRatio: '16/9', width: '100%' }} />
                  <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div className="sp-skeleton" style={{ height: 18, width: '70%', borderRadius: 4 }} />
                    <div className="sp-skeleton" style={{ height: 13, width: '90%', borderRadius: 4 }} />
                    <div className="sp-skeleton" style={{ height: 13, width: '60%', borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : displayProjects.length > 0 ? (
            <div className="sp-grid-3">
              {displayProjects.map(p => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-3)' }}>
              <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>🚀</div>
              <p>아직 이 카테고리의 프로젝트가 없습니다</p>
              <button className="btn-spark" onClick={() => navigate('/new')} style={{ marginTop: 16 }}>
                첫 번째로 등록하기
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── 빌더 스포트라이트 */}
      <section className="sp-section" style={{ background: 'var(--bg-1)', borderTop: '1px solid var(--line-1)', borderBottom: '1px solid var(--line-1)' }}>
        <div className="sp-container">
          <div className="sp-section-header">
            <div>
              <div className="sp-section-eyebrow">BUILDERS</div>
              <h2 className="sp-section-title">이달의 빌더</h2>
              <p className="sp-section-subtitle">주목할 만한 청소년 창업가들</p>
            </div>
            <Link to="/builders" className="btn-ghost" style={{ flexShrink: 0 }}>
              전체 보기 <ChevronRight size={14} />
            </Link>
          </div>
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-4)' }}>
            <Users size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <p style={{ fontSize: 14 }}>빌더들이 합류하면 여기에 표시됩니다</p>
            <button className="btn-spark" onClick={() => navigate('/signup')} style={{ marginTop: 16 }}>
              빌더로 합류하기 <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ── 스카우터 CTA */}
      <section className="sp-section">
        <div className="sp-container">
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--spark-border)',
            borderRadius: 'var(--r-2xl)',
            padding: 'clamp(32px, 5vw, 64px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 40,
            flexWrap: 'wrap',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -60, right: -60,
              width: 300, height: 300,
              background: 'radial-gradient(circle, rgba(245,158,11,.08) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />
            <div>
              <div className="sp-section-eyebrow" style={{ marginBottom: 8 }}>FOR SCOUTS</div>
              <h2 style={{ fontFamily: 'var(--f-display)', fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: 12 }}>
                차세대 창업가를<br />직접 발굴하세요
              </h2>
              <p style={{ color: 'var(--text-3)', fontSize: 14, lineHeight: 1.7, maxWidth: 400 }}>
                청소년 창업가들의 포트폴리오를 보고, 직접 연락해 투자·멘토링·협업 기회를 만들어 보세요.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
              <button className="btn-spark btn-lg" onClick={() => navigate('/scout')}>
                <Star size={15} /> 스카우터 시작하기
              </button>
              <button className="btn-outline" onClick={() => navigate('/explore')}>
                프로젝트 둘러보기
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
