import { useState, useEffect, useRef } from 'react'
import { Send, Search, ArrowLeft, MessageSquare, Zap, Star } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store'
import { Link } from 'react-router-dom'

export default function MessagesPage() {
  const { user } = useAuthStore()
  const [convs, setConvs] = useState([])
  const [active, setActive] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [otherProfile, setOtherProfile] = useState(null)
  const endRef = useRef(null)

  useEffect(() => { if (user) loadConvs() }, [user])

  useEffect(() => {
    if (!active) return
    loadMessages(active.id)
    loadOtherProfile(active)
    const sub = supabase
      .channel('sp-msgs-' + active.id)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: 'conv_id=eq.' + active.id
      }, p => {
        setMessages(prev => [...prev, p.new])
        setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
      })
      .subscribe()
    return () => sub.unsubscribe()
  }, [active])

  async function loadConvs() {
    const { data } = await supabase
      .from('messages_conversations')
      .select('*')
      .eq('platform', 'sparkship')
      .or(`participant_a.eq.${user.id},participant_b.eq.${user.id}`)
      .order('last_msg_at', { ascending: false })
    setConvs(data || [])
  }

  async function loadOtherProfile(conv) {
    const otherId = conv.participant_a === user.id ? conv.participant_b : conv.participant_a
    const { data } = await supabase
      .from('sparkship_profiles')
      .select('username,role,bio')
      .eq('id', otherId)
      .single()
    setOtherProfile(data)
  }

  async function loadMessages(convId) {
    setLoading(true)
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conv_id', convId)
      .order('created_at', { ascending: true })
    setMessages(data || [])
    setLoading(false)
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    await supabase.from('messages')
      .update({ is_read: true })
      .eq('conv_id', convId)
      .neq('sender_id', user?.id)
  }

  async function sendMessage() {
    if (!input.trim() || !active || !user) return
    const content = input.trim()
    setInput('')
    const { data } = await supabase.from('messages').insert({
      conv_id: active.id,
      sender_id: user.id,
      content,
    }).select().single()
    if (data) {
      setMessages(prev => [...prev, data])
      await supabase.from('messages_conversations')
        .update({ last_msg_at: new Date().toISOString() })
        .eq('id', active.id)
    }
  }

  const roleIcon = (r) => r === 'scout' ? <Star size={12} /> : r === 'mentor' ? '🧠' : <Zap size={12} />
  const roleLabel = (r) => r === 'scout' ? '스카우터' : r === 'mentor' ? '멘토' : '빌더'

  if (!user) return (
    <div style={{ padding: '80px 20px', textAlign: 'center' }}>
      <MessageSquare size={40} color="var(--spark)" style={{ margin: '0 auto 16px', display: 'block' }} />
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>메시지</h2>
      <p style={{ color: 'var(--text-3)', marginBottom: 24, fontSize: 14 }}>로그인 후 스카우터, 멘토와 대화하세요</p>
      <Link to="/login" style={{ padding: '10px 24px', background: 'var(--spark)', color: '#000', borderRadius: 8, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>로그인</Link>
    </div>
  )

  return (
    <div className="sp-page" style={{ display: 'flex', height: 'calc(100vh - 60px)', overflow: 'hidden' }}>
      {/* 대화 목록 */}
      <div style={{
        width: active ? 0 : '100%',
        maxWidth: 320,
        borderRight: '1px solid var(--line-1)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
        transition: 'all 0.25s ease',
      }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--line-1)' }}>
          <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>메시지</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '8px 12px', border: '1px solid var(--line-1)' }}>
            <Search size={13} color="var(--text-3)" />
            <input placeholder="대화 검색..." style={{ background: 'none', border: 'none', outline: 'none', fontSize: 13, color: 'var(--text-1)', flex: 1 }} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {convs.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
              <MessageSquare size={32} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
              아직 대화가 없습니다<br />
              <small style={{ fontSize: 11 }}>프로젝트에서 연락하면 여기에 표시됩니다</small>
            </div>
          ) : convs.map(c => (
            <div key={c.id} onClick={() => setActive(c)} style={{
              padding: '14px 16px',
              borderBottom: '1px solid var(--line-1)',
              cursor: 'pointer',
              background: active?.id === c.id ? 'rgba(245,158,11,0.08)' : 'transparent',
              display: 'flex', gap: 12, alignItems: 'center',
              transition: 'background 0.15s',
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: '50%',
                background: c.context_type === 'scout' ? 'rgba(245,158,11,0.15)' : 'rgba(96,165,250,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, flexShrink: 0,
              }}>
                {c.context_type === 'scout' ? '🎯' : c.context_type === 'mentor' ? '🧠' : '💬'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', marginBottom: 2 }}>
                  {c.context_type === 'scout' ? '스카우트 문의' : c.context_type === 'mentor' ? '멘토링' : '메시지'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                  {new Date(c.last_msg_at).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 채팅창 */}
      {active ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* 헤더 */}
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--line-1)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setActive(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)', padding: 4 }}>
              <ArrowLeft size={16} />
            </button>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
              {active.context_type === 'scout' ? '🎯' : '🧠'}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {otherProfile?.username || (active.context_type === 'scout' ? '스카우트 문의' : '멘토링')}
              </div>
              {otherProfile && (
                <div style={{ fontSize: 11, color: 'var(--spark)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {roleIcon(otherProfile.role)} {roleLabel(otherProfile.role)}
                </div>
              )}
            </div>
          </div>

          {/* 메시지 목록 */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {loading ? (
              <div style={{ textAlign: 'center', color: 'var(--text-3)', paddingTop: 40, fontSize: 13 }}>로딩 중...</div>
            ) : messages.map(m => {
              const isMe = m.sender_id === user?.id
              return (
                <div key={m.id} style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-end', maxWidth: '75%', marginLeft: isMe ? 'auto' : 0 }}>
                  {!isMe && <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(245,158,11,0.15)', flexShrink: 0 }} />}
                  <div>
                    <div style={{
                      padding: '9px 14px',
                      borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      background: isMe ? 'var(--spark)' : 'rgba(255,255,255,0.08)',
                      color: isMe ? '#000' : 'var(--text-1)',
                      fontSize: 14, lineHeight: 1.5, wordBreak: 'break-word',
                    }}>{m.content}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-4)', padding: '2px 4px', textAlign: isMe ? 'right' : 'left', fontFamily: 'var(--f-mono)' }}>
                      {new Date(m.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={endRef} />
          </div>

          {/* 입력창 */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--line-1)', display: 'flex', gap: 10 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
              placeholder="메시지를 입력하세요..."
              style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--line-2)', borderRadius: 8, padding: '9px 14px', color: 'var(--text-1)', fontSize: 14, outline: 'none' }}
            />
            <button onClick={sendMessage} disabled={!input.trim()} style={{
              padding: '9px 16px', borderRadius: 8, background: input.trim() ? 'var(--spark)' : 'rgba(255,255,255,0.05)',
              color: input.trim() ? '#000' : 'var(--text-3)', border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 13,
            }}>
              <Send size={14} /> 전송
            </button>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: 'var(--text-3)' }}>
          <MessageSquare size={40} style={{ opacity: 0.3 }} />
          <p style={{ fontSize: 14 }}>대화를 선택하세요</p>
        </div>
      )}
    </div>
  )
}
