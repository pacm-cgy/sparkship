/**
 * Insightship ↔ Sparkship 크로스 플랫폼 연동 API
 * - Insightship 구독자 → Sparkship 알림
 * - Sparkship 프로젝트 → Insightship 뉴스피드 연동
 * - 공유 Supabase 사용 (같은 프로젝트)
 */
export const config = { runtime: 'edge' }

const SB_URL = process.env.VITE_SUPABASE_URL
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const H = (key) => ({
    'Content-Type': 'application/json',
    'apikey': key,
    'Authorization': `Bearer ${key}`,
})

export default async function handler(req) {
    if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

    let body
    try { body = await req.json() } catch { return new Response('Bad request', { status: 400 }) }

    const { action } = body

    // Sparkship 프로젝트를 Insightship 커뮤니티에 공유
    if (action === 'share_project') {
        const { project_id, owner_id, title, tagline } = body
        try {
            const res = await fetch(`${SB_URL}/rest/v1/community_posts`, {
                method: 'POST',
                headers: { ...H(SB_KEY), Prefer: 'return=minimal' },
                body: JSON.stringify({
                    author_id: owner_id,
                    title: `[Sparkship] ${title}`,
                    content: `${tagline}\n\n👉 Sparkship에서 확인하기: https://www.sparkship.pacm.kr/p/${project_id}`,
                    post_type: 'project',
                    is_pinned: false,
                })
            })
            return new Response(JSON.stringify({ ok: res.ok }), { status: 200 })
        } catch(e) {
            return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500 })
        }
    }

    // Insightship 뉴스레터 구독자에게 Sparkship 소식 발송 준비
    if (action === 'get_stats') {
        try {
            const [spRes, isRes] = await Promise.all([
                fetch(`${SB_URL}/rest/v1/sparkship_stats?select=key,value`, { headers: H(SB_KEY) }),
                fetch(`${SB_URL}/rest/v1/newsletter_subscribers?select=count&is_active=eq.true`, { headers: H(SB_KEY) })
            ])
            const stats = await spRes.json()
            const subs = await isRes.json()
            return new Response(JSON.stringify({
                sparkship: Object.fromEntries(stats.map(s => [s.key, s.value])),
                insightship_subscribers: subs[0]?.count || 0,
            }), { status: 200 })
        } catch(e) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500 })
        }
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400 })
}
