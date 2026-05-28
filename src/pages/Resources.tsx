import React, { useEffect, useState } from 'react'
import { getResources, addResource, deleteResource, getMembers } from '../services/mockService'

export default function Resources(){
  const [resources,setResources]=useState<any[]>([])
  const [title,setTitle]=useState('')
  const [type,setType]=useState('constitution')
  const [file,setFile]=useState<File | null>(null)
  const [members,setMembers]=useState<any[]>([])

  useEffect(()=>{ 
    let mounted=true
    getResources().then(r=>{ if(mounted) setResources(r||[]) }).catch(()=>{})
    getMembers().then(m=>{ if(mounted) setMembers(m||[]) }).catch(()=>{})
    return ()=>{ mounted=false }
  },[])

  async function handleUpload(e:any){
    e.preventDefault()
    if(!file) return alert('Choose a file')
    const reader = new FileReader()
    reader.onload = async ()=>{
      const content = reader.result
      const session = JSON.parse(localStorage.getItem('ecosa_session')||'null')
      const uploaderName = session?.name || session?.email || 'system'
      const res = {
        id: `res_${Date.now()}`,
        name: title || file.name,
        filename: file.name,
        mime: file.type,
        type,
        content,
        uploadedAt: new Date().toISOString(),
        uploadedBy: uploaderName
      }
      await addResource(res)
      setResources(s=>[res,...s])
      setTitle(''); setFile(null)
    }
    reader.readAsDataURL(file)
  }

  async function handleDelete(id:string){
    if(!confirm('Delete this document?')) return
    await deleteResource(id)
    setResources(r=>r.filter((x:any)=>x.id!==id))
  }

  return (
    <div>
      <h3>ECOSA Resources</h3>
      <p className="muted">Upload legal and handover documents here (constitution, registration docs, bank details, handover files).</p>
      {(() => {
        const session = JSON.parse(localStorage.getItem('ecosa_session')||'null')
        const isAdmin = session?.isAdmin === true
        if (!isAdmin) {
          const expected = [
            { type: 'constitution', label: 'Constitution' },
            { type: 'registration', label: 'Registration Certificate' },
            { type: 'bank', label: 'Bank Account Details' },
            { type: 'handover', label: 'Handover Files' },
            { type: 'other', label: 'Other Documents' }
          ]
          return (
            <div style={{marginBottom:12}}>
              <div style={{marginBottom:8}} className="card"><strong>Documents (upload restricted to admins)</strong></div>
              {expected.map(d=>{
                const found = resources.find((r:any)=>r.type===d.type)
                return (
                  <div key={d.type} className="card" style={{marginBottom:8,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div>
                      <div style={{fontWeight:700}}>{d.label}</div>
                      <div style={{color:'#6b7280',fontSize:12}}>{found ? `Uploaded ${new Date(found.uploadedAt).toLocaleString()}` : 'Not yet uploaded'}</div>
                    </div>
                    <div>
                      {found ? (
                        <a href={found.content} download={found.filename} className="btn">Download</a>
                      ) : (
                        <button className="btn" onClick={()=>alert(`${d.label} is not yet uploaded.`)}>Not uploaded</button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        }
        return (
          <form onSubmit={handleUpload} style={{marginBottom:12}}>
            <input placeholder="Document title (optional)" value={title} onChange={e=>setTitle(e.target.value)} style={{padding:8,width:'100%',maxWidth:480,marginBottom:8}} />
            <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:8}}>
              <select value={type} onChange={e=>setType(e.target.value)} style={{padding:8}}>
                <option value="constitution">Constitution</option>
                <option value="registration">Registration Document</option>
                <option value="bank">Bank Account Details</option>
                <option value="handover">Handover Files</option>
                <option value="other">Other</option>
              </select>
              <input type="file" onChange={e=>setFile(e.target.files?.[0]||null)} />
              <button className="btn" type="submit">Upload</button>
            </div>
          </form>
        )
      })()}

      {resources.length===0 && <div className="card">No documents uploaded yet.</div>}
      {resources.map(r=> (
        <div key={r.id} className="card" style={{marginBottom:8}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <div style={{fontWeight:700}}>{r.name}</div>
              <div style={{color:'#6b7280',fontSize:12}}>{r.type} — uploaded {new Date(r.uploadedAt).toLocaleString()}</div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <a href={r.content} download={r.filename} className="btn">Download</a>
              <button className="btn" onClick={()=>handleDelete(r.id)}>Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
