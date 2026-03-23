import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Zap, Search, Menu, X, Plus, Bell } from 'lucide-react'
import { useAuthStore } from '../../store'

export default function Header() {
  const { user, profile, signOut } = useAuthStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const nav = [
    { label: '탐색', path: '/explore' },
    { label: '빌더', path: '/builders' },
    { label: '스카우트', path: '/scout' },
  ]

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(6,6,6,0.85)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--line-1)',
      height: 'var(--nav-h)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: '100%', gap: 24 }}>
        {/* 로고 */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--spark) 0%, var(--spark-dk) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Zap size={16} color="#000" fill="#000" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: '-0.03em' }}>
            spark<span style={{ color: 'var(--spark)' }}>ship</span>
          </span>
        </Link>

        {/* 네비 */}
        <nav style={{ display: 'flex', gap: 4, flex: 1 }} className="no-mobile">
          {nav.map(n => (
            <Link key={n.path} to={n.path} style={{
              padding: '6px 12px', borderRadius: 8, fontSize: 14, fontWeight: 500,
              color: pathname === n.path ? 'var(--text-1)' : 'var(--text-3)',
              background: pathname === n.path ? 'var(--bg-3)' : 'transparent',
              transition: 'var(--t-fast)',
            }}
            onMouseEnter={e => { if (pathname !== n.path) e.currentTarget.style.color = 'var(--text-1)' }}
            onMouseLeave={e => { if (pathname !== n.path) e.currentTarget.style.color = 'var(--text-3)' }}>
              {n.label}
            </Link>
          ))}
        </nav>

        {/* 우측 액션 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
          <button className="icon-btn" onClick={() => navigate('/search')}>
            <Search size={18} />
          </button>
          {user ? (
            <>
              <button className="btn btn-spark btn-sm" onClick={() => navigate('/new')}>
                <Plus size={14} /> 프로젝트 등록
              </button>
              <button className="icon-btn"><Bell size={18} /></button>
              <div onClick={() => navigate(`/u/${profile?.username}`)}
                style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--spark-dim)', border: '1px solid var(--spark)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: 'var(--spark)' }}>
                {(profile?.display_name || 'U')[0].toUpperCase()}
              </div>
            </>
          ) : (
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')}>로그인</button>
              <button className="btn btn-spark btn-sm" onClick={() => navigate('/signup')}>시작하기</button>
            </>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .no-mobile { display: none !important; } }
      `}</style>
    </header>
  )
}
