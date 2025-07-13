import { Button, Dialog, Portal, Textarea } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

interface GoalDialogProps {
  open: boolean;
  content?: string;
  onOpenChange: (open: boolean) => void;
  onAddGoal: (goal: string) => void;
}

export function GoalDialog({ open, content, onOpenChange, onAddGoal }: GoalDialogProps) {
  const [newGoalContent, setNewGoalContent] = useState("");
  const [buttonText, setButtonText] = useState("Create Goal");
  const [title, setTitle] = useState("Create a New Goal");

  const handleSave = () => {
    if (newGoalContent.trim()) {
      onAddGoal(newGoalContent);
      setNewGoalContent("");
    }
  };

  useEffect(() => {
    if (open) {
      setNewGoalContent(content || "");
      if (content) {
        setButtonText("Save Changes");
        setTitle("Edit Goal");
      }
    }
  }, [open, content]);

  return (
    <Dialog.Root open={open} onOpenChange={({ open }) => onOpenChange(open)}>
      {/* <Dialog.Trigger asChild>
          <Button className="bg-quarterFocus-purple hover:bg-quarterFocus-purple-dark">
            <LuPlus className="mr-2 h-4 w-4" /> Add Goal
          </Button>
        </Dialog.Trigger> */}
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>

            </Dialog.Header>
            <Dialog.Body>
              <div className="space-y-4 py-4">
                {!content && (
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
                  />
                </div>
              </div>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>{buttonText}</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}