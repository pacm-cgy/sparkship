import { useParams, Link } from 'react-router-dom'
import { Heart, Eye, Bookmark, ExternalLink, Github, Play, MessageCircle, Zap, ArrowLeft, Users } from 'lucide-react'
import { useProject } from '../hooks/useData'

const STAGE_LABEL = { idea:'아이디어', prototype:'프로토타입', mvp:'MVP', launched:'출시됨', revenue:'수익화', funded:'투자유치' }

export default function ProjectPage() {
  const { id } = useParams()
  const { data: project, isLoading } = useProject(id)

  if (isLoading) return (
    <div className="container" style={{ paddingTop: 60, paddingBottom: 80 }}>
      <div className="skeleton" style={{ height: 400, marginBottom: 24 }} />
      <div className="skeleton" style={{ height: 200 }} />
    </div>
  )
  if (!project) return (
    <div className="container" style={{ paddingTop: 80, textAlign: 'center' }}>
      <p style={{ color: 'var(--text-3)' }}>프로젝트를 찾을 수 없습니다</p>
      <Link to="/explore" className="btn btn-spark" style={{ marginTop: 16 }}>탐색으로 돌아가기</Link>
    </div>
  )

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 80, maxWidth: 900 }}>
      {/* 뒤로 가기 */}
      <Link to="/explore" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-4)', fontSize: 14, marginBottom: 24 }}>
        <ArrowLeft size={16} /> 탐색으로
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 32, alignItems: 'start' }}>
        {/* 메인 */}
        <div>
          {/* 썸네일 */}
          <div style={{ height: 260, borderRadius: 12, background: project.thumbnail_url ? `url(${project.thumbnail_url}) center/cover` : 'linear-gradient(135deg, var(--bg-3), var(--bg-4))', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--line-2)' }}>
            {!project.thumbnail_url && <Zap size={48} color="var(--spark)" strokeWidth={1} />}
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <span className="badge badge-gray">{project.category}</span>
            <span className="badge badge-spark">{STAGE_LABEL[project.stage]}</span>
            {project.is_hiring && <span className="badge badge-green">🙋 팀원 모집중</span>}
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>{project.title}</h1>
          <p style={{ fontSize: 16, color: 'var(--text-3)', marginBottom: 24, lineHeight: 1.6 }}>{project.tagline}</p>

          {/* 링크들 */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
            {project.demo_url && <a href={project.demo_url} target="_blank" className="btn btn-spark btn-sm"><ExternalLink size={14} /> 데모 보기</a>}
            {project.github_url && <a href={project.github_url} target="_blank" className="btn btn-outline btn-sm"><Github size={14} /> GitHub</a>}
            {project.video_url && <a href={project.video_url} target="_blank" className="btn btn-outline btn-sm"><Play size={14} /> 영상</a>}
          </div>

          {/* 설명 */}
          <div style={{ padding: '20px 0', borderTop: '1px solid var(--line-1)', borderBottom: '1px solid var(--line-1)', marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>프로젝트 소개</h2>
            <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{project.description}</p>
          </div>

          {/* 기술 스택 */}
          {project.tech_stack?.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>기술 스택</h2>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {project.tech_stack.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          )}

          {/* 태그 */}
          {project.tags?.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {project.tags.map(t => <span key={t} className="tag">#{t}</span>)}
              </div>
            </div>
          )}

          {/* 댓글 */}
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
              <MessageCircle size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
              피드백 {project.comments?.length > 0 ? `(${project.comments.length})` : ''}
            </h2>
            {project.comments?.length === 0 ? (
              <p style={{ fontSize: 14, color: 'var(--text-4)' }}>첫 번째 피드백을 남겨보세요</p>
            ) : (
              project.comments?.map(c => (
                <div key={c.id} style={{ padding: '14px 0', borderBottom: '1px solid var(--line-1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>{c.author?.display_name}</span>
                    {c.is_mentor && <span className="badge badge-spark" style={{ fontSize: 9 }}>멘토</span>}
                    <span style={{ fontSize: 11, color: 'var(--text-4)', fontFamily: 'var(--f-mono)' }}>{new Date(c.created_at).toLocaleDateString('ko')}</span>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7 }}>{c.content}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 사이드바 */}
        <div style={{ position: 'sticky', top: 80 }}>
          {/* 빌더 카드 */}
          {project.owner && (
            <div className="card" style={{ padding: '20px', marginBottom: 16 }}>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.1em', marginBottom: 12 }}>BUILDER</div>
              <Link to={`/u/${project.owner.username}`} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--spark-dim)', border: '1px solid var(--spark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: 'var(--spark)', flexShrink: 0 }}>
                  {(project.owner.display_name||'U')[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{project.owner.display_name}</div>
                  {project.owner.school && <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{project.owner.school} {project.owner.grade}</div>}
                </div>
              </Link>
              <button className="btn btn-spark" style={{ width: '100%', marginTop: 14, justifyContent: 'center' }}>
                스카우트 연락
              </button>
            </div>
          )}

          {/* 통계 */}
          <div className="card" style={{ padding: '16px 20px' }}>
            {[
              { icon: Eye, label: '조회', value: project.view_count || 0 },
              { icon: Heart, label: '좋아요', value: project.like_count || 0 },
              { icon: Bookmark, label: '북마크', value: project.bookmark_count || 0 },
              { icon: MessageCircle, label: '댓글', value: project.comments?.length || 0 },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--line-1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-3)' }}>
                  <s.icon size={14} /> {s.label}
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--f-mono)', color: 'var(--text-1)' }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@media(max-width:768px){.project-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}
