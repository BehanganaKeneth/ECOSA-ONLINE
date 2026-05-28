import React from 'react'

export default function Home(){
  return (
    <div className="card">
      <h2>Welcome to ECOSA Online</h2>
      <p>Equatorial College Old Students Association — your alumni hub for registration, payments, member services and networking.</p>
      <ul>
        <li><strong>Register &amp; manage your profile:</strong> Create your alumni profile, update contact details and year group.</li>
        <li><strong>Pay membership &amp; subscriptions:</strong> Securely pay membership and annual dues and get your membership number.</li>
        <li><strong>Share jobs &amp; opportunities:</strong> Post vacancies, gigs and partnerships for our alumni network.</li>
        <li><strong>Search &amp; connect:</strong> Find classmates, filter by year or location, and start conversations.</li>
      </ul>

      <div style={{marginTop:12,display:'flex',gap:8,flexWrap:'wrap'}}>
        <a className="btn" href="/register">Register</a>
        <a className="btn" href="/payments">Pay Membership (UGX 20,000)</a>
        <a className="btn" href="/community">Community</a>
        <a className="btn" href="/members">Members Search</a>
      </div>
    </div>
  )
}
