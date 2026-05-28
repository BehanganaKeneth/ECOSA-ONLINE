import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import MembersList from './pages/MembersList'
import Payments from './pages/Payments'
import JobBoard from './pages/JobBoard'
import Header from './components/Header'
import Community from './pages/Community'
import Leaders from './pages/Leaders'
import Resources from './pages/Resources'
import MemberProfile from './pages/MemberProfile'

export default function App(){
  return (
    <div>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/members" element={<MembersList/>} />
          <Route path="/members/:id" element={<MemberProfile/>} />
          <Route path="/payments" element={<Payments/>} />
          <Route path="/jobs" element={<JobBoard/>} />
          <Route path="/community" element={<Community/>} />
          <Route path="/resources" element={<Resources/>} />
          <Route path="/leaders" element={<Leaders/>} />
        </Routes>
      </div>
    </div>
  )
}
