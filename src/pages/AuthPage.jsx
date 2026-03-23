import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Zap, ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function AuthPage({ mode = 'login' }) {
  const [isLogin, setIsLogin] = useState(mode === 'login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [role, setRole] = useState('builder')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const navigate = useNavigate()

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` }
    })
  }

  const signInWithGitHub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/` }
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        navigate('/')
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        if (data.user) {
          await supabase.from('sparkship_profiles').upsert({
            id: data.user.id,
            username: username || email.split('@')[0],
            display_name: name,
            role,
          })
        }
        setDone(true)
      }
    } catch(e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (done) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ width: 60, height: 60, borderRadius: 16, background: 'var(--spark-dim)', border: '1px solid var(--spark)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Zap size={28} color="var(--spark)" fill="var(--spark)" />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>이메일을 확인하세요 ⚡</h2>
        <p style={{ color: 'var(--text-3)', fontSize: 14 }}><strong>{email}</strong>로 인증 링크를 보냈습니다</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-4)', fontSize: 13, marginBottom: 32 }}>
          <ArrowLeft size={14} /> 홈으로
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, var(--spark), var(--spark-dk))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={18} color="#000" fill="#000" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em' }}>spark<span style={{ color: 'var(--spark)' }}>ship</span></span>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{isLogin ? '로그인' : '시작하기'}</h1>
        <p style={{ color: 'var(--text-3)', fontSize: 14, marginBottom: 28 }}>
          {isLogin ? '계정에 로그인하세요' : '청소년 창업가로 등록하거나 스카우터로 참여하세요'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {!isLogin && (
            <>
              <div>
                <label style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 6, display: 'block' }}>이름 *</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="홍길동" required />
              </div>
              <div>
                <label style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 6, display: 'block' }}>사용자명 *</label>
                <input value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,''))} placeholder="gildong_hong" required />
              </div>
              <div>
                <label style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 6, display: 'block' }}>역할 *</label>
                <select value={role} onChange={e => setRole(e.target.value)}>
                  <option value="builder">🚀 빌더 (청소년 창업가)</option>
                  <option value="scout">🔍 스카우터 (기업 담당자)</option>
                  <option value="mentor">💡 멘토</option>
                </select>
              </div>
            </>
          )}
          <div>
            <label style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 6, display: 'block' }}>이메일 *</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="hello@example.com" required />
          </div>
          <div>
            <label style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 6, display: 'block' }}>비밀번호 *</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="8자 이상" minLength={8} required />
          </div>
          {error && <p style={{ fontSize: 13, color: 'var(--red)', padding: '10px 14px', background: 'rgba(239,68,68,.08)', borderRadius: 8 }}>{error}</p>}
          <button type="submit" className="btn-spark" disabled={loading} style={{ height: 44, fontWeight: 700, justifyContent: 'center' }}>
            {loading ? '처리 중...' : isLogin ? '로그인' : '시작하기'}
          </button>
        </form>

        {/* 구분선 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--line-2)' }} />
          <span style={{ fontSize: 12, color: 'var(--text-4)', fontFamily: 'var(--f-mono)' }}>또는</span>
          <div style={{ flex: 1, height: 1, background: 'var(--line-2)' }} />
        </div>

        {/* 소셜 로그인 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
          <button type="button" onClick={signInWithGoogle}
            style={{ height: 44, borderRadius: 8, border: '1px solid var(--line-3)', background: 'var(--bg-3)', color: 'var(--text-1)', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'var(--t-fast)' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--spark)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--line-3)'}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google로 {isLogin ? '로그인' : '시작하기'}
          </button>
          <button type="button" onClick={signInWithGitHub}
            style={{ height: 44, borderRadius: 8, border: '1px solid var(--line-3)', background: 'var(--bg-3)', color: 'var(--text-1)', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'var(--t-fast)' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--spark)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--line-3)'}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            GitHub로 {isLogin ? '로그인' : '시작하기'}
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-3)' }}>
          {isLogin ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}
          {' '}
          <button onClick={() => setIsLogin(!isLogin)} style={{ color: 'var(--spark)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>
            {isLogin ? '회원가입' : '로그인'}
          </button>
        </p>
      </div>
    </div>
  )
}
