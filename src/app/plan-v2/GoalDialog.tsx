import { StrategyList } from '@/components/GoalManager/Strategy/StrategyList';
import { Button, Dialog, Portal, Textarea, Text, Box, Spinner, VStack, HStack } from '@chakra-ui/react';
import { CloseButton } from '@/components/ui/close-button';
import { Goal, Indicator, Strategy } from '@prisma/client';
import { useEffect, useState } from 'react';
import { usePlanContext } from '@/app/providers/usePlanContext';
import { createGoalHistoryList, createIndicatorHistoryList, createStrategyHistoryList } from '@/app/util';
import { toaster } from '@/components/ui/toaster';
import { EntityType } from '@/app/types/types';

interface GoalDialogProps {
  open: boolean;
  goal: Goal;
  onOpenChange: (open: boolean) => void;
  edit?: boolean
}

export function GoalDialog({ open, goal, edit = false, onOpenChange }: GoalDialogProps) {
  const planId = goal.planId
  const { goalActions, goalHistoryActions, strategyHistoryActions, indicatorHistoryActions } = usePlanContext()
  const createBulkGoal = goalHistoryActions.useCreateBulk()
  const createBulkStrategy = strategyHistoryActions.useCreateBulk()
  // const createBulkIndicator = indicatorHistoryActions.useCreateBulk()
  const [content, setContent] = useState("");
  const [isNew, setIsNew] = useState(true)
  const [isPristine, setIsPristine] = useState(true)
  const [title, setTitle] = useState("Create a New Goal");
  const createGoal = goalActions.useCreate()
  const updateGoal = goalActions.useUpdate()
  const loading = createGoal.isPending || updateGoal.isPending
  const saveDisabled = !content || content === goal.content || loading
  const showOverlay = isNew && !goal.content && !loading

  const createGoalHistory = (goal: Goal) => {
    createBulkGoal.mutate(createGoalHistoryList(planId, [goal]), {
      onSuccess: () => {
        toaster.create({
          title: 'Goal created',
          type: 'success',
          duration: 2000
        })
      },
      onError: (error) => {
        toaster.create({
          title: 'Error creating goal',
          description: error.message,
          type: 'error'
        })
      }
    })
  }

  const createStrategyHistory = (_: EntityType, strategy: Strategy) => {
    createBulkStrategy.mutate(createStrategyHistoryList(planId, [strategy]), {
      onSuccess: () => {
        toaster.create({
          title: 'Action created',
          type: 'success',
          duration: 2000
        })
      },
      onError: (error) => {
        toaster.create({
          title: 'Error creating action',
          description: error.message,
          type: 'error'
        })
      }
    })
  }

  // const updateIndicators = (indicator: Indicator) => {
  //   createBulkIndicator.mutate(createIndicatorHistoryList(planId, [indicator]), {
  //     onSuccess: () => {
  //       toaster.create({
  //         title: 'Indicators updated',
  //         type: 'success',
  //         duration: 2000
  //       })
  //     },
  //     onError: (error) => {
  //       toaster.create({
  //         title: 'Error updating indicators',
  //         description: error.message,
  //         type: 'error'
  //       })
  //     }
  //   })
  // }

  const handleOnChange = (content: string) => {
    setIsPristine(!content)
    setContent(content)
  }

  const handleSave = () => {
    if (content.trim()) {

      if (edit) {
        updateGoal.mutate({ goalId: goal.id, updates: { content } })
      } else {
        createGoal.mutate({
          ...goal,
          content: content,
          plan: { connect: { id: goal.planId } },
        },
          {
            onSuccess: () => {
              setIsNew(false)
              createGoalHistory({ ...goal, content })
            }
          })
      }
    }
  };

  useEffect(() => {
    if (open) {
      setContent(goal.content || "");

    }
  }, [open, goal.content]);

  useEffect(() => {
    setTitle(!edit ? "Create a New Goal" : "Edit Goal");
    setIsNew(!edit)
    setIsPristine(!edit)
  }, [edit])

  return (
    <Dialog.Root open={open} onOpenChange={({ open }) => onOpenChange(open)}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
              <CloseButton
                size="sm"
                position="absolute"
                top="2"
                right="2"
                onClick={() => onOpenChange(false)}
              />
            </Dialog.Header>
            <Dialog.Body>
              <div className="space-y-4 py-4">
                {!edit && (
                  <Dialog.Description>
                    Add a new goal to your 12-week plan. Keep it specific and achievable.
                  </Dialog.Description>
                )}
                <div className="space-y-2">
                  {/* <Label htmlFor="goal">Goal Description</Label> */}
                  <Textarea
                    id="goal"
                    value={content}
                    onChange={(e) => handleOnChange(e.target.value)}
                    placeholder="Enter your goal here..."
                    className="min-h-[100px]"
                    onBlur={handleSave}
                    readOnly={loading}
                  />
                  <HStack justifyContent="flex-end">
                    {!isPristine && <Button size="xs" onClick={handleSave} disabled={saveDisabled}>Save Changes</Button>}
                  </HStack>
                </div>
                <Box position="relative" aria-busy="true" userSelect="none">
                  {(loading) && (
                    <Box pos="absolute" inset="0" bg="bg/80" zIndex={999}>
                      <VStack>
                        <Spinner />
                        <Text color="colorPalette.600">{edit ? 'Updating' : 'Creating'} goal...</Text>
                      </VStack>
                    </Box>
                  )}
                  {(showOverlay) && (
                    <Box pos="absolute" inset="0" bg="bg/80" zIndex={999}>
                      <VStack>
                        <Text color="colorPalette.600">Enter your goal to add actions</Text>
                      </VStack>
                    </Box>
                  )}

                  <div>
                    <Box>
                      <Text className="text-sm font-medium mb-2 text-gray-700">Actions</Text>
                      <StrategyList goalId={goal.id} planId={goal.planId} maxLimit={Infinity} onEdit={createStrategyHistory} />
                    </Box>
                    {/* // TODO: Check if indicators are necessary */}
                    {/* <Separator my={4} />
                        <Box>
                          <Flex flexDirection="column" gap="1rem">
                            <Text className="text-sm font-medium mb-2 text-gray-700">Progress Indicators</Text>
                            <IndicatorList goalId={goal.id} planId={goal.planId} maxLimit={2} />
                          </Flex>
                        </Box> */}
                  </div>

                </Box>
              </div>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}