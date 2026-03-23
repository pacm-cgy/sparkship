import { useParams, Link, useNavigate } from 'react-router-dom'
import { MapPin, Globe, Github, Zap, Edit2, Mail } from 'lucide-react'
import { useProfile } from '../hooks/useData'
import { useAuthStore } from '../store'
import ProjectCard from '../components/ui/ProjectCard'

const STAGE_LABEL = { idea:'아이디어', prototype:'프로토타입', mvp:'MVP', launched:'출시됨', revenue:'수익화', funded:'투자유치' }
const ROLE_LABEL  = { builder:'🚀 빌더', scout:'🔍 스카우터', mentor:'💡 멘토', admin:'⚙️ 관리자' }

export default function ProfilePage() {
  const { username } = useParams()
  const { user, profile: myProfile } = useAuthStore()
  const { data: profile, isLoading } = useProfile(username)
  const navigate = useNavigate()

  const isOwn = myProfile?.username === username

  if (isLoading) return (
    <div className="container" style={{ paddingTop: 60 }}>
      <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
        <div className="skeleton" style={{ width: 88, height: 88, borderRadius: 16, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: 24, width: '40%', marginBottom: 10 }} />
          <div className="skeleton" style={{ height: 16, width: '60%' }} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 16 }}>
        {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 300 }} />)}
      </div>
    </div>
  )

  if (!profile) return (
    <div className="container" style={{ paddingTop: 80, textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
      <p style={{ color: 'var(--text-3)', marginBottom: 16 }}>존재하지 않는 프로필입니다</p>
      <Link to="/explore" className="btn btn-spark">탐색하기</Link>
    </div>
  )

  const publishedProjects = profile.projects?.filter(p => p.status === 'published') || []

  return (
    <div style={{ paddingBottom: 80 }}>
      {/* ── 프로필 헤더 배경 */}
      <div style={{ background: 'linear-gradient(180deg, var(--bg-2) 0%, var(--bg-0) 100%)', borderBottom: '1px solid var(--line-1)', padding: '40px 0 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, marginBottom: 28, flexWrap: 'wrap' }}>
            {/* 아바타 */}
            <div style={{ width: 88, height: 88, borderRadius: 18, background: 'var(--spark-dim)', border: '2px solid var(--spark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, color: 'var(--spark)', flexShrink: 0 }}>
              {(profile.display_name || 'U')[0].toUpperCase()}
            </div>

            {/* 정보 */}
            <div style={{ flex: 1, minWidth: 220 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em' }}>{profile.display_name}</h1>
                {profile.is_verified && <span className="badge badge-spark">✓ 인증됨</span>}
                <span className="badge badge-gray" style={{ fontSize: 10 }}>{ROLE_LABEL[profile.role]}</span>
              </div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--text-4)', marginBottom: 10 }}>@{profile.username}</div>
              {profile.bio && <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, maxWidth: 520, marginBottom: 12 }}>{profile.bio}</p>}

              {/* 메타 정보 */}
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {profile.school && (
                  <span style={{ fontSize: 13, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    🏫 {profile.school} {profile.grade && `· ${profile.grade}`}
                  </span>
                )}
                {profile.location && (
                  <span style={{ fontSize: 13, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={12} /> {profile.location}
                  </span>
                )}
                {profile.company_name && (
                  <span style={{ fontSize: 13, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    🏢 {profile.company_name}
                  </span>
                )}
                {profile.website_url && (
                  <a href={profile.website_url} target="_blank" style={{ fontSize: 13, color: 'var(--spark)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Globe size={12} /> 웹사이트
                  </a>
                )}
                {profile.github_url && (
                  <a href={profile.github_url} target="_blank" style={{ fontSize: 13, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Github size={12} /> GitHub
                  </a>
                )}
              </div>
            </div>

            {/* 액션 버튼 */}
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              {isOwn ? (
                <button className="btn btn-outline btn-sm" onClick={() => navigate('/settings')}>
                  <Edit2 size={14} /> 프로필 편집
                </button>
              ) : (
                profile.role === 'builder' && (
                  <button className="btn btn-spark btn-sm" onClick={() => navigate(`/contact/${profile.username}`)}>
                    <Zap size={14} /> 스카우트 연락
                  </button>
                )
              )}
            </div>
          </div>

          {/* 스킬 태그 */}
          {profile.skills?.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', paddingBottom: 20 }}>
              {profile.skills.map(s => (
                <span key={s} className="tag" style={{ fontSize: 11 }}>{s}</span>
              ))}
            </div>
          )}

          {/* 탭 네비 */}
          <div style={{ display: 'flex', gap: 0, borderTop: '1px solid var(--line-1)', marginTop: 4 }}>
            {[
              { label: `프로젝트 ${publishedProjects.length}`, active: true },
            ].map(t => (
              <div key={t.label} style={{ padding: '12px 20px', fontSize: 14, fontWeight: t.active ? 600 : 400, color: t.active ? 'var(--text-1)' : 'var(--text-3)', borderBottom: t.active ? '2px solid var(--spark)' : '2px solid transparent', cursor: 'pointer', marginBottom: '-1px' }}>
                {t.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 프로젝트 목록 */}
      <div className="container" style={{ paddingTop: 32 }}>
        {publishedProjects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Zap size={40} style={{ marginBottom: 12, opacity: 0.15 }} />
            <p style={{ color: 'var(--text-3)', marginBottom: 8 }}>
              {isOwn ? '아직 등록한 프로젝트가 없습니다' : '공개된 프로젝트가 없습니다'}
            </p>
            {isOwn && (
              <button className="btn btn-spark btn-sm" onClick={() => navigate('/new')} style={{ marginTop: 8 }}>
                첫 프로젝트 등록하기
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 16 }}>
            {publishedProjects.map(p => <ProjectCard key={p.id} project={{ ...p, owner: profile }} />)}
          </div>
        )}
      </div>
    </div>
  )
}
