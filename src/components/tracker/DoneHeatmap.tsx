'use client'
import { Box, Grid, GridItem, Text } from '@chakra-ui/react'
import { StrategyHistoryExtended } from '@/app/types/types'

interface DoneHeatmapProps {
  strategies: StrategyHistoryExtended[]
  done: Record<string, number[]>
  weeklyPercentages?: Record<string, number[]>
}

function getColor(percent: number) {
  if (percent >= 100) return 'green.300'
  if (percent >= 75) return 'green.muted'
  if (percent >= 50) return 'yellow.200'
  if (percent >= 25) return 'orange.200'
  if (percent > 0) return 'orange.200'
  return 'gray.200'
}

export function DoneHeatmap({ strategies, done, weeklyPercentages }: DoneHeatmapProps) {
  return (
    <Grid templateColumns={`repeat(${13}, 1fr)`} gap={1} fontSize="xs">
      <GridItem></GridItem>
      {Array.from({ length: 12 }).map((_, idx) => (
        <GridItem key={idx} textAlign="center">
          {idx + 1}
        </GridItem>
      ))}
      {strategies.map((s) => (
        <>
          <GridItem key={s.strategyId + '-label'} textAlign="right" pr={1}>
            <Text>{s.strategy.content}</Text>
          </GridItem>
          {done[s.strategyId].map((v, idx) => {
            const percent = weeklyPercentages?.[s.strategyId]?.[idx] ?? (v ? 100 : 0)
            return (
              <GridItem key={s.strategyId + idx} className="flex items-center justify-center">
                <Box
                  boxSize={4}
                  borderRadius="sm"
                  bg={getColor(percent)}
                  title={`${percent.toFixed(0)}%`}
                />
              </GridItem>
            )
          })}
        </>
      ))}
    </Grid>
  )
}
