'use client'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

interface HabitLineChartProps {
  data: number[]
}

export function HabitLineChart({ data }: HabitLineChartProps) {
  const chartData = data.map((percent, idx) => ({ week: idx + 1, percent }))
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
        <YAxis domain={[0, 100]} tickFormatter={(t) => `${t}%`} />
        <Tooltip formatter={(v: number) => `${v}%`} />
        <Line type="monotone" dataKey="percent" stroke="#38A169" />
      </LineChart>
    </ResponsiveContainer>
  )
}
