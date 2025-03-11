import { Editable, IconButton } from '@chakra-ui/react'
import { WeeksSelector } from '../WeeksSelector'
import { useEffect, useState } from 'react'
import React from 'react'
import { Strategy } from '@prisma/client'
import { FrequencySelector } from '@/components/GoalManager/FrequencySelector'
import { DEFAULT_FREQUENCY_LIST } from '@/app/constants'
import { HiChevronDown, HiChevronUp } from 'react-icons/hi2'
import { CiCalendar, CiClock2 } from 'react-icons/ci'
import { IoIosClose } from 'react-icons/io'

interface StrategyProps {
  strategy: Omit<Strategy, 'status'>
  onChange: (strategy: Omit<Strategy, 'status'>) => void
  onAdd?: () => void
  onRemove: () => void
  onClick?: () => void
  disabled?: boolean
  isActive?: boolean
}

export const StrategyForm = React.memo(function StrategyForm({ 
  strategy, 
  disabled = false, 
  onAdd, 
  onChange, 
  onRemove, 
  onClick,
  isActive = false
}: StrategyProps) {
  const [value, setValue] = useState(strategy)
  const [isEditingWeeks, setIsEditingWeeks] = useState(false)
  const [isEditingFrequency, setIsEditingFrequency] = useState(false)

  const handleWeekUpdate = (weeks: string[]) => {
    const updatedValue = { ...value, weeks: weeks.sort((a, b) => parseInt(a) - parseInt(b)) }
    setValue(updatedValue)
    onChange(updatedValue)
  }

  const handleFrequencyUpdate = (frequency: number) => {
    const updatedValue = { ...value, frequency }
    setValue(updatedValue)
    onChange(updatedValue)
  }

  const handleValueUpdate = (content: string) => {
    const updatedValue = { ...value, content }
    setValue(updatedValue)
    onChange(updatedValue)
  }

  const toggleWeeksSelector = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditingWeeks(prev => !prev)
    if (isEditingFrequency) setIsEditingFrequency(false)
  }

  const toggleFrequencySelector = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditingFrequency(prev => !prev)
    if (isEditingWeeks) setIsEditingWeeks(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      onAdd?.()
    }
  }

  useEffect(() => {
    setValue(strategy)
  }, [strategy])

  useEffect(() => {
    const handleClickOutside = () => {
      if (isEditingWeeks) setIsEditingWeeks(false)
      if (isEditingFrequency) setIsEditingFrequency(false)
    }

    if (isEditingWeeks || isEditingFrequency) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isEditingWeeks, isEditingFrequency])

  return (
    <div 
      className={`p-3 rounded-md transition-all ${isActive ? 'bg-gray-50' : 'bg-white'}`}
      onClick={onClick}
    >
      <div className="w-full space-y-3">
        <div className="flex justify-between items-center">
          <Editable.Root
            value={value.content}
            onValueChange={(e) => handleValueUpdate(e.value)}
            placeholder="What is your next strategy?"
            onKeyDown={(e) => handleKeyDown(e)}
            defaultEdit
            disabled={disabled}
            className="flex-1"
          >
            <Editable.Preview className="text-sm" />
            <Editable.Input className="text-sm" disabled={disabled} autoComplete="off" />
          </Editable.Root>
          
          <IconButton
            size="xs"
            variant="ghost"
            aria-label="Remove strategy"
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="text-gray-400 hover:text-gray-700"
          >
            <IoIosClose size={14} />
          </IconButton>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center text-xs text-gray-600">
          <div className="relative">
            <button 
              onClick={toggleWeeksSelector} 
              className={`flex items-center px-2 py-1 rounded text-gray-600 border ${isEditingWeeks ? 'border-gray-400 bg-gray-50' : 'border-gray-200'}`}
            >
              <CiCalendar size={14} className="mr-1.5 text-gray-500" />
              <span>
                {value.weeks.length === 12 
                  ? 'Every week' 
                  : value.weeks.length > 3 
                    ? `${value.weeks.length} weeks` 
                    : `Weeks ${value.weeks.join(', ')}`
                }
              </span>
              {isEditingWeeks ? <HiChevronUp size={14} className="ml-1" /> : <HiChevronDown size={14} className="ml-1" />}
            </button>
            
            {isEditingWeeks && (
              <div className="absolute z-10 mt-1" onClick={(e) => e.stopPropagation()}>
                <WeeksSelector 
                  weeks={value.weeks} 
                  setWeeks={handleWeekUpdate} 
                  onFocusOutside={() => setIsEditingWeeks(false)} 
                />
              </div>
            )}
          </div>
          
          <div className="relative">
            <button 
              onClick={toggleFrequencySelector} 
              className={`flex items-center px-2 py-1 rounded text-gray-600 border ${isEditingFrequency ? 'border-gray-400 bg-gray-50' : 'border-gray-200'}`}
            >
              <CiClock2 size={14} className="mr-1.5 text-gray-500" />
              <span>{DEFAULT_FREQUENCY_LIST[value.frequency - 1].label}</span>
              {isEditingFrequency ? <HiChevronUp size={14} className="ml-1" /> : <HiChevronDown size={14} className="ml-1" />}
            </button>
            
            {isEditingFrequency && (
              <div className="absolute z-10 mt-1" onClick={(e) => e.stopPropagation()}>
                <FrequencySelector 
                  frequency={value.frequency} 
                  setFrequency={handleFrequencyUpdate} 
                  onFocusOutside={() => setIsEditingFrequency(false)} 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})
