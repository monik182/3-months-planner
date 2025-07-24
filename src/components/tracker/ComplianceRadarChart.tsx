'use client'
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts'
import { StrategyHistoryExtended } from '@/app/types/types'

interface ComplianceRadarChartProps {
  strategies: StrategyHistoryExtended[]
  metrics: Record<string, { complianceRate: number }>
}

export function ComplianceRadarChart({ strategies, metrics }: ComplianceRadarChartProps) {
  const data = strategies.map((s) => ({ name: s.strategy.content, value: metrics[s.id]?.complianceRate || 0 }))
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="name" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tickFormatter={(t) => `${t}%`} />
        <Tooltip formatter={(v: number) => `${v}%`} />
        <Radar dataKey="value" stroke="#805AD5" fill="#805AD5" fillOpacity={0.6} />
      </RadarChart>
    </ResponsiveContainer>
  )
}
