import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store'

export default function ImageUpload({ value, onChange, folder = 'projects' }) {
  const { user } = useAuthStore()
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value || '')
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef()

  const upload = async (file) => {
    if (!file || !user) return
    if (!file.type.startsWith('image/')) { alert('이미지 파일만 업로드 가능합니다'); return }
    if (file.size > 5 * 1024 * 1024) { alert('5MB 이하 파일만 가능합니다'); return }

    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `${user.id}/${folder}/${Date.now()}.${ext}`
      const { error } = await supabase.storage
        .from('sparkship-images')
        .upload(path, file, { upsert: true })
      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('sparkship-images')
        .getPublicUrl(path)

      setPreview(publicUrl)
      onChange(publicUrl)
    } catch(e) {
      alert('업로드 실패: ' + e.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) upload(file)
  }

  const clear = () => { setPreview(''); onChange('') }

  return (
    <div>
      {preview ? (
        <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--line-2)' }}>
          <img src={preview} alt="썸네일" style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
          <button onClick={clear} style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 8, background: 'rgba(0,0,0,0.7)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          style={{
            height: 140, borderRadius: 10, border: `1px dashed ${dragOver ? 'var(--spark)' : 'var(--line-3)'}`,
            background: dragOver ? 'var(--spark-dim)' : 'var(--bg-3)', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'all 0.15s'
          }}>
          {uploading ? (
            <>
              <div style={{ width: 24, height: 24, border: '2px solid var(--spark)', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <span style={{ fontSize: 13, color: 'var(--text-3)' }}>업로드 중...</span>
            </>
          ) : (
            <>
              <Upload size={22} color="var(--text-4)" />
              <span style={{ fontSize: 13, color: 'var(--text-3)' }}>클릭하거나 드래그해서 이미지 업로드</span>
              <span style={{ fontSize: 11, color: 'var(--text-4)', fontFamily: 'var(--f-mono)' }}>JPG, PNG, WEBP · 최대 5MB</span>
            </>
          )}
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => { if (e.target.files[0]) upload(e.target.files[0]) }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
