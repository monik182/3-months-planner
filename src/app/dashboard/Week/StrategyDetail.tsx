import { StrategyHistoryExtended } from '@/app/types/types'
import { Checkbox } from '@/components/ui/checkbox'
import { UseUpdate } from '@/app/hooks/useStrategyHistoryActions'
import { CheckedChangeDetails } from 'node_modules/@chakra-ui/react/dist/types/components/checkbox/namespace'

interface StrategyDetailProps {
  strategy: StrategyHistoryExtended
  onChange: UseUpdate['mutate']
}
export function StrategyDetail({ strategy, onChange }: StrategyDetailProps) {
  const { content } = strategy.strategy
  const handleOnCheckedChange = (details: CheckedChangeDetails) => {
    onChange({ strategyId: strategy.id, updates: { completed: !!details.checked } })
  }

  return (
    <div>
      <Checkbox size="lg" defaultChecked={strategy.completed} onCheckedChange={handleOnCheckedChange}>{content}</Checkbox>
    </div>
  )
}
