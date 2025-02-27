import { useDashboardContext } from '@/app/dashboard/dashboardContext'
import { Box, Heading, Stat, StatLabel, VStack, Separator } from '@chakra-ui/react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { FormatNumber } from '@chakra-ui/react'

interface OverviewProps { }

export function Overview({ }: OverviewProps) {
  const { goals, strategies, indicators = [], weeklyScores, overallGoalScores, overallStrategyScores } = useDashboardContext()

  const chartData = weeklyScores.map((score, index) => ({
    label: `Week ${index + 1}`,
    score,
  }))

  const indicatorsChartData = indicators.reduce((acc, indicator) => {
    if (!acc[indicator.indicatorId]) {
      acc[indicator.indicatorId] = []
    }
    acc[indicator.indicatorId].push({ label: `Week ${indicator.sequence}`, value: indicator.value })
    return acc
  }, {} as Record<string, { label: string, value: number | null }[]>)

  const yearScore = Math.floor(weeklyScores.reduce((acc, score) => acc + score, 0) / 12) / 100

  const goalScoresData = [...overallGoalScores].map(([id, score]) => {
    const goal = goals?.find((g) => g.goalId === id);
    return {
      name: goal?.goal.content || 'Unknown',
      score: Math.floor(score / 12),
    }
  })

  const strategyScoresData = [...overallStrategyScores].map(([id, score]) => {
    const strategy = strategies?.find((g) => g.strategyId === id);
    return {
      name: strategy?.strategy.content || 'Unknown',
      score: Math.floor(score / 12),
    }
  })

  const indicatorsCharts = Object.keys(indicatorsChartData).map((id) => {
    const indicator = indicators.find((i) => i.indicatorId === id)
    const data = indicatorsChartData[id]
    const maxValue = Math.max(...data.map((d) => d.value || 0), indicator?.indicator.goalValue || 0)

    return (
      <Box key={id} mb={6}>
        <Heading size="md" mb={2}>Indicator Progress: {indicator?.indicator.content}</Heading>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" interval={0} angle={-45} textAnchor="end" />
            <YAxis domain={[0, maxValue]} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    )
  })

  return (
    <VStack gap={6} align="stretch">
      <Heading size="lg">Current Plan Progress</Heading>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" interval={0} angle={-45} textAnchor="end" />
          <YAxis domain={[0, 100]} ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]} />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

      <Stat.Root>
        <StatLabel>Year Score</StatLabel>
        <Stat.ValueText><FormatNumber value={yearScore} style="percent" /></Stat.ValueText>
      </Stat.Root>

      <Separator />

      <Box>
        <Heading size="md" mb={2}>Score By Goal</Heading>
        <ResponsiveContainer width="100%" height={goalScoresData.length * 80}>
          <BarChart
            layout="vertical"
            data={goalScoresData}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            barCategoryGap={5}
            barGap={2}
          >
            <YAxis dataKey="name" type="category" width={150} />
            <XAxis type="number" domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
            <Tooltip formatter={(value) => `${value}%`} />
            <Bar dataKey="score" fill="#8884d8" barSize={10} />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Separator />

      <Box>
        <Heading size="md" mb={2}>Score By Strategy</Heading>
        <ResponsiveContainer width="100%" height={strategyScoresData.length * 80}>
          <BarChart
            layout="vertical"
            data={strategyScoresData}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            barCategoryGap={5}
            barGap={2}
          >
            <YAxis dataKey="name" type="category" width={150} />
            <XAxis type="number" domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
            <Tooltip formatter={(value) => `${value}%`} />
            <Bar dataKey="score" fill="#8884d8" barSize={10} />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Separator />

      {indicatorsCharts}
    </VStack>
  )
}