import React, { useEffect, useState } from 'react'
import MemberLink from '../components/MemberLink'
import { addJob, getJobs, getSession, addPost } from '../services/mockService'

export default function JobBoard(){
  const [jobs,setJobs]=useState<any[]>([])
  const [title,setTitle]=useState('')
  const [desc,setDesc]=useState('')
  useEffect(()=>{ let mounted=true; getJobs().then(j=>{ if(mounted) setJobs(Array.isArray(j)?dedupeJobs(j):[]) }); return ()=>{ mounted=false } },[])
  const submit = async (e:React.FormEvent)=>{
    e.preventDefault()
    const s = getSession()
    if(!s) return alert('Login to post')
    const job = {id:Date.now().toString(),title,desc,poster:s.email,at:new Date().toISOString()}
    await addJob(job)
    // also create a community post for this job so it appears under Community
    const post = { id: job.id, type: 'job', title: job.title, body: job.desc, media: [], poster: job.poster, at: job.at }
    await addPost(post)
    const j = await getJobs()
    setJobs(Array.isArray(j)?dedupeJobs(j):[])
    setTitle(''); setDesc('')
  }
  return (
    <div>
      <div className="card">
        <h3>Post an opportunity</h3>
        <form onSubmit={submit}>
          <label>Title</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} />
          <label>Description</label>
          <textarea value={desc} onChange={e=>setDesc(e.target.value)} />
          <div className="actions"><button className="btn">Post job</button></div>
        </form>
      </div>
      <div style={{marginTop:12}}>
        <h4>Open Opportunities</h4>
        {jobs.length===0 && <div className="card">No jobs posted yet</div>}
        {jobs.map(j=> (
          <div key={j.id} className="card" style={{marginBottom:8}}>
            <div style={{fontWeight:700}}>{j.title}</div>
            <div style={{color:'#6b7280'}}>{j.desc}</div>
            {j.media && (
              <div style={{marginTop:8}}>
                {typeof j.media === 'string' ? <img src={j.media} style={{maxWidth:480,width:'100%'}} alt="job media"/> : Array.isArray(j.media) ? (
                  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>{j.media.map((m:any,idx:number)=>(<div key={idx} style={{maxWidth:200}}>{m.data ? <img src={m.data} style={{width:'100%'}}/> : null}</div>))}</div>
                ) : null}
              </div>
            )}
            <div style={{fontSize:12,marginTop:6}}>Posted by <MemberLink name={j.poster} /></div>
          </div>
        ))}
      </div>
    </div>
  )
}

function dedupeJobs(jobs:any[]){
  const seen = new Set<string>()
  const out:any[] = []
  for(const j of jobs){
    const key = j.id || `${j.title}:::${j.desc}:::${j.poster}`
    if(!seen.has(key)){ seen.add(key); out.push(j) }
  }
  return out
}
