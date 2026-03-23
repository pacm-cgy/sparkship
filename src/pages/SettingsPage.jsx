import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Shield, Bell, LogOut, ChevronRight, AlertTriangle } from 'lucide-react'
import { useAuthStore } from '../store'
import { supabase } from '../lib/supabase'


function AccountDeleteSection({ userId, onDeleted }) {
  const [step, setStep] = useState('confirm') // confirm | deactivated
  const [loading, setLoading] = useState(false)
  const [reason, setReason] = useState('')

  async function requestDelete() {
    if (!confirm('정말 계정 삭제를 요청하시겠습니까? 30일 동안 비활성 상태가 되며, 30일 이내 복구할 수 있습니다.')) return
    setLoading(true)
    const { supabase: sb } = await import('../lib/supabase')
    await sb.from('sparkship_profiles').update({
      status: 'deactivated',
      deactivated_at: new Date().toISOString(),
      delete_requested_at: new Date().toISOString(),
      delete_scheduled_at: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
    }).eq('id', userId)
    setStep('deactivated')
    setLoading(false)
    setTimeout(onDeleted, 2000)
  }

  if (step === 'deactivated') return (
    <div style={{ textAlign:'center', padding:'32px 0' }}>
      <div style={{ fontSize:32, marginBottom:12 }}>✅</div>
      <h3 style={{ fontWeight:700, marginBottom:8 }}>삭제 요청 완료</h3>
      <p style={{ fontSize:13, color:'var(--text-3)' }}>30일 후 계정이 영구 삭제됩니다. 30일 이내 로그인하면 복구할 수 있습니다.</p>
    </div>
  )

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <h2 style={{ fontFamily:'var(--f-display)', fontSize:18, fontWeight:700, letterSpacing:'-.03em' }}>계정 삭제</h2>
      <div style={{ background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.2)', borderRadius:'var(--r-lg)', padding:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10, color:'var(--red)', fontWeight:600 }}>
          <AlertTriangle size={16}/> 주의사항
        </div>
        <ul style={{ fontSize:13, color:'var(--text-2)', paddingLeft:16, lineHeight:1.8 }}>
          <li>삭제 요청 후 <strong>30일간 비활성 상태</strong>로 전환됩니다</li>
          <li>비활성 상태에서는 탐색 결과에 표시되지 않습니다</li>
          <li>30일 이내 로그인하면 <strong>언제든 복구 가능</strong>합니다</li>
          <li>30일 경과 후 <strong>영구 삭제</strong>되며 복구 불가합니다</li>
        </ul>
      </div>
      <div>
        <label>삭제 이유 (선택)</label>
        <textarea value={reason} onChange={e=>setReason(e.target.value)} placeholder="더 나은 서비스를 위해 이유를 알려주세요..." style={{ minHeight:80 }}/>
      </div>
      <button className="btn" disabled={loading}
        onClick={requestDelete}
        style={{ background:'var(--red)', color:'#fff', border:'none', alignSelf:'flex-start', display:'flex', alignItems:'center', gap:6 }}>
        {loading ? '처리 중...' : <><AlertTriangle size={14}/> 계정 삭제 요청</>}
      </button>
    </div>
  )
}

export default function SettingsPage() {
  const navigate = useNavigate()
  const { user, profile, signOut, fetchProfile } = useAuthStore()
  const [tab, setTab] = useState('profile')
  const [form, setForm] = useState({ display_name:profile?.display_name||'', bio:profile?.bio||'', github_url:profile?.github_url||'', website_url:profile?.website_url||'' })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  if (!user) return (
    <div className="sp-empty" style={{ paddingTop:120 }}>
      <p className="sp-empty-title">로그인이 필요합니다</p>
      <button className="btn btn-spark" onClick={()=>navigate('/login')} style={{ marginTop:16 }}>로그인</button>
    </div>
  )

  async function saveProfile(e) {
    e.preventDefault()
    setLoading(true)
    await supabase.from('sparkship_profiles').update(form).eq('id', user.id)
    await fetchProfile(user.id)
    setSaved(true)
    setTimeout(()=>setSaved(false), 2000)
    setLoading(false)
  }

  const TABS = [
    { key:'profile', label:'프로필', icon:User },
    { key:'account', label:'계정 보안', icon:Shield },
    { key:'notif',   label:'알림 설정', icon:Bell },
    { key:'delete',  label:'계정 삭제', icon:LogOut },
  ]

  return (
    <div className="sp-page" style={{ paddingTop:40,paddingBottom:80 }}>
      <div className="container">
        <h1 style={{ fontFamily:'var(--f-display)',fontSize:24,fontWeight:800,letterSpacing:'-.04em',marginBottom:32 }}>설정</h1>
        <div style={{ display:'flex',gap:24,flexWrap:'wrap',alignItems:'flex-start' }}>
          {/* 사이드바 */}
          <div style={{ width:200,flexShrink:0,display:'flex',flexDirection:'column',gap:2 }}>
            {TABS.map(t=>{
              const Icon=t.icon
              return (
                <button key={t.key} onClick={()=>setTab(t.key)}
                  style={{ display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:'var(--r-md)',background:tab===t.key?'var(--bg-hover)':'none',border:'none',cursor:'pointer',textAlign:'left',fontSize:14,color:tab===t.key?'var(--text-1)':'var(--text-3)',fontWeight:tab===t.key?600:400,transition:'var(--t-fast)' }}>
                  <Icon size={15}/>{t.label}
                </button>
              )
            })}
            <div style={{ marginTop:8,borderTop:'1px solid var(--line-1)',paddingTop:8 }}>
              <button onClick={()=>{signOut();navigate('/')}}
                style={{ display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:'var(--r-md)',background:'none',border:'none',cursor:'pointer',textAlign:'left',fontSize:14,color:'var(--red)',width:'100%',transition:'var(--t-fast)' }}>
                <LogOut size={15}/> 로그아웃
              </button>
            </div>
          </div>

          {/* 콘텐츠 */}
          <div style={{ flex:1,minWidth:300,background:'var(--bg-card)',border:'1px solid var(--line-1)',borderRadius:'var(--r-xl)',padding:28 }}>
            {tab==='profile' && (
              <form onSubmit={saveProfile} style={{ display:'flex',flexDirection:'column',gap:18 }}>
                <h2 style={{ fontFamily:'var(--f-display)',fontSize:18,fontWeight:700,letterSpacing:'-.03em' }}>프로필 편집</h2>
                {[
                  { name:'display_name', label:'이름', placeholder:'홍길동' },
                  { name:'bio', label:'소개', placeholder:'한 줄 소개', type:'textarea' },
                  { name:'github_url', label:'GitHub URL', placeholder:'https://github.com/username' },
                  { name:'website_url', label:'웹사이트', placeholder:'https://mysite.com' },
                ].map(f=>(
                  <div key={f.name}>
                    <label>{f.label}</label>
                    {f.type==='textarea'
                      ? <textarea value={form[f.name]} onChange={e=>setForm({...form,[f.name]:e.target.value})} placeholder={f.placeholder} style={{ minHeight:80 }}/>
                      : <input value={form[f.name]} onChange={e=>setForm({...form,[f.name]:e.target.value})} placeholder={f.placeholder}/>}
                  </div>
                ))}
                <button type="submit" className="btn btn-spark" disabled={loading} style={{ alignSelf:'flex-start',minWidth:100,justifyContent:'center' }}>
                  {loading?'저장 중...':saved?'✓ 저장됨':'저장'}
                </button>
              </form>
            )}
            {tab==='account' && (
              <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
                <h2 style={{ fontFamily:'var(--f-display)',fontSize:18,fontWeight:700,letterSpacing:'-.03em' }}>계정 보안</h2>
                <div style={{ padding:16,background:'var(--bg-2)',borderRadius:'var(--r-lg)',border:'1px solid var(--line-1)' }}>
                  <div style={{ fontSize:13,color:'var(--text-3)',marginBottom:4 }}>이메일</div>
                  <div style={{ fontSize:14,fontWeight:500 }}>{user.email}</div>
                </div>
                <p style={{ fontSize:13,color:'var(--text-3)' }}>비밀번호 변경 및 2단계 인증은 추후 지원 예정입니다.</p>
              </div>
            )}
            {tab==='notif' && (
              <div style={{ display:'flex',flexDirection:'column',gap:16 }}>
                <h2 style={{ fontFamily:'var(--f-display)',fontSize:18,fontWeight:700,letterSpacing:'-.03em' }}>알림 설정</h2>
                <p style={{ fontSize:13,color:'var(--text-3)' }}>알림 설정 기능은 추후 지원 예정입니다.</p>
              </div>
            )}
            {tab==='delete' && (
              <AccountDeleteSection userId={user?.id} onDeleted={() => { signOut(); navigate('/') }} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
