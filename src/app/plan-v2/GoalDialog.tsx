import { StrategyList } from '@/components/GoalManager/Strategy/StrategyList';
import { Button, Dialog, Portal, Textarea, Text, Box, Spinner, VStack, HStack } from '@chakra-ui/react';
import { CloseButton } from '@/components/ui/close-button';
import { Goal } from '@prisma/client';
import { useEffect, useState } from 'react';
import { usePlanContext } from '@/app/providers/usePlanContext';

interface GoalDialogProps {
  open: boolean;
  goal: Goal;
  onOpenChange: (open: boolean) => void;
}

export function GoalDialog({ open, goal, onOpenChange }: GoalDialogProps) {
  const [content, setContent] = useState("");
  const [isNew, setIsNew] = useState(true)
  const [isPristine, setIsPristine] = useState(true)
  const { goalActions } = usePlanContext()
  const [title, setTitle] = useState("Create a New Goal");
  const createGoal = goalActions.useCreate()
  const saveDisabled = !content || content === goal.content || createGoal.isPending
  const showOverlay = isNew && !goal.content && !createGoal.isPending

  const handleOnChange = (content: string) => {
    setIsPristine(!content)
    setContent(content)
  }

  const handleSave = () => {
    if (content.trim()) {
      createGoal.mutate({
        ...goal,
        content: content,
        plan: { connect: { id: goal.planId } },
      }, 
      {
        onSuccess: () => {
          setIsNew(false)
        }
      }
    )
    }
  };

  useEffect(() => {
    if (open) {
      setContent(goal.content || "");
      setTitle(goal.content ? "Create a New Goal" : "Edit Goal");
      setIsNew(!goal.content)
      setIsPristine(!goal.content)
    }
  }, [open, goal.content]);

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
                {!goal.content && (
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
                  />
                  <HStack justifyContent="flex-end">
                    {!isPristine && <Button size="xs" onClick={handleSave} disabled={saveDisabled}>Save Changes</Button>}
                  </HStack>
                </div>
                <Box position="relative" aria-busy="true" userSelect="none">
                  {(createGoal.isPending) && (
                    <Box pos="absolute" inset="0" bg="bg/80" zIndex={999}>
                      <VStack>
                        <Spinner />
                        <Text color="colorPalette.600">Creating goal...</Text>
                      </VStack>
                    </Box>
                  )}
                  {(showOverlay) && (
                    <Box pos="absolute" inset="0" bg="bg/80" zIndex={999}>
                      <VStack>
                        <Text color="colorPalette.600">Enter your goal to enable the strategies</Text>
                      </VStack>
                    </Box>
                  )}
                  
                    <div>
                      <Box>
                        <Text className="text-sm font-medium mb-2 text-gray-700">Strategies</Text>
                        <StrategyList goalId={goal.id} planId={goal.planId} maxLimit={5} />
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
            <Dialog.Footer>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}