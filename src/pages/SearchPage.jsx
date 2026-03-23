import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, Zap } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import ProjectCard from '../components/ui/ProjectCard'

export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState(params.get('q') || '')

  useEffect(() => { if (params.get('q')) setQ(params.get('q')) }, [])

  const { data, isLoading } = useQuery({
    queryKey: ['search', q],
    enabled: q.length > 1,
    queryFn: async () => {
      const [projRes, builderRes] = await Promise.all([
        supabase.from('sparkship_projects')
          .select('*, owner:sparkship_profiles(id,username,display_name,avatar_url,school,grade)')
          .eq('status', 'published')
          .or(`title.ilike.%${q}%,tagline.ilike.%${q}%,description.ilike.%${q}%`)
          .limit(12),
        supabase.from('sparkship_profiles')
          .select('*').eq('is_public', true)
          .or(`display_name.ilike.%${q}%,bio.ilike.%${q}%,username.ilike.%${q}%`)
          .limit(6)
      ])
      return { projects: projRes.data || [], builders: builderRes.data || [] }
    }
  })

  const handleSearch = e => {
    e.preventDefault()
    setParams({ q })
  }

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', marginBottom: 40 }}>
        <Zap size={32} color="var(--spark)" style={{ marginBottom: 16 }} />
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 20 }}>검색</h1>
        <form onSubmit={handleSearch} style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)' }} />
          <input value={q} onChange={e => setQ(e.target.value)} onBlur={handleSearch}
            placeholder="프로젝트, 빌더, 기술스택으로 검색..."
            style={{ paddingLeft: 48, height: 52, fontSize: 16, borderRadius: 12 }} autoFocus />
        </form>
      </div>

      {q.length > 1 && (
        <>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-3)' }}>검색 중...</div>
          ) : (
            <>
              {/* 빌더 결과 */}
              {data?.builders?.length > 0 && (
                <div style={{ marginBottom: 40 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--text-2)' }}>
                    빌더 <span style={{ color: 'var(--spark)', fontFamily: 'var(--f-mono)' }}>{data.builders.length}</span>
                  </h2>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {data.builders.map(b => (
                      <Link key={b.id} to={`/u/${b.username}`}>
                        <div className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--spark-dim)', border: '1px solid var(--spark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: 'var(--spark)' }}>
                            {(b.display_name||'U')[0].toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{b.display_name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-4)', fontFamily: 'var(--f-mono)' }}>@{b.username}</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* 프로젝트 결과 */}
              {data?.projects?.length > 0 && (
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--text-2)' }}>
                    프로젝트 <span style={{ color: 'var(--spark)', fontFamily: 'var(--f-mono)' }}>{data.projects.length}</span>
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 16 }}>
                    {data.projects.map(p => <ProjectCard key={p.id} project={p} />)}
                  </div>
                </div>
              )}

              {data?.projects?.length === 0 && data?.builders?.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <p style={{ color: 'var(--text-3)', fontSize: 16, marginBottom: 6 }}>"{q}"에 대한 결과가 없습니다</p>
                  <p style={{ color: 'var(--text-4)', fontSize: 13 }}>다른 검색어를 입력해보세요</p>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
