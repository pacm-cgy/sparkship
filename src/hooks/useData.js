import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

// 프로젝트 목록
export function useProjects({ category, stage, search, limit = 20, featured } = {}) {
  return useQuery({
    queryKey: ['projects', { category, stage, search, featured }],
    queryFn: async () => {
      let q = supabase.from('sparkship_projects')
        .select(`*, owner:sparkship_profiles(id,username,display_name,avatar_url,school,grade)`)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(limit)
      if (category) q = q.eq('category', category)
      if (stage) q = q.eq('stage', stage)
      if (featured) q = q.eq('is_featured', true)
      if (search) q = q.or(`title.ilike.%${search}%,tagline.ilike.%${search}%`)
      const { data, error } = await q
      if (error) throw error
      return data || []
    }
  })
}

// 단일 프로젝트
export function useProject(id) {
  return useQuery({
    queryKey: ['project', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase.from('sparkship_projects')
        .select(`*, owner:sparkship_profiles(*), team:sparkship_team_members(*), comments:sparkship_comments(*, author:sparkship_profiles(username,display_name,avatar_url,role))`)
        .eq('id', id).single()
      if (error) throw error
      await supabase.from('sparkship_projects').update({ view_count: (data.view_count||0)+1 }).eq('id', id)
      return data
    }
  })
}

// 프로필
export function useProfile(username) {
  return useQuery({
    queryKey: ['profile', username],
    enabled: !!username,
    queryFn: async () => {
      const { data, error } = await supabase.from('sparkship_profiles')
        .select(`*, projects:sparkship_projects(*)`)
        .eq('username', username).single()
      if (error) throw error
      return data
    }
  })
}

// 좋아요 토글
export function useLikeProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ projectId, userId, liked }) => {
      if (liked) {
        await supabase.from('sparkship_likes').delete().match({ project_id: projectId, user_id: userId })
        await supabase.from('sparkship_projects').update({ like_count: supabase.rpc('decrement', { x: 1 }) }).eq('id', projectId)
      } else {
        await supabase.from('sparkship_likes').insert({ project_id: projectId, user_id: userId })
        await supabase.from('sparkship_projects').update({ like_count: supabase.rpc('increment', { x: 1 }) }).eq('id', projectId)
      }
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['project', vars.projectId] })
      qc.invalidateQueries({ queryKey: ['projects'] })
    }
  })
}

// 프로젝트 생성
export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data) => {
      const { data: project, error } = await supabase.from('sparkship_projects').insert(data).select().single()
      if (error) throw error
      return project
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] })
  })
}
