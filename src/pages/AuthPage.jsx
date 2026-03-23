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
          <button type="submit" className="btn btn-spark" disabled={loading} style={{ height: 44, fontWeight: 700, justifyContent: 'center' }}>
            {loading ? '처리 중...' : isLogin ? '로그인' : '시작하기'}
          </button>
        </form>

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
