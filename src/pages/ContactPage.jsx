import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Zap, Send } from 'lucide-react'
import { useProfile } from '../hooks/useData'
import { useAuthStore } from '../store'
import { supabase } from '../lib/supabase'

const TYPES = [
  { value: 'scout',  label: '🔍 스카우트 제안',  desc: '인턴십, 채용, 파트타임 협업' },
  { value: 'mentor', label: '💡 멘토링 제안',     desc: '성장을 위한 조언과 피드백' },
  { value: 'collab', label: '🤝 협업 제안',       desc: '프로젝트 협력, 파트너십' },
  { value: 'inquiry','label': '💬 일반 문의',     desc: '프로젝트나 기술에 대한 질문' },
]

export default function ContactPage() {
  const { username } = useParams()
  const { user, profile: myProfile } = useAuthStore()
  const { data: targetProfile } = useProfile(username)
  const navigate = useNavigate()

  const [type, setType] = useState('scout')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  if (!user) return (
    <div className="container" style={{ paddingTop: 80, textAlign: 'center' }}>
      <p style={{ color: 'var(--text-3)', marginBottom: 16 }}>로그인이 필요합니다</p>
      <button className="btn btn-spark" onClick={() => navigate('/login')}>로그인하기</button>
    </div>
  )

  const handleSubmit = async e => {
    e.preventDefault()
    if (!subject || !message) { setError('제목과 내용을 입력해주세요'); return }
    setLoading(true)
    try {
      // 1) DB 저장
      const { error: dbErr } = await supabase.from('sparkship_contacts').insert({
        from_id: user.id,
        to_id: targetProfile.id,
        subject,
        message,
        contact_type: type,
      })
      if (dbErr) throw dbErr

      // 2) 이메일 발송 API
      await fetch('/api/sparkship-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toUsername: username,
          toEmail: targetProfile.email,
          fromName: myProfile?.display_name || '익명',
          fromCompany: myProfile?.company_name,
          fromRole: myProfile?.role,
          contactType: type,
          subject,
          message,
        })
      })
      setDone(true)
    } catch(e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (done) return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: 40, maxWidth: 400 }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: 'var(--spark-dim)', border: '2px solid var(--spark)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Zap size={28} color="var(--spark)" fill="var(--spark)" />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>연락이 전송됐습니다 ⚡</h2>
        <p style={{ color: 'var(--text-3)', fontSize: 14, lineHeight: 1.7 }}>
          <strong>{targetProfile?.display_name}</strong>님에게 메시지를 보냈습니다.<br />
          답변이 오면 이메일로 알려드릴게요.
        </p>
        <button className="btn btn-spark" style={{ marginTop: 24 }} onClick={() => navigate(`/u/${username}`)}>
          프로필로 돌아가기
        </button>
      </div>
    </div>
  )

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 600 }}>
      <Link to={`/u/${username}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-4)', fontSize: 14, marginBottom: 32 }}>
        <ArrowLeft size={14} /> {username}의 프로필로
      </Link>

      {/* 수신자 정보 */}
      {targetProfile && (
        <div className="card" style={{ padding: '16px 20px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--spark-dim)', border: '1px solid var(--spark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: 'var(--spark)', flexShrink: 0 }}>
            {(targetProfile.display_name||'U')[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{targetProfile.display_name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-4)', fontFamily: 'var(--f-mono)' }}>@{targetProfile.username}</div>
          </div>
          <div style={{ marginLeft: 'auto', fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--text-4)' }}>수신자</div>
        </div>
      )}

      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>연락하기</h1>
      <p style={{ color: 'var(--text-3)', fontSize: 14, marginBottom: 28 }}>메시지를 보내면 상대방 이메일로 알림이 전송됩니다</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* 연락 유형 */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 10, display: 'block' }}>연락 유형 *</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {TYPES.map(t => (
              <div key={t.value} onClick={() => setType(t.value)}
                style={{ padding: '12px 14px', borderRadius: 10, border: `1px solid ${type === t.value ? 'var(--spark)' : 'var(--line-2)'}`, background: type === t.value ? 'var(--spark-dim)' : 'transparent', cursor: 'pointer', transition: 'all 0.15s' }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{t.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-4)' }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 8, display: 'block' }}>제목 *</label>
          <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="안녕하세요, 협업 제안드립니다" required />
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 8, display: 'block' }}>내용 *</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)}
            placeholder="자기소개와 제안 내용을 적어주세요. 구체적일수록 답변을 받을 가능성이 높습니다."
            style={{ minHeight: 160 }} required />
        </div>

        {myProfile && (
          <div style={{ padding: '12px 16px', borderRadius: 10, background: 'var(--bg-2)', border: '1px solid var(--line-2)', fontSize: 13, color: 'var(--text-3)' }}>
            <span style={{ color: 'var(--text-4)', fontSize: 12, fontFamily: 'var(--f-mono)' }}>발신자</span>
            <br />
            <strong style={{ color: 'var(--text-1)' }}>{myProfile.display_name}</strong>
            {myProfile.company_name && ` · ${myProfile.company_name}`}
          </div>
        )}

        {error && <p style={{ fontSize: 13, color: 'var(--red)', padding: '10px 14px', background: 'rgba(239,68,68,.08)', borderRadius: 8 }}>{error}</p>}

        <button type="submit" className="btn btn-spark" disabled={loading}
          style={{ height: 48, justifyContent: 'center', fontWeight: 700, fontSize: 15 }}>
          {loading ? '전송 중...' : <><Send size={16} /> 메시지 보내기</>}
        </button>
      </form>
    </div>
  )
}
