import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Plus, X } from 'lucide-react'
import ImageUpload from '../components/ui/ImageUpload'
import { useAuthStore } from '../store'
import { useCreateProject } from '../hooks/useData'

const CATEGORIES = ['ai','web','app','hardware','social','education','commerce','content','game','other']
const STAGES = ['idea','prototype','mvp','launched','revenue','funded']

export default function NewProjectPage() {
  const { user, profile } = useAuthStore()
  const navigate = useNavigate()
  const createProject = useCreateProject()

  const [form, setForm] = useState({
    title: '', tagline: '', description: '',
    category: 'web', stage: 'idea',
    demo_url: '', github_url: '',
    tech_stack: [], tags: [],
    thumbnail_url: '',
    is_hiring: false
  })
  const [tagInput, setTagInput] = useState('')
  const [techInput, setTechInput] = useState('')
  const [error, setError] = useState('')

  if (!user) return (
    <div className="container" style={{ paddingTop: 80, textAlign: 'center' }}>
      <p style={{ color: 'var(--text-3)', marginBottom: 16 }}>로그인이 필요합니다</p>
      <button className="btn btn-spark" onClick={() => navigate('/login')}>로그인하기</button>
    </div>
  )

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.title || !form.tagline || !form.description) { setError('필수 항목을 입력해주세요'); return }
    try {
      const project = await createProject.mutateAsync({ ...form, owner_id: user.id, status: 'published' })
      navigate(`/p/${project.id}`)
    } catch(e) { setError(e.message) }
  }

  const addTag = () => {
    if (tagInput && !form.tags.includes(tagInput)) {
      setForm(f => ({ ...f, tags: [...f.tags, tagInput.toLowerCase()] }))
      setTagInput('')
    }
  }

  const addTech = () => {
    if (techInput && !form.tech_stack.includes(techInput)) {
      setForm(f => ({ ...f, tech_stack: [...f.tech_stack, techInput] }))
      setTechInput('')
    }
  }

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80, maxWidth: 720 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--spark-dim)', border: '1px solid var(--spark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={18} color="var(--spark)" />
        </div>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800 }}>프로젝트 등록</h1>
          <p style={{ fontSize: 13, color: 'var(--text-4)' }}>나의 프로젝트를 세상에 공개하세요</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {[
          { label: '프로젝트 이름 *', key: 'title', placeholder: '나의 프로젝트', required: true },
          { label: '한 줄 소개 *', key: 'tagline', placeholder: '이 프로젝트가 해결하는 문제를 한 문장으로', required: true },
        ].map(f => (
          <div key={f.key}>
            <label style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 8, display: 'block', fontWeight: 600 }}>{f.label}</label>
            <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} required={f.required} />
          </div>
        ))}

        <div>
          <label style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 8, display: 'block', fontWeight: 600 }}>상세 설명 *</label>
          <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="프로젝트를 자세히 설명해주세요. 어떤 문제를 해결하고, 어떻게 만들었고, 어떤 결과가 있었는지..." style={{ minHeight: 140 }} required />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 8, display: 'block', fontWeight: 600 }}>카테고리 *</label>
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 8, display: 'block', fontWeight: 600 }}>개발 단계 *</label>
            <select value={form.stage} onChange={e => setForm(p => ({ ...p, stage: e.target.value }))}>
              {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* 기술 스택 */}
        <div>
          <label style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 8, display: 'block', fontWeight: 600 }}>기술 스택</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())} placeholder="React, Python, Supabase..." style={{ flex: 1 }} />
            <button type="button" className="btn btn-outline btn-sm" onClick={addTech}><Plus size={14} /></button>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {form.tech_stack.map(t => (
              <span key={t} className="tag active" onClick={() => setForm(f => ({ ...f, tech_stack: f.tech_stack.filter(x => x !== t) }))}>
                {t} <X size={10} style={{ marginLeft: 2 }} />
              </span>
            ))}
          </div>
        </div>

        {/* 태그 */}
        <div>
          <label style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 8, display: 'block', fontWeight: 600 }}>태그</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="청소년창업, AI, 교육..." style={{ flex: 1 }} />
            <button type="button" className="btn btn-outline btn-sm" onClick={addTag}><Plus size={14} /></button>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {form.tags.map(t => (
              <span key={t} className="tag active" onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }))}>
                #{t} <X size={10} style={{ marginLeft: 2 }} />
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 8, display: 'block', fontWeight: 600 }}>데모 URL</label>
            <input value={form.demo_url} onChange={e => setForm(p => ({ ...p, demo_url: e.target.value }))} placeholder="https://" type="url" />
          </div>
          <div>
            <label style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 8, display: 'block', fontWeight: 600 }}>GitHub URL</label>
            <input value={form.github_url} onChange={e => setForm(p => ({ ...p, github_url: e.target.value }))} placeholder="https://github.com/..." type="url" />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input type="checkbox" id="hiring" checked={form.is_hiring} onChange={e => setForm(p => ({ ...p, is_hiring: e.target.checked }))} style={{ width: 18, height: 18, margin: 0 }} />
          <label htmlFor="hiring" style={{ fontSize: 14, color: 'var(--text-2)', cursor: 'pointer' }}>팀원을 모집하고 있습니다</label>
        </div>

        {error && <p style={{ fontSize: 13, color: 'var(--red)', padding: '10px 14px', background: 'rgba(239,68,68,.08)', borderRadius: 8 }}>{error}</p>}

        <div style={{ display: 'flex', gap: 10, paddingTop: 10 }}>
          <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>취소</button>
          <button type="submit" className="btn btn-spark" disabled={createProject.isPending} style={{ flex: 1, justifyContent: 'center', height: 44 }}>
            {createProject.isPending ? '등록 중...' : '⚡ 프로젝트 공개하기'}
          </button>
        </div>
      </form>
    </div>
  )
}
