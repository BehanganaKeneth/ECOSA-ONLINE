import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, authLogin } from '../services/mockService'

export default function Login(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const nav = useNavigate()
  const submit = (e:React.FormEvent)=>{
    e.preventDefault()
    ;(async ()=>{
      try{
        // try server-side auth first
        await authLogin(email,password)
        nav('/dashboard')
      }catch{
        const m = await login(email)
        if(!m) return alert('Member not found — please register')
        nav('/dashboard')
      }
    })()
  }
  return (
    <div className="card">
      <h3>Login</h3>
      <form onSubmit={submit}>
        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div className="actions"><button className="btn">Sign in</button></div>
      </form>
    </div>
  )
}
