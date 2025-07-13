import { IndicatorList } from '@/components/GoalManager/Indicator/IndicatorList';
import { StrategyList } from '@/components/GoalManager/Strategy/StrategyList';
import { Button, Dialog, Flex, Portal, Separator, Textarea, Text, Box } from '@chakra-ui/react';
import { CloseButton } from '@/components/ui/close-button';
import { Goal } from '@prisma/client';
import cuid from 'cuid';
import { useEffect, useState } from 'react';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';

interface GoalDialogProps {
  open: boolean;
  goal: Goal;
  onOpenChange: (open: boolean) => void;
  onAddGoal: (goal: Goal) => void;
}

export function GoalDialog({ open, goal, onOpenChange, onAddGoal }: GoalDialogProps) {
  const [newGoalContent, setNewGoalContent] = useState("");
  const [buttonText, setButtonText] = useState("Create Goal");
  const [title, setTitle] = useState("Create a New Goal");

  const handleSave = () => {
    if (newGoalContent.trim()) {
      onAddGoal({ ...goal, content: newGoalContent });
      // setNewGoalContent("");
    }
    // onOpenChange(false);
  };

  useEffect(() => {
    if (open) {
      setNewGoalContent(goal.content || "");
      if (goal.content) {
        setButtonText("Save Changes");
        setTitle("Edit Goal");
      }
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
                    value={newGoalContent}
                    onChange={(e) => setNewGoalContent(e.target.value)}
                    placeholder="Enter your goal here..."
                    className="min-h-[100px]"
                    onBlur={handleSave}
                  />
                </div>
                <div>
                  <Box>
                    <Text className="text-sm font-medium mb-2 text-gray-700">Strategies</Text>
                    <StrategyList goalId={goal.id} planId={goal.planId} maxLimit={5} />
                  </Box>
                  <Separator my={4} />
                  <Box>

                    <Flex flexDirection="column" gap="1rem">
                      <Text className="text-sm font-medium mb-2 text-gray-700">Progress Indicators</Text>
                      <IndicatorList goalId={goal.id} planId={goal.planId} maxLimit={2} />
                    </Flex>
                  </Box>
                </div>
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