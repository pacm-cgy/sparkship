import { useState } from 'react'
import { Search, Users, Zap } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

const ROLES = [{key:'all',label:'전체'},{key:'builder',label:'빌더'},{key:'scout',label:'스카우터'},{key:'mentor',label:'멘토'}]
const ROLE_ICON = { builder:'🚀', scout:'🔍', mentor:'💡' }
const ROLE_LABEL = { builder:'빌더', scout:'스카우터', mentor:'멘토' }

export default function BuildersPage() {
  const navigate = useNavigate()
  const [search,setSearch] = useState('')
  const [role,setRole] = useState('all')

  const { data:builders=[], isLoading } = useQuery({
    queryKey:['builders',search,role],
    queryFn:async()=>{
      let q = supabase.from('sparkship_profiles').select('*').order('created_at',{ascending:false}).limit(40)
      if(role!=='all') q = q.eq('role',role)
      if(search) q = q.or(`username.ilike.%${search}%,display_name.ilike.%${search}%`)
      const{data}=await q; return data||[]
    },
  })

  return (
    <div className="sp-page">
      <div className="page-header">
        <div className="page-header-inner">
          <div className="sp-section-eyebrow">BUILDERS</div>
          <h1 style={{ fontFamily:'var(--f-display)',fontSize:'clamp(24px,3vw,32px)',fontWeight:800,letterSpacing:'-.04em',marginBottom:6 }}>빌더 탐색</h1>
          <p style={{ color:'var(--text-3)',fontSize:14,marginBottom:24 }}>청소년 창업가, 스카우터, 멘토를 만나보세요</p>
          <div style={{ display:'flex',gap:12,flexWrap:'wrap',alignItems:'center' }}>
            <div style={{ position:'relative',flex:'1 1 280px',maxWidth:380 }}>
              <Search size={15} style={{ position:'absolute',left:13,top:'50%',transform:'translateY(-50%)',color:'var(--text-4)',pointerEvents:'none' }}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="이름, 사용자명으로 검색..." style={{ paddingLeft:40 }}/>
            </div>
            <div className="sp-filter-bar">
              {ROLES.map(r=><button key={r.key} className={`sp-filter-btn${role===r.key?' active':''}`} onClick={()=>setRole(r.key)}>{r.label}</button>)}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop:32,paddingBottom:80 }}>
        <div style={{ marginBottom:20,fontSize:13,color:'var(--text-4)',fontFamily:'var(--f-mono)' }}>
          {isLoading?'로딩 중...':`${builders.length}명`}
        </div>

        {isLoading ? (
          <div className="sp-grid-4">
            {[...Array(8)].map((_,i)=>(
              <div key={i} style={{ background:'var(--bg-card)',border:'1px solid var(--line-1)',borderRadius:'var(--r-xl)',padding:24,display:'flex',flexDirection:'column',alignItems:'center',gap:12 }}>
                <div className="skeleton" style={{ width:64,height:64,borderRadius:'50%' }}/>
                <div className="skeleton" style={{ height:15,width:'60%',borderRadius:4 }}/>
                <div className="skeleton" style={{ height:12,width:'80%',borderRadius:4 }}/>
              </div>
            ))}
          </div>
        ) : builders.length>0 ? (
          <div className="sp-grid-4">
            {builders.map(b=>(
              <Link key={b.id} to={`/u/${b.username}`} style={{ textDecoration:'none' }}>
                <div className="sp-builder-card">
                  <div className="sp-avatar sp-avatar-lg">
                    {b.avatar_url?<img src={b.avatar_url} alt={b.display_name}/>:(b.display_name?.[0]||'U').toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontFamily:'var(--f-display)',fontSize:14,fontWeight:700,letterSpacing:'-.02em' }}>{b.display_name||b.username}</div>
                    <div style={{ fontSize:12,color:'var(--text-4)',marginTop:2 }}>@{b.username}</div>
                  </div>
                  <span className="badge badge-gray" style={{ fontSize:11 }}>{ROLE_ICON[b.role]} {ROLE_LABEL[b.role]||b.role}</span>
                  {b.bio&&<p style={{ fontSize:12,color:'var(--text-3)',textAlign:'center',lineHeight:1.5,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden' }}>{b.bio}</p>}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="sp-empty" style={{ paddingTop:80 }}>
            <Users size={40} style={{ opacity:.2,marginBottom:8 }}/>
            <p className="sp-empty-title">빌더가 없습니다</p>
            <p className="sp-empty-desc">아직 가입한 빌더가 없거나 검색 조건에 맞지 않습니다</p>
            <button className="btn btn-spark" onClick={()=>navigate('/signup')} style={{ marginTop:16,display:'flex',alignItems:'center',gap:6 }}>
              <Zap size={14}/> 지금 합류하기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
