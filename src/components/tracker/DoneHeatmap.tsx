'use client'
import { Box, Grid, GridItem, Text } from '@chakra-ui/react'
import { StrategyHistoryExtended } from '@/app/types/types'

interface DoneHeatmapProps {
  strategies: StrategyHistoryExtended[]
  done: Record<string, number[]>
}

export function DoneHeatmap({ strategies, done }: DoneHeatmapProps) {
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
          <GridItem key={s.id + '-label'} textAlign="right" pr={1}>
            <Text>{s.strategy.content}</Text>
          </GridItem>
          {done[s.id].map((v, idx) => (
            <GridItem key={s.id + idx}>
              <Box h={4} borderRadius="sm" bg={v ? 'green.400' : 'gray.200'} />
            </GridItem>
          ))}
        </>
      ))}
    </Grid>
  )
}
