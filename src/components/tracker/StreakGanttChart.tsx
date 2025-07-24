'use client'
import { Box, Stack, Grid } from '@chakra-ui/react'
import type { Strategy } from '@/app/tracker/types'

interface StreakGanttChartProps {
  strategies: Strategy[]
  done: Record<string, number[]>
}

export function StreakGanttChart({ strategies, done }: StreakGanttChartProps) {
  return (
    <Stack spacing={1} fontSize="xs">
      {strategies.map((s) => (
        <Grid key={s.id} templateColumns={`repeat(12, 1fr)`} gap={1}>
          {done[s.id].map((v, idx) => (
            <Box key={idx} h={3} bg={v ? 'green.500' : 'gray.200'} borderRadius="sm" />
          ))}
        </Grid>
      ))}
    </Stack>
  )
}
