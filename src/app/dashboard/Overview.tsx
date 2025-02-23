import { useDashboardContext } from '@/app/dashboard/dashboardContext'
import { Box, Flex, FormatNumber, Heading, Stat } from '@chakra-ui/react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface OverviewProps {
}

export function Overview({ }: OverviewProps) {
  const { goals, strategies, indicators = [], weeklyScores, overallGoalScores, overallStrategyScores } = useDashboardContext()
  const chartData = weeklyScores.map((score, index) => {
    return {
      label: `Week ${index + 1}`,
      score,
    }
  })

  const indicatorsChartData = indicators.reduce((acc, indicator) => {
    if (!acc[indicator.indicatorId]) {
      acc[indicator.indicatorId] = []
    }
    acc[indicator.indicatorId] = [...acc[indicator.indicatorId], { label: `Week ${indicator.sequence}`, value: indicator.value }]
    
    return acc
  }, {} as Record<string, { label: string, value: number | null }[]>)

  console.log(indicatorsChartData)

  const yearScore = Math.floor(weeklyScores.reduce((acc, score) => acc + score, 0) / 12) / 100

  const goalScores = [...overallGoalScores].map(([id, score]) => {
    const goal = goals?.find((g) => g.goalId === id)
    const percentScore = Math.floor(score / 12)
    return <p key={id}>{goal?.goal.content} {percentScore}%</p>
  })

  const strategyScores = [...overallStrategyScores].map(([id, score]) => {
    const strategy = strategies?.find((g) => g.strategyId === id)
    const percentScore = Math.floor(score / 12)
    return <p key={id}>{strategy?.strategy.content} {percentScore}%</p>
  })

  const indicatorsCharts = Object.keys(indicatorsChartData).map((id) => {
    const indicator = indicators.find(i => i.indicatorId === id)
    const data = indicatorsChartData[id]
    const maxValue = Math.max(...data.map(d => d.value || 0), (indicator?.indicator.goalValue || 0))
    return (
      <Flex key={id} flexDirection="column">
        <Heading>Indicator Progress: {indicator?.indicator.content}</Heading>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" interval={0} angle={-45} textAnchor="end" />
            <YAxis domain={[0, maxValue]} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </Flex>
    )
  })

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
      <Box>
        <Stat.Root>
          <Stat.Label>Year Score</Stat.Label>
          <Stat.ValueText>
            <FormatNumber value={yearScore} style="percent" />
          </Stat.ValueText>
        </Stat.Root>
      </Box>
      <Box>
        <Heading>Score By Goal</Heading>
        {goalScores}
      </Box>
      <Box>
        <Heading>Score By Strategy</Heading>
        {strategyScores}
      </Box>
      <Box>
        {indicatorsCharts}
      </Box>
    </Flex>
  )
}
