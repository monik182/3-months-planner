'use client'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

interface WeeklyBarChartProps {
  data: number[]
}

export function WeeklyBarChart({ data }: WeeklyBarChartProps) {
  const chartData = data.map((count, idx) => ({ week: idx + 1, count }))
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" fill="#DCD0FF" />
      </BarChart>
    </ResponsiveContainer>
  )
}
