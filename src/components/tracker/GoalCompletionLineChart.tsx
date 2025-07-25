'use client'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

interface GoalCompletionLineChartProps {
  data: Record<string, number[]>
  goals: { id: string; content: string }[]
}

export function GoalCompletionLineChart({ data, goals }: GoalCompletionLineChartProps) {
  const chartData = Array.from({ length: 12 }).map((_, idx) => {
    const entry: Record<string, number> & { week: number } = { week: idx + 1 }
    goals.forEach(g => {
      entry[g.id] = data[g.id]?.[idx] ?? 0
    })
    return entry
  })

  const colors = ['#3182CE', '#38A169', '#D53F8C', '#805AD5', '#DD6B20', '#2C5282', '#718096']

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
        <YAxis domain={[0, 100]} tickFormatter={(t) => `${t}%`} />
        <Tooltip formatter={(v: number) => `${v}%`} labelFormatter={(label) => `Week ${label}`} />
        <Legend />
        {goals.map((g, idx) => (
          <Line key={g.id} type="monotone" dataKey={g.id} name={g.content} stroke={colors[idx % colors.length]} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
