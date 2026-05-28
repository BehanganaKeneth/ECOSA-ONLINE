import React, { useState } from 'react'
import { getSession, addPayment } from '../services/mockService'

export default function Payments(){
  const [amount,setAmount]=useState('20000')
  const [method,setMethod]=useState<'mpesa'|'mtn'|'airtel'|'card'>('mpesa')
  const [phone,setPhone]=useState('')
  const session = getSession()

  const submit = (e:React.FormEvent)=>{
    e.preventDefault()
    ;(async ()=>{
      if(!session) return alert('Login first')
      if(!amount) return alert('Enter amount in UGX')
      if(method==='mpesa' || method==='mtn' || method==='airtel'){
        if(!phone) return alert('Enter phone number')
        try{
          // Try initiating payment via the server
          const res = await fetch('http://localhost:4000/api/payments/initiate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({provider:method, amount: Number(amount), phone})})
          const j = await res.json()
          if(j && j.ok){ alert(`${method.toUpperCase()} initiated. Follow prompts on your phone.`) }
          else if(j && j.message){ alert(j.message) }
        }catch(e){
          // fallback: record payment locally
          await addPayment({id:Date.now().toString(),email:session.email,amount,method,phone,at:new Date().toISOString()})
          alert('Payment recorded. You will receive confirmation shortly.')
        }
        setAmount(''); setPhone('')
        return
      }

      // card / Stripe fallback
      try{
        // For UGX, send amount in UGX (no cents)
        const res = await fetch('http://localhost:4000/api/create-checkout-session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({amount:Math.round(Number(amount)),currency:'ugx'})})
        const j = await res.json()
        if(j.url){ window.location.href = j.url; return }
      }catch(e){ /* fallback */ }
      await addPayment({id:Date.now().toString(),email:session.email,amount,method:'card',at:new Date().toISOString()})
      alert('Payment recorded. You will receive confirmation shortly.')
      setAmount('')
    })()
  }

  return (
    <div className="card">
      <h3>Payments</h3>
      <form onSubmit={submit}>
        <label>Amount (UGX)</label>
        <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="20000" />

        <label style={{marginTop:8}}>Payment method</label>
        <div>
          <label style={{display:'inline-flex',alignItems:'center',gap:8}}>
            <input type="radio" checked={method==='mpesa'} onChange={()=>setMethod('mpesa')} /> M-Pesa
            <img src="/mpesa-logo.svg" alt="M-Pesa" style={{height:24,marginLeft:6,opacity:.95}} />
          </label>
          <label style={{marginLeft:12,display:'inline-flex',alignItems:'center',gap:8}}>
            <input type="radio" checked={method==='mtn'} onChange={()=>setMethod('mtn')} />
            <img src="/mtn-logo.svg" alt="MTN Mobile Money" style={{height:28}} />
          </label>
          <label style={{marginLeft:12,display:'inline-flex',alignItems:'center',gap:8}}>
            <input type="radio" checked={method==='airtel'} onChange={()=>setMethod('airtel')} />
            <img src="/airtel-logo.svg" alt="Airtel Money" style={{height:28}} />
          </label>
          <label style={{marginLeft:12,display:'inline-flex',alignItems:'center',gap:8}}>
            <input type="radio" checked={method==='card'} onChange={()=>setMethod('card')} />
            <span>Card (Visa/Mastercard via Stripe)</span>
            <div style={{display:'inline-flex',gap:8,marginLeft:8,alignItems:'center'}}>
              <img src="/visa-logo.svg" alt="Visa" style={{height:24}} />
              <img src="/mastercard-logo.svg" alt="Mastercard" style={{height:24}} />
            </div>
          </label>
        </div>

        {(method==='mpesa' || method==='mtn' || method==='airtel') && (
          <div>
            <label>Phone (international format, e.g. 2567xxxxxxx)</label>
            <input value={phone} onChange={e=>setPhone(e.target.value)} />
          </div>
        )}

        <div className="actions"><button className="btn">{method==='card' ? 'Pay with Card' : `Pay with ${method.toUpperCase()}`}</button></div>
      </form>
      <p style={{color:'#6b7280',marginTop:12}}>Use M-Pesa, MTN or Airtel mobile money, or pay with card (Visa/Mastercard). After payment you will receive confirmation and your membership will be updated.</p>
    </div>
  )
}
