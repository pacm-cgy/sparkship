import { Link } from 'react-router-dom'
import { Heart, Eye, Bookmark, ExternalLink, Zap } from 'lucide-react'

const STAGE_LABEL = {
  idea: { label: '아이디어', color: 'badge-gray' },
  prototype: { label: '프로토타입', color: 'badge-blue' },
  mvp: { label: 'MVP', color: 'badge-purple' },
  launched: { label: '출시됨', color: 'badge-green' },
  revenue: { label: '수익화', color: 'badge-spark' },
  funded: { label: '투자유치', color: 'badge-spark' },
}

const CATEGORY_LABEL = {
  app: '앱', web: '웹', ai: 'AI', hardware: '하드웨어',
  social: '소셜', education: '교육', commerce: '커머스',
  content: '콘텐츠', game: '게임', other: '기타'
}

export default function ProjectCard({ project }) {
  if (!project) return null
  const stage = STAGE_LABEL[project.stage] || STAGE_LABEL.idea

  return (
    <Link to={`/p/${project.id}`} style={{ display: 'block' }}>
      <div className="card card-spark" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}>
        {/* 썸네일 */}
        <div style={{
          height: 160, background: project.thumbnail_url ? `url(${project.thumbnail_url}) center/cover` : `linear-gradient(135deg, var(--bg-3) 0%, var(--bg-4) 100%)`,
          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {!project.thumbnail_url && (
            <Zap size={32} color="var(--spark)" strokeWidth={1.5} />
          )}
          {project.is_featured && (
            <div style={{ position: 'absolute', top: 10, left: 10 }}>
              <span className="badge badge-spark">⚡ 추천</span>
            </div>
          )}
          <div style={{ position: 'absolute', top: 10, right: 10 }}>
            <span className={`badge ${stage.color}`}>{stage.label}</span>
          </div>
        </div>

        {/* 내용 */}
        <div style={{ padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.3, color: 'var(--text-1)' }}>{project.title}</h3>
            <span className="badge badge-gray" style={{ flexShrink: 0, fontSize: 10 }}>{CATEGORY_LABEL[project.category]}</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {project.tagline}
          </p>

          {/* 빌더 정보 */}
          {project.owner && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--spark-dim)', border: '1px solid var(--spark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--spark)', flexShrink: 0 }}>
                {(project.owner.display_name || 'U')[0].toUpperCase()}
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{project.owner.display_name}</span>
              {project.owner.school && (
                <span style={{ fontSize: 11, color: 'var(--text-4)', fontFamily: 'var(--f-mono)' }}>· {project.owner.school}</span>
              )}
            </div>
          )}

          {/* 태그 */}
          {project.tags?.length > 0 && (
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
              {project.tags.slice(0, 3).map(t => (
                <span key={t} className="tag" style={{ fontSize: 11, padding: '2px 8px' }}>#{t}</span>
              ))}
            </div>
          )}

          {/* 통계 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 10, borderTop: '1px solid var(--line-1)', color: 'var(--text-4)', fontSize: 12, fontFamily: 'var(--f-mono)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Heart size={12} /> {project.like_count || 0}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Eye size={12} /> {project.view_count || 0}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Bookmark size={12} /> {project.bookmark_count || 0}
            </span>
            {project.demo_url && (
              <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, color: 'var(--spark)' }}>
                <ExternalLink size={12} /> 데모
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
