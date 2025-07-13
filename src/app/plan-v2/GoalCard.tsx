
import { GoalDialog } from '@/app/plan-v2/GoalDialog';
import { usePlanContext } from '@/app/providers/usePlanContext';
import { calculateCompletionScore } from '@/app/util';
import { Badge, Button, Card, Collapsible } from '@chakra-ui/react';
import { Goal } from '@prisma/client';
import React, { useState } from "react";
import { LuChevronDown, LuChevronUp, LuListChecks, LuPlus } from 'react-icons/lu';

interface GoalCardProps {
  goal: Goal;
}

export function GoalCard({ goal }: GoalCardProps) {
  const { plan, planActions, goalActions, strategyActions, indicatorActions } = usePlanContext()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStrategyDialogOpen, setIsStrategyDialogOpen] = useState(false);
  const [isIndicatorDialogOpen, setIsIndicatorDialogOpen] = useState(false);
  const [editedContent, setEditedContent] = useState(goal.content);
  const [isOpen, setIsOpen] = useState(false);
  const updateGoal = goalActions.useUpdate()
  const deleteGoal = goalActions.useDelete()
  const { data: strategies = [] } = strategyActions.useGetByGoalId(goal.id)
  const { data: indicators = [] } = indicatorActions.useGetByGoalId(goal.id)

  // const progress = calculateCompletionScore(strategies);
  const strategiesCount = strategies?.length || 0;
  const indicatorsCount = indicators?.length || 0;

  const handleUpdateGoal = () => {
    if (editedContent.trim()) {
      updateGoal.mutate({ goalId: goal.id, updates: { content: editedContent } });
      // setIsEditDialogOpen(false);
    }
  };

  const handleDeleteGoal = () => {
    deleteGoal.mutate(goal.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <Card.Root className="hover:shadow-md transition-shadow duration-300">
      <Card.Header className="pb-2">
        <div className="flex justify-between items-start">
          <Card.Title className="text-lg">{goal.content}</Card.Title>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" onClick={() => setIsEditDialogOpen(true)}>
              {/* <Edit className="h-4 w-4" /> */}
              EDIT
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsDeleteDialogOpen(true)}>
              {/* <Trash2 className="h-4 w-4 text-destructive" /> */}
              TRASH
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          {/* <Progress value={progress} className="h-2 flex-grow" /> */}
          {/* <span className="text-xs font-medium">{progress}%</span> */}
        </div>
      </Card.Header>
      <Card.Body className="pb-2">
        <div className="flex gap-2 text-xs mt-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <LuListChecks className="h-3 w-3" />
            {strategiesCount} {strategiesCount === 1 ? "Strategy" : "Strategies"}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            {/* <BarChart2 className="h-3 w-3" /> */}
            BAR CHART
            {indicatorsCount} {indicatorsCount === 1 ? "Indicator" : "Indicators"}
          </Badge>
        </div>
      </Card.Body>

      <Collapsible.Root open={isOpen} onOpenChange={({ open }) => setIsOpen(open)} className="px-4">
        {(strategies?.length > 0 || indicators?.length > 0) && (
          <Collapsible.Trigger asChild>
            <Button variant="ghost" size="sm" className="flex w-full justify-center">
              {isOpen ? (
                <LuChevronUp className="h-4 w-4 opacity-50" />
              ) : (
                <LuChevronDown className="h-4 w-4 opacity-50" />
              )}
            </Button>
          </Collapsible.Trigger>
        )}

        <Collapsible.Content className="space-y-4 pt-2">
          {strategies?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center">
                <LuListChecks className="h-3 w-3 mr-1" /> Strategies
              </h4>
              <ul className="space-y-1">
                {strategies.map(strategy => (
                  <li key={strategy.id} className="text-xs text-muted-foreground">
                    • {strategy.content} ({strategy.frequency}x/week)
                  </li>
                ))}
              </ul>
            </div>
          )}

          {indicators?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center">
                {/* <BarChart2 className="h-3 w-3 mr-1" /> */}
                Indicators
              </h4>
              <ul className="space-y-1">
                {indicators.map(indicator => (
                  <li key={indicator.id} className="text-xs text-muted-foreground">
                    • {indicator.content}: {indicator.initialValue} → {indicator.goalValue} {indicator.metric}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Collapsible.Content>
      </Collapsible.Root>

      {/* <Card.Footer className="pt-2 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => setIsStrategyDialogOpen(true)}
        >
          <LuPlus className="h-3 w-3 mr-1" /> Strategy
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => setIsIndicatorDialogOpen(true)}
        >
          <LuPlus className="h-3 w-3 mr-1" /> Indicator
        </Button>
      </Card.Footer> */}
      <GoalDialog open={isEditDialogOpen} goal={goal} onOpenChange={setIsEditDialogOpen} onAddGoal={handleUpdateGoal} />

      {/* Delete Goal Dialog */}
      {/* <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Goal</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this goal? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteGoal}
            >
              Delete Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </Card.Root>
  );
}

