import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Save, LogOut } from 'lucide-react'
import { useAuthStore } from '../store'
import { supabase } from '../lib/supabase'

const SKILL_SUGGESTIONS = ['React', 'Python', 'JavaScript', 'TypeScript', 'Swift', 'Flutter', 'AI/ML', 'No-Code', 'Design', 'Marketing', 'Business', 'Finance']

export default function SettingsPage() {
  const { user, profile, fetchProfile, signOut } = useAuthStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ display_name:'', bio:'', school:'', grade:'', location:'', website_url:'', github_url:'', company_name:'', industry:'', skills:[] })
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (profile) setForm(f => ({ ...f, ...profile }))
  }, [profile])

  if (!user) { navigate('/login'); return null }

  const toggleSkill = s => setForm(f => ({
    ...f, skills: f.skills?.includes(s) ? f.skills.filter(x => x !== s) : [...(f.skills||[]), s]
  }))

  const handleSave = async e => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('sparkship_profiles').update({
      display_name: form.display_name,
      bio: form.bio,
      school: form.school,
      grade: form.grade,
      location: form.location,
      website_url: form.website_url,
      github_url: form.github_url,
      company_name: form.company_name,
      industry: form.industry,
      skills: form.skills,
      updated_at: new Date().toISOString()
    }).eq('id', user.id)
    if (!error) { await fetchProfile(user.id); setSaved(true); setTimeout(() => setSaved(false), 2000) }
    setLoading(false)
  }

  const isBuilder = profile?.role === 'builder'

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 600 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>프로필 설정</h1>
        <button className="btn btn-ghost btn-sm" onClick={() => { signOut(); navigate('/') }}>
          <LogOut size={14} /> 로그아웃
        </button>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 8, display: 'block' }}>이름 *</label>
          <input value={form.display_name||''} onChange={e => setForm(f => ({...f, display_name: e.target.value}))} placeholder="이름" required />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 8, display: 'block' }}>자기소개</label>
          <textarea value={form.bio||''} onChange={e => setForm(f => ({...f, bio: e.target.value}))} placeholder="나를 한 문단으로 소개해주세요" style={{ minHeight: 90 }} />
        </div>

        {isBuilder && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 8, display: 'block' }}>학교</label>
                <input value={form.school||''} onChange={e => setForm(f => ({...f, school: e.target.value}))} placeholder="○○고등학교" />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 8, display: 'block' }}>학년</label>
                <input value={form.grade||''} onChange={e => setForm(f => ({...f, grade: e.target.value}))} placeholder="2학년" />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 10, display: 'block' }}>보유 스킬</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {SKILL_SUGGESTIONS.map(s => (
                  <button key={s} type="button" className={`tag ${form.skills?.includes(s) ? 'active' : ''}`}
                    onClick={() => toggleSkill(s)}>{s}</button>
                ))}
              </div>
            </div>
          </>
        )}

        {!isBuilder && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 8, display: 'block' }}>회사명</label>
              <input value={form.company_name||''} onChange={e => setForm(f => ({...f, company_name: e.target.value}))} placeholder="(주)예시컴퍼니" />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 8, display: 'block' }}>업종</label>
              <input value={form.industry||''} onChange={e => setForm(f => ({...f, industry: e.target.value}))} placeholder="IT, 교육, 커머스..." />
            </div>
          </div>
        )}

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 8, display: 'block' }}>지역</label>
          <input value={form.location||''} onChange={e => setForm(f => ({...f, location: e.target.value}))} placeholder="서울, 경기, 부산..." />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 8, display: 'block' }}>웹사이트</label>
            <input value={form.website_url||''} onChange={e => setForm(f => ({...f, website_url: e.target.value}))} placeholder="https://" type="url" />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', marginBottom: 8, display: 'block' }}>GitHub URL</label>
            <input value={form.github_url||''} onChange={e => setForm(f => ({...f, github_url: e.target.value}))} placeholder="https://github.com/..." type="url" />
          </div>
        </div>

        <button type="submit" className="btn btn-spark" disabled={loading} style={{ height: 44, justifyContent: 'center' }}>
          {saved ? '✅ 저장됐습니다' : loading ? '저장 중...' : <><Save size={15}/> 변경사항 저장</>}
        </button>
      </form>
    </div>
  )
}
