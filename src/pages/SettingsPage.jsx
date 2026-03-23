import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Shield, Bell, LogOut, ChevronRight } from 'lucide-react'
import { useAuthStore } from '../store'
import { supabase } from '../lib/supabase'

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
          </div>
        </div>
      </div>
    </div>
  )
}
