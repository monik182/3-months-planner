'use client'
import React, { useState } from 'react'
import {
  Collapsible,
  Text,
} from '@chakra-ui/react'
import { StepLayout } from '@/app/plan/stepLayout'
import { Step } from '@/app/types/types'
import { Goal } from '@prisma/client'
import { HiChevronDown, HiChevronUp } from 'react-icons/hi2'
import { GoalManager } from '@/components/GoalManager/GoalManager'

export function Step3({ onLoading }: Step<Goal[]>) {
  const [detailsOpen, setDetailsOpen] = useState(false)

  const toggleDetails = () => {
    setDetailsOpen(!detailsOpen)
  }

  return (
    <StepLayout
      title="Set your 1-Year Goals"
      description={<GoalDescription open={detailsOpen} onToggle={toggleDetails} />}
    >
      <GoalManager onLoading={onLoading} />
    </StepLayout>
  )
}

function GoalDescription({ open, onToggle }: { open: boolean, onToggle: () => void }) {
  return (
    <div className="text-gray-700">
      <Text textStyle="sm">Goals are the building blocks of your vision. They start with a clear action verb and are written as complete sentences.</Text>

      <Collapsible.Root open={open}>
        <Collapsible.Trigger
          onClick={onToggle}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 mt-2 mb-1"
        >
          {open ? 'Show less' : 'Show more'}
          {open ? <HiChevronUp size={16} className="ml-1" /> : <HiChevronDown size={16} className="ml-1" />}
        </Collapsible.Trigger>

        <Collapsible.Content className="text-sm space-y-2">
          <Text textStyle="sm">To create effective goals, follow these criteria:</Text>

          <ul className="list-disc pl-5 space-y-1">
            <li><Text textStyle="sm"><strong>Specific and Measurable:</strong> Clearly define what you want to achieve and how progress will be measured.</Text></li>
            <li><Text textStyle="sm"><strong>Positive Framing:</strong> Write goals as affirmations of what you will accomplish.</Text></li>
            <li><Text textStyle="sm"><strong>Realistic Ambition:</strong> Set goals that are challenging yet attainable.</Text></li>
            <li><Text textStyle="sm"><strong>Time-Bound:</strong> Tie each goal to a specific due date.</Text></li>
          </ul>

          <Text textStyle="sm" className="italic">Focus on no more than three goals at a time for maximum effectiveness.</Text>

          <div className="bg-gray-50 p-3 rounded-md border border-gray-200 mt-2">
            <Text textStyle="sm" className="font-medium">Example:</Text>
            <Text textStyle="sm">Instead of "Stop procrastinating," write "Complete my weekly project tasks by Friday."</Text>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  )
}
