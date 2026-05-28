import React, { useEffect, useState } from 'react'
import { addPost, getPosts, getSession, getPollVotes } from '../services/mockService'
import PostCard from '../components/PostCard'
import BarChart from '../components/BarChart'

export default function Community(){
  const [posts,setPosts]=useState<any[]>([])
  const [type,setType]=useState('job')
  const [title,setTitle]=useState('')
  const [body,setBody]=useState('')
  const [mediaFiles,setMediaFiles]=useState<any[]>([])
  const [pollOptions,setPollOptions]=useState(['',''])

  useEffect(()=>{
    let mounted = true
    ;(async ()=>{
      try{
        const p = await getPosts()
        if(mounted) setPosts(p)
      }catch(e){}
    })()
    return ()=>{ mounted=false }
  },[])

  const handleFiles = (e:any)=>{
    const files = Array.from(e.target.files || [])
    files.forEach((f:File)=>{
      const reader = new FileReader()
      reader.onload = ()=>{
        setMediaFiles(prev=>[...prev,{type:f.type,data:reader.result}])
      }
      reader.readAsDataURL(f)
    })
  }

  const submit = (e:React.FormEvent)=>{
    e.preventDefault()
    (async ()=>{
      const session = getSession()
      if(!session) return alert('Login to post')
      const id = Date.now().toString()
      const post:any = {id,type,title,body,media:mediaFiles,poster:session.email,at:new Date().toISOString()}
      if(type==='poll') post.options = pollOptions.filter(o=>o.trim())
      await addPost(post)
      try{ const p = await getPosts(); setPosts(p) }catch(e){}
      setTitle(''); setBody(''); setMediaFiles([]); setPollOptions(['',''])
    })()
  }

  return (
    <div>
      <div className="card">
        <h3>Create Post</h3>
        <form onSubmit={submit}>
          <label>Type</label>
          <select value={type} onChange={e=>setType(e.target.value)}>
            <option value="job">Job</option>
            <option value="advert">Advert</option>
            <option value="poll">Poll</option>
            <option value="post">Post</option>
          </select>
          <label>Title</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} />
          <label>Body</label>
          <textarea value={body} onChange={e=>setBody(e.target.value)} />
          {type==='poll' && (
            <div>
              <label>Poll Options</label>
              {pollOptions.map((opt,i)=> (
                <input key={i} value={opt} onChange={e=>setPollOptions(p=>{const c=[...p];c[i]=e.target.value;return c})} />
              ))}
              <div className="actions"><button type="button" className="btn" onClick={()=>setPollOptions(p=>[...p,''])}>Add option</button></div>
            </div>
          )}
          <label>Media (images/videos)</label>
          <input type="file" multiple accept="image/*,video/*" onChange={handleFiles} />
          <div className="actions"><button className="btn" >Create post</button></div>
        </form>
      </div>

      <div style={{marginTop:12}}>
        <h4>Community Posts</h4>
        {posts.length===0 && <div className="card">No posts yet — be the first to post</div>}
        {posts.map(p=> (
          <div key={p.id}>
            <PostCard post={p} refresh={async ()=>{ try{ const p2 = await getPosts(); setPosts(p2) }catch(e){} }} />
            {p.type==='poll' && (
              <div className="card" style={{marginTop:8}}>
                <h4>Poll Results</h4>
                <PollResults poll={p} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function PollResults({poll}:{poll:any}){
  const [votes,setVotes]=React.useState<any[]>([])
  React.useEffect(()=>{ let mounted=true; getPollVotes().then(v=>{ if(mounted) setVotes(v) }); return ()=>{ mounted=false } },[poll.id])
  const counts = (poll.options||[]).map((_:any,i:number)=> votes.filter((vv:any)=>vv.pollId===poll.id && vv.optionIndex===i).length)
  return <BarChart labels={poll.options||[]} values={counts} title="Poll votes" />
}
