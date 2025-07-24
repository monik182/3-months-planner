'use client'
import { Box, Stack, Grid } from '@chakra-ui/react'
import { StrategyHistoryExtended } from '@/app/types/types'

interface StreakGanttChartProps {
  strategies: StrategyHistoryExtended[]
  done: Record<string, number[]>
}

export function StreakGanttChart({ strategies, done }: StreakGanttChartProps) {
  return (
    <Stack gap={1} fontSize="xs">
      {strategies.map((s) => (
        <Grid key={s.strategyId} templateColumns={`repeat(12, 1fr)`} gap={1}>
          {done[s.strategyId].map((v, idx) => (
            <Box key={idx} h={3} bg={v ? 'green.500' : 'gray.200'} borderRadius="sm" />
          ))}
        </Grid>
      ))}
    </Stack>
  )
}
