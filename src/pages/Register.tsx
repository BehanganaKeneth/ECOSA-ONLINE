import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveMember, authRegister } from '../services/mockService'

export default function Register(){
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [years,setYears]=useState('')
  const [confirm,setConfirm]=useState('')
  const nav = useNavigate()
  const submit = async (e:React.FormEvent)=>{
    e.preventDefault()
    if(!name||!email||!password) return alert('Provide name, email and password')
    if(password !== confirm) return alert('Passwords do not match')
    try{
      await authRegister(name,email,password, years)
      alert('Account created — you are now signed in')
      nav('/dashboard')
    }catch(e){
      // try member save fallback
      const id = Date.now().toString()
      await saveMember({id,name,email, yearsAtECI: years})
      alert('Registered — please login')
      nav('/login')
    }
  }
  return (
    <div className="card">
      <h3>Register</h3>
      <form onSubmit={submit}>
        <label>Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} />
        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <label>Confirm Password</label>
        <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} />
        <label>Years at ECI</label>
        <input placeholder="e.g. 2008-2012" value={years} onChange={e=>setYears(e.target.value)} />
        <div className="actions"><button className="btn">Create account</button></div>
      </form>
    </div>
  )
}
