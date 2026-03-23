import { create } from 'zustand'
import { supabase } from '../lib/supabase'

// 소셜 로그인 사용자 프로필 자동 생성
async function ensureProfile(user) {
  if (!user) return null

  // 기존 프로필 확인
  const { data: existing } = await supabase
    .from('sparkship_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (existing) return existing

  // 신규 소셜 가입 → 프로필 자동 생성
  const meta = user.user_metadata || {}
  const email = user.email || ''
  const emailBase = email.split('@')[0].replace(/[^a-z0-9_]/gi, '_').toLowerCase()

  // 사용자명 중복 방지
  let username = meta.user_name || meta.login || emailBase || 'builder'
  const { count } = await supabase
    .from('sparkship_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('username', username)
  if (count > 0) username = `${username}_${Date.now().toString(36)}`

  const newProfile = {
    id: user.id,
    username,
    display_name: meta.full_name || meta.name || meta.user_name || email.split('@')[0],
    bio: '',
    avatar_url: meta.avatar_url || meta.picture || '',
    role: 'builder',
  }

  const { data: created } = await supabase
    .from('sparkship_profiles')
    .upsert(newProfile)
    .select()
    .single()

  return created || newProfile
}

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  isNewUser: false,

  init: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      set({ user: session.user })
      const profile = await ensureProfile(session.user)
      set({ profile })
    }
    set({ loading: false })

    supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user || null
      set({ user })
      if (user) {
        const wasNew = !(await supabase
          .from('sparkship_profiles')
          .select('id')
          .eq('id', user.id)
          .single()).data
        const profile = await ensureProfile(user)
        set({ profile, isNewUser: wasNew && event === 'SIGNED_IN' })
      } else {
        set({ profile: null, isNewUser: false })
      }
    })
  },

  fetchProfile: async (id) => {
    const { data } = await supabase
      .from('sparkship_profiles')
      .select('*')
      .eq('id', id)
      .single()
    set({ profile: data })
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, profile: null })
  },
}))
