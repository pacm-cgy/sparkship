import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Zap, Compass, Users, Star, MessageSquare, Search, Bell, User, Menu, X, LogOut, Plus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store'

const NAV = [
  { path: '/explore',  label: 'Explore',   icon: Compass },
  { path: '/builders', label: 'Builders',  icon: Users },
  { path: '/scout',    label: 'Scout',     icon: Star },
  { path: '/search',   label: 'Search',    icon: Search },
]

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, setUser } = useAuthStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [msgCount, setMsgCount] = useState(0)

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  useEffect(() => {
    if (user) loadMsgCount()
  }, [user])

  async function loadMsgCount() {
    try {
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)
        .neq('sender_id', user.id)
      setMsgCount(count || 0)
    } catch {}
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    navigate('/')
  }

  return (
    <>
      <nav className="sp-nav">
        {/* 로고 */}
        <Link to="/" className="sp-logo" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:'8px' }}>
          {/* Sparkship 로고 SVG */}
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="22" fill="#0A0A0A"/>
            <path d="M28 6 L14 26 L22 26 L20 42 L34 22 L26 22 Z" fill="#F59E0B"/>
          </svg>
          <div className="sp-logo-text">Spark<span>ship</span></div>
        </Link>

        {/* 메인 링크 */}
        <div className="sp-nav-links">
          <Link to="/" className={`sp-nav-link${location.pathname === '/' ? ' active' : ''}`}>
            <Zap size={14} /> Home
          </Link>
          {NAV.map(n => {
            const Icon = n.icon
            return (
              <Link key={n.path} to={n.path} className={`sp-nav-link${isActive(n.path) ? ' active' : ''}`}>
                <Icon size={14} /> {n.label}
              </Link>
            )
          })}
        </div>

        {/* 우측 */}
        <div className="sp-nav-right">
          {user && (
            <>
              <Link to="/messages" className="btn btn-ghost btn-sm" style={{ position:'relative', padding:'6px 10px' }}>
                <MessageSquare size={16} />
                {msgCount > 0 && (
                  <span style={{
                    position:'absolute', top:2, right:2,
                    width:7, height:7, borderRadius:'50%',
                    background:'var(--spark)', border:'1.5px solid var(--bg-1)'
                  }} />
                )}
              </Link>
              <Link to="/new" className="btn btn-spark btn-sm">
                <Plus size={14} /> 프로젝트
              </Link>
              <Link to="/settings" className="btn btn-ghost btn-sm" style={{ padding:'6px 10px' }}>
                <div style={{
                  width:24, height:24, borderRadius:'50%',
                  background:'var(--spark-dim)', display:'flex',
                  alignItems:'center', justifyContent:'center',
                  color:'var(--spark)', fontWeight:700, fontSize:12
                }}>
                  {(user.email?.[0] || 'U').toUpperCase()}
                </div>
              </Link>
            </>
          )}
          {!user && (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">로그인</Link>
              <Link to="/signup" className="btn btn-spark btn-sm">시작하기</Link>
            </>
          )}

          {/* 모바일 메뉴 */}
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ display:'none', padding:'6px 8px' }}
            id="sp-mobile-btn"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* 모바일 메뉴 드롭다운 */}
      {mobileOpen && (
        <>
          <div
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.6)', zIndex:99 }}
            onClick={() => setMobileOpen(false)}
          />
          <div style={{
            position:'fixed', top:'var(--nav-h)', left:0, right:0,
            background:'var(--bg-2)', borderBottom:'1px solid var(--line-1)',
            zIndex:100, padding:16, display:'flex', flexDirection:'column', gap:8
          }}>
            <Link to="/" className="sp-nav-link" style={{ display:'flex' }} onClick={() => setMobileOpen(false)}>
              <Zap size={14} /> Home
            </Link>
            {NAV.map(n => {
              const Icon = n.icon
              return (
                <Link key={n.path} to={n.path} className="sp-nav-link" style={{ display:'flex' }} onClick={() => setMobileOpen(false)}>
                  <Icon size={14} /> {n.label}
                </Link>
              )
            })}
            {user && (
              <button onClick={handleLogout} className="sp-nav-link" style={{ color:'var(--red)', display:'flex', gap:6, alignItems:'center', background:'none', border:'none', textAlign:'left' }}>
                <LogOut size={14} /> 로그아웃
              </button>
            )}
          </div>
        </>
      )}

      <style>{`
        @media (max-width: 640px) {
          #sp-mobile-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}
