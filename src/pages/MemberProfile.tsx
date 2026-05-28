import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getMembers, getPosts } from '../services/mockService'

export default function MemberProfile(){
  const { id } = useParams()
  const [member,setMember] = useState<any>(null)
  const [posts,setPosts] = useState<any[]>([])

  useEffect(()=>{
    let mounted = true
    if(!id) return
    getMembers().then(list=>{
      if(!mounted) return
      const m = (list||[]).find((x:any)=> x.id === id || x.membershipNumber === id)
      setMember(m)
    }).catch(()=>{})
    getPosts().then(p=>{ if(mounted) setPosts((p||[]).filter((x:any)=> (x.author||'')=== (member?.name || ''))) }).catch(()=>{})
    return ()=>{ mounted=false }
  },[id, member?.name])

  if(!member) return <div className="card">Member not found</div>

  return (
    <div className="card">
      <h3>{member.name}</h3>
      <div style={{color:'#6b7280'}}>Membership: {member.membershipNumber || member.id}</div>
      {member.yearsAtECI && <div style={{marginTop:6}}>Years at ECI: {member.yearsAtECI}</div>}
      {member.employment && <div style={{marginTop:8}}>Employment: {member.employment}</div>}
      {member.business && <div>Business: {member.business}</div>}
      {member.location && <div>Location: {member.location}</div>}

      <h4 style={{marginTop:12}}>Recent posts</h4>
      {posts.length===0 && <div style={{color:'#6b7280'}}>No posts yet</div>}
      {posts.map(p=>(
        <div key={p.id} style={{marginTop:8}}>
          <div style={{fontWeight:700}}>{p.title || (p.content||p.body).slice(0,60)}</div>
          <div style={{color:'#6b7280',fontSize:12}}>{new Date(p.createdAt||p.at).toLocaleString()}</div>
        </div>
      ))}
    </div>
  )
}
