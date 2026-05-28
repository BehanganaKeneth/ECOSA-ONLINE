import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Header(){
  const navigate = useNavigate()
  const logout = ()=>{ localStorage.removeItem('ecosa_session'); navigate('/') }
  const handleLogout = async ()=>{ try{ await (await import('../services/mockService')).authLogout(); }catch{}; localStorage.removeItem('ecosa_session'); navigate('/') }
  const session = localStorage.getItem('ecosa_session')
  return (
    <header className="card" style={{margin:'12px'}}>
      <div className="container nav">
        <div style={{flex:1,display:'flex',alignItems:'center',gap:12}}>
          <img
            src="/ecosa-logo.png"
            alt="ECOSA logo"
            style={{width:128,height:128,objectFit:'contain',borderRadius:10}}
            onError={(e:any)=>{
              try{
                if(!e.target._triedJpg){ e.target._triedJpg = true; e.target.src = '/ecosa-logo.jpg'; }
                else if(!e.target._triedJpeg){ e.target._triedJpeg = true; e.target.src = '/ecosa-logo.jpeg'; }
                else { e.target.style.display = 'none' }
              }catch(err){ e.target.style.display = 'none' }
            }}
          />
          <div style={{fontSize:20, lineHeight:1.05}}>
            <strong style={{fontSize:22}}>ECOSA</strong> — Equatorial College Old Students Association
          </div>
        </div>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/members">Members</Link>
          <Link to="/community">Community</Link>
          <Link to="/payments">Payments</Link>
          <Link to="/leaders">Leaders</Link>
          <Link to="/resources">Resources</Link>
          {session ? <a onClick={handleLogout} style={{cursor:'pointer'}}>Logout</a> : <><Link to="/login">Login</Link><Link to="/register">Register</Link></>}
        </nav>
      </div>
    </header>
  )
}
