import React, { useEffect, useState } from 'react'
import { getSession, findMemberByEmail, saveMember } from '../services/mockService'

export default function Dashboard(){
  const [member,setMember]=useState<any>(null)
  useEffect(()=>{
    let mounted=true
    const load = async ()=>{
      const s = getSession()
      if(s){ const m = await findMemberByEmail(s.email); if(m && mounted) setMember(m) }
    }
    load()
    return ()=>{ mounted=false }
  },[])
  if(!member) return <div className="card">Please sign in to view dashboard</div>
  const update = async ()=>{
    await saveMember(member); alert('Saved')
  }
  return (
    <div>
      <div className="card">
        <h3>Dashboard</h3>
        <div><strong>{member.name}</strong> — {member.email}</div>
        <div style={{marginTop:12}}>
          <label>Universities (comma separated)</label>
          <input value={(member.universities||[]).join(', ')} onChange={e=>setMember({...member,universities:e.target.value.split(',').map((s:string)=>s.trim())})} />
          <label>Employment</label>
          <input value={member.employment||''} onChange={e=>setMember({...member,employment:e.target.value})} />
          <label>Business</label>
          <input value={member.business||''} onChange={e=>setMember({...member,business:e.target.value})} />
          <label>Location</label>
          <input value={member.location||''} onChange={e=>setMember({...member,location:e.target.value})} />
          <div className="actions"><button className="btn" onClick={update}>Save profile</button></div>
        </div>
      </div>
    </div>
  )
}
