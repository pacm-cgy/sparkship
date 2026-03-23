export const config = { runtime: 'edge' }

const RESEND_KEY = process.env.RESEND_API_KEY
const SB_URL     = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const SB_KEY     = process.env.SUPABASE_SERVICE_ROLE_KEY

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  let body
  try { body = await req.json() } catch { return new Response('Bad request', { status: 400 }) }

  const { toUsername, fromName, fromCompany, fromRole, contactType, subject, message } = body

  // toEmail은 Supabase에서 직접 조회 (보안상 클라이언트에서 받지 않음)
  let toEmail = 'contact@pacm.kr' // 폴백
  try {
    const H = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }
    const r = await fetch(
      `${SB_URL}/rest/v1/sparkship_profiles?username=eq.${encodeURIComponent(toUsername)}&select=id`,
      { headers: H }
    )
    const [profile] = await r.json()
    if (profile?.id) {
      const r2 = await fetch(
        `${SB_URL}/auth/v1/admin/users/${profile.id}`,
        { headers: { ...H, Authorization: `Bearer ${SB_KEY}` } }
      )
      const user = await r2.json()
      if (user?.email) toEmail = user.email
    }
  } catch {}

  const now = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
  const typeLabel = { scout:'스카우트 제안', mentor:'멘토링 제안', collab:'협업 제안', inquiry:'일반 문의' }[contactType] || contactType

  const html = `<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8">
<style>
body{font-family:-apple-system,sans-serif;background:#060606;color:#F5F5F5;margin:0;padding:0}
.wrap{max-width:580px;margin:0 auto;padding:40px 24px}
.logo{display:flex;align-items:center;gap:8px;margin-bottom:32px}
.logo-icon{width:32px;height:32px;background:linear-gradient(135deg,#F59E0B,#D97706);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px}
.logo-text{font-size:17px;font-weight:800;letter-spacing:-0.03em}
.logo-text span{color:#F59E0B}
.badge{display:inline-block;background:rgba(245,158,11,.15);color:#F59E0B;border:1px solid rgba(245,158,11,.3);font-size:11px;font-weight:700;padding:3px 10px;border-radius:100px;font-family:monospace;letter-spacing:0.05em;margin-bottom:20px}
h2{font-size:20px;font-weight:800;margin:0 0 20px;letter-spacing:-0.02em}
table{width:100%;border-collapse:collapse}
td{padding:11px 14px;border:1px solid #1a1a1a;font-size:14px}
td:first-child{background:#111;color:#6B6B6B;width:100px;white-space:nowrap;font-family:monospace;font-size:12px}
.msg{background:#0e0e0e;border:1px solid #1a1a1a;padding:16px;font-size:14px;line-height:1.8;margin-top:8px;white-space:pre-wrap;border-radius:8px;color:#ccc}
.footer{margin-top:32px;font-size:12px;color:#333;border-top:1px solid #111;padding-top:16px}
a{color:#F59E0B}
</style></head>
<body><div class="wrap">
<div class="logo">
  <div class="logo-icon">⚡</div>
  <div class="logo-text">spark<span>ship</span></div>
</div>
<div class="badge">SPARKSHIP · ${typeLabel.toUpperCase()}</div>
<h2>새로운 ${typeLabel}이 도착했습니다</h2>
<table>
  <tr><td>수신 시각</td><td>${now}</td></tr>
  <tr><td>발신자</td><td><strong>${fromName}</strong>${fromCompany ? ` · ${fromCompany}` : ''}</td></tr>
  <tr><td>유형</td><td>${typeLabel}</td></tr>
  <tr><td>제목</td><td>${subject}</td></tr>
</table>
<div style="margin-top:16px;font-size:12px;color:#555">메시지 내용:</div>
<div class="msg">${message}</div>
<div class="footer">
  Sparkship — 청소년 창업가 포트폴리오 플랫폼<br>
  <a href="https://www.sparkship.pacm.kr">www.sparkship.pacm.kr</a> · by PACM
</div>
</div></body></html>`

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Sparkship <contact@pacm.kr>',
        to: [toEmail],
        subject: `[Sparkship] ${typeLabel} — ${subject}`,
        html,
        reply_to: body.fromEmail || 'contact@pacm.kr',
      })
    })
    const data = await res.json()
    return new Response(JSON.stringify({ ok: !!data.id }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    })
  } catch(e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500 })
  }
}
