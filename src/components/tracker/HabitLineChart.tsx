'use client'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

interface HabitLineChartProps {
  data: number[]
  height?: number
}

export function HabitLineChart({ data, height = 300 }: HabitLineChartProps) {
  const chartData = data.map((percent, idx) => ({ week: idx + 1, percent }))
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
        <YAxis domain={[0, 100]} tickFormatter={(t) => `${t}%`} />
        <Tooltip formatter={(v: number) => `${v}%`} />
        <Line type="monotone" dataKey="percent" stroke="#DCD0FF" />
      </LineChart>
    </ResponsiveContainer>
  )
}
