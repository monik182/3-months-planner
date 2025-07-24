'use client'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

interface BurnUpChartProps {
  data: number[]
}

export function BurnUpChart({ data }: BurnUpChartProps) {
  const chartData = data.map((val, idx) => ({ week: idx + 1, value: val }))
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#D53F8C" />
      </LineChart>
    </ResponsiveContainer>
  )
}
