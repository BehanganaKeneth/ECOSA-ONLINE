import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function BarChart({labels,values,title}:{labels:string[],values:number[],title?:string}){
  const data = { labels, datasets:[{label:title||'Results',data:values,backgroundColor:'rgba(11,95,255,0.7)'}] }
  const opts = { responsive:true, plugins:{legend:{display:false}} }
  return <Bar data={data} options={opts as any} />
}
