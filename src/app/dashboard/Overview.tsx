import { Flex, Heading } from '@chakra-ui/react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface OverviewProps {
  chartData: { label: string, score: number }[]
}

export function Overview({ chartData }: OverviewProps) {
  return (
    <Flex direction="column">
      <Heading>Current Plan Progress</Heading>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" interval={0} angle={-45} textAnchor="end" />
          <YAxis domain={[0, 100]} ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]} />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </Flex>
  )
}