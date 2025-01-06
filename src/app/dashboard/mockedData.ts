import { Plan } from '@/types'
import { WEEKS } from '../constants'

export const mockedPlan: Plan = {
  id: 'P1',
  vision: 'Achieve personal growth by improving health, building a content creation portfolio, and developing AI expertise.',
  threeYearMilestone: 'Become a healthier individual, an established content creator, and proficient in AI technologies.',
  goals: [
    {
      id: '1',
      content: 'Lose 10 kilos by March 31.',
      isEditingWeeks: false,
      strategies: [
        {
          id: 's1',
          content: 'Track daily calorie intake using a food diary by January 15.',
          weeks: ['1', '2'],
          isEditing: false
        },
        {
          id: 's2',
          content: 'Exercise for 40 minutes, 4 times a week, starting January 1.',
          weeks: WEEKS.map(w => w.toString()),
          isEditing: false
        },
        {
          id: 's3',
          content: 'Drink 2 liters of water daily starting January 1.',
          weeks: WEEKS.map(w => w.toString()),
          isEditing: false
        }
      ],
      indicators: [
        {
          id: 'i1',
          content: 'Weight reduction',
          startingNumber: 87,
          goalNumber: 77,
          metric: 'kg',
          isEditing: false
        }
      ]
    },
    {
      id: '2',
      content: 'Publish 5 videos on YouTube by March 31.',
      isEditingWeeks: false,
      strategies: [
        {
          id: 's4',
          content: 'Write scripts for 2 video topics by January 15.',
          weeks: ['2'],
          isEditing: false
        },
        {
          id: 's5',
          content: 'Record and edit the first video by January 20.',
          weeks: ['3'],
          isEditing: false
        },
        {
          id: 's6',
          content: 'Publish the first video by January 25.',
          weeks: ['4'],
          isEditing: false
        }
      ],
      indicators: [
        {
          id: 'i2',
          content: 'Number of videos published',
          startingNumber: 0,
          goalNumber: 5,
          metric: 'videos',
          isEditing: false
        }
      ]
    },
    {
      id: '3',
      content: 'Complete 3 AI courses by March 31.',
      isEditingWeeks: false,
      strategies: [
        {
          id: 's7',
          content: 'Dedicate 5 hours weekly to online AI courses starting January 1.',
          weeks: WEEKS.map(w => w.toString()),
          isEditing: false
        },
        {
          id: 's8',
          content: 'Complete the first course by February 15.',
          weeks: ['6'],
          isEditing: false
        },
        {
          id: 's9',
          content: 'Create a project using the skills learned in the second course by March 15.',
          weeks: ['10'],
          isEditing: false
        }
      ],
      indicators: [
        {
          id: 'i3',
          content: 'Courses completed',
          startingNumber: 0,
          goalNumber: 3,
          metric: 'courses',
          isEditing: false
        },
        {
          id: 'i4',
          content: 'Projects created',
          startingNumber: 0,
          goalNumber: 1,
          metric: 'projects',
          isEditing: false
        },
        {
          id: 'i5',
          content: 'Hours spent on AI courses',
          startingNumber: 0,
          goalNumber: 60,
          metric: 'hours',
          isEditing: false,
        },
        {
          id: 'i6',
          content: 'AI skills proficiency',
          startingNumber: 0,
          goalNumber: 100,
          metric: '%',
          isEditing: false
        }
      ]
    }
  ],
  startDate: '2024-12-03',
  endDate: '2025-02-24'
}
