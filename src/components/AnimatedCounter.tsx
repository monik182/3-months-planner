'use client'
import { useEffect, useState } from 'react'
import { StatRoot, StatLabel, StatValueText } from '@/components/ui/stat'

interface AnimatedCounterProps {
  label: string
  value: number
}

export function AnimatedCounter({ label, value }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let current = 0
    const duration = 1000
    const step = Math.max(1, Math.ceil(value / (duration / 50)))
    const interval = setInterval(() => {
      current += step
      if (current >= value) {
        current = value
        clearInterval(interval)
      }
      setCount(current)
    }, 50)
    return () => clearInterval(interval)
  }, [value])

  return (
    <StatRoot textAlign="center">
      <StatLabel>{label}</StatLabel>
      <StatValueText>{count}</StatValueText>
    </StatRoot>
  )
}
