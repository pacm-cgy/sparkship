import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Zap, Search, Plus, Bell, Menu, X, ChevronDown } from 'lucide-react'
import { useAuthStore } from '../../store'

export default function Header() {
  const { user, profile, signOut } = useAuthStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const isActive = (path) => pathname === path || pathname.startsWith(path + '/')

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(6,6,6,0.88)', backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--line-1)', height: 'var(--nav-h)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: '100%', gap: 4 }}>
        {/* 로고 */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginRight: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,var(--spark),var(--spark-dk))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={15} color="#000" fill="#000" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: '-0.03em' }}>
            spark<span style={{ color: 'var(--spark)' }}>ship</span>
          </span>
        </Link>

        {/* 데스크탑 네비 */}
        <nav className="nav-desktop" style={{ display: 'flex', gap: 2, flex: 1 }}>
          {[
            { label: '탐색', path: '/explore' },
            { label: '빌더', path: '/builders' },
            { label: '스카우트', path: '/scout' },
          ].map(n => (
            <Link key={n.path} to={n.path} style={{
              padding: '6px 12px', borderRadius: 8, fontSize: 14, fontWeight: 500,
              color: isActive(n.path) ? 'var(--text-1)' : 'var(--text-3)',
              background: isActive(n.path) ? 'var(--bg-3)' : 'transparent',
              transition: 'var(--t-fast)',
            }}
            onMouseEnter={e => { if (!isActive(n.path)) e.currentTarget.style.color = 'var(--text-1)' }}
            onMouseLeave={e => { if (!isActive(n.path)) e.currentTarget.style.color = 'var(--text-3)' }}>
              {n.label}
            </Link>
          ))}
        </nav>

        {/* 우측 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
          <button className="icon-btn" onClick={() => navigate('/search')}><Search size={18} /></button>

          {user ? (
            <>
              <button className="btn btn-spark btn-sm nav-desktop" onClick={() => navigate('/new')} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Plus size={14} /> 등록
              </button>
              {/* 프로필 드롭다운 */}
              <div style={{ position: 'relative' }}>
                <button onClick={() => setDropOpen(!dropOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer', transition: 'var(--t-fast)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-3)'}
                  onMouseLeave={e => { if (!dropOpen) e.currentTarget.style.background = 'transparent' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--spark-dim)', border: '1px solid var(--spark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--spark)' }}>
                    {(profile?.display_name || 'U')[0].toUpperCase()}
                  </div>
                  <ChevronDown size={13} color="var(--text-3)" style={{ transition: 'var(--t-fast)', transform: dropOpen ? 'rotate(180deg)' : 'none' }} />
                </button>

                {dropOpen && (
                  <>
                    <div onClick={() => setDropOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
                    <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: 6, width: 180, background: 'var(--bg-2)', border: '1px solid var(--line-2)', borderRadius: 10, padding: '6px', zIndex: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                      {profile?.username && (
                        <div style={{ padding: '8px 12px', marginBottom: 4, borderBottom: '1px solid var(--line-1)' }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{profile.display_name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-4)', fontFamily: 'var(--f-mono)' }}>@{profile.username}</div>
                        </div>
                      )}
                      {[
                        { label: '내 프로필', path: `/u/${profile?.username}` },
                        { label: '프로젝트 등록', path: '/new' },
                        { label: '설정', path: '/settings' },
                      ].map(item => (
                        <button key={item.path} onClick={() => { navigate(item.path); setDropOpen(false) }}
                          style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: 6, fontSize: 14, color: 'var(--text-2)', background: 'none', border: 'none', cursor: 'pointer', transition: 'var(--t-fast)' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-3)'; e.currentTarget.style.color = 'var(--text-1)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-2)' }}>
                          {item.label}
                        </button>
                      ))}
                      <div style={{ borderTop: '1px solid var(--line-1)', marginTop: 4, paddingTop: 4 }}>
                        <button onClick={() => { signOut(); setDropOpen(false); navigate('/') }}
                          style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: 6, fontSize: 14, color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer' }}>
                          로그아웃
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <button className="btn btn-ghost btn-sm nav-desktop" onClick={() => navigate('/login')}>로그인</button>
              <button className="btn btn-spark btn-sm" onClick={() => navigate('/signup')}>시작하기</button>
            </>
          )}

          {/* 모바일 햄버거 */}
          <button className="icon-btn nav-mobile" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {menuOpen && (
        <div style={{ background: 'var(--bg-1)', borderBottom: '1px solid var(--line-1)', padding: '12px 16px' }}>
          {['/explore','/builders','/scout'].map(p => (
            <Link key={p} to={p} onClick={() => setMenuOpen(false)}
              style={{ display: 'block', padding: '10px 12px', fontSize: 15, color: isActive(p) ? 'var(--spark)' : 'var(--text-2)', borderRadius: 8 }}>
              {p === '/explore' ? '탐색' : p === '/builders' ? '빌더' : '스카우트'}
            </Link>
          ))}
          {!user && (
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => { navigate('/login'); setMenuOpen(false) }}>로그인</button>
              <button className="btn btn-spark btn-sm" style={{ flex: 1 }} onClick={() => { navigate('/signup'); setMenuOpen(false) }}>시작하기</button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .nav-desktop { display: none !important; }
          .nav-mobile  { display: inline-flex !important; }
        }
        @media (min-width: 641px) {
          .nav-mobile { display: none !important; }
        }
      `}</style>
    </header>
  )
}
