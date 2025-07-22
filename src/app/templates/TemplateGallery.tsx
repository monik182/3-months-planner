'use client'
import { DEFAULT_WEEKS } from '@/app/constants';
import { usePlanContext } from '@/app/providers/usePlanContext';
import { GOAL_TEMPLATES, GoalTemplate } from '@/app/templates/constants';
import { Status } from '@/app/types/types';
import { toaster } from '@/components/ui/toaster';
import { Button, Card, CardDescription, CardHeader, CardTitle, Dialog, Heading, Input, List, Portal, Tabs } from '@chakra-ui/react';
import cuid from 'cuid';
import React, { useState } from "react";
import { CiSearch } from 'react-icons/ci';
import { GoPlus } from 'react-icons/go';
import { PiBooksThin, PiBrainThin, PiBriefcaseThin, PiGraduationCapThin, PiHeartbeatThin, PiShapesThin } from 'react-icons/pi';

// Define the template categories and templates
const TEMPLATE_CATEGORIES = [
  { id: "health", name: "Health & Fitness", icon: PiHeartbeatThin },
  { id: "career", name: "Career & Business", icon: PiBriefcaseThin },
  { id: "personal", name: "Personal Development", icon: PiBrainThin },
  { id: "creative", name: "Creative Projects", icon: PiShapesThin },
  { id: "education", name: "Education & Learning", icon: PiGraduationCapThin },
  { id: "all", name: "All Templates", icon: PiBooksThin },
];

export default function TemplateGallery() {
  const { plan: currentPlan, goalActions, strategyActions, indicatorActions } = usePlanContext();
  const createGoal = goalActions.useCreate();
  const createStrategies = strategyActions.useCreateBulk();
  const createIndicators = indicatorActions.useCreateBulk();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<GoalTemplate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter templates based on search query and selected category
  const filteredTemplates = GOAL_TEMPLATES.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleApplyTemplate = async () => {
    if (selectedTemplate && currentPlan) {
      try {
        // Create the goal
        // createGoal(selectedTemplate.title);
        const goal = await createGoal.mutateAsync({
          id: cuid(),
          content: `${selectedTemplate.title}: ${selectedTemplate.description}`,
          plan: { connect: { id: currentPlan.id } },
        });

        const strategies = createStrategies.mutateAsync(selectedTemplate.strategies.map(strategy => ({
          id: cuid(),
          planId: currentPlan.id,
          goalId: goal.id,
          content: strategy.content,
          frequency: strategy.frequency,
          weeks: DEFAULT_WEEKS,
          status: Status.ACTIVE,
        })));

        const indicators = createIndicators.mutateAsync(selectedTemplate.indicators.map(indicator => ({
          id: cuid(),
          planId: currentPlan.id,
          goalId: goal.id,
          content: indicator.content,
          metric: indicator.metric,
          initialValue: indicator.initialValue,
          goalValue: indicator.goalValue,
          status: Status.ACTIVE,
        })));

        // Wait for both operations to complete
        await Promise.all([strategies, indicators]);

        // In a real application, you would also create the strategies and indicators
        // associated with this template, but that would require extending the PlanContext

        toaster.create({
          title: "Template Applied",
          description: `${selectedTemplate.title} has been added to your plan.`,
        });

        setIsDialogOpen(false);
      } catch (error) {
        console.error("Error applying template:", error);
        toaster.create({
          title: "Error",
          description: "There was a problem applying the template.",
          // variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6 p-1">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-auto flex-1">
          <CiSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs.Root value={selectedCategory} onValueChange={(e) => setSelectedCategory(e.value)} className="w-full md:w-auto" unmountOnExit>
          <Tabs.List className="grid grid-cols-3 md:grid-cols-6 w-full md:w-auto">
            {TEMPLATE_CATEGORIES.map(category => (
              <Tabs.Trigger key={category.id} value={category.id} className="text-xs">
                <category.icon className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">{category.name.split(' ')[0]}</span>
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="text-center p-12">
          <PiBooksThin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No templates found</h3>
          <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map(template => (
            <Card.Root key={template.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center">
                  {template.category === "health" && <PiHeartbeatThin className="h-5 w-5 mr-2 text-pink-500" />}
                  {template.category === "career" && <PiBriefcaseThin className="h-5 w-5 mr-2 text-blue-500" />}
                  {template.category === "personal" && <PiBrainThin className="h-5 w-5 mr-2 text-purple-500" />}
                  {template.category === "creative" && <PiShapesThin className="h-5 w-5 mr-2 text-amber-500" />}
                  {template.category === "education" && <PiGraduationCapThin className="h-5 w-5 mr-2 text-green-500" />}
                  {template.title}
                </CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <Card.Body className="flex-1">
                <div className="space-y-2">
                  <Heading size="md">Actions:</Heading>
                  <List.Root>
                    {template.strategies.slice(0, 2).map((strategy, i) => (
                      <List.Item key={i} className="text-xs">{strategy.content} ({strategy.frequency}x/week)</List.Item>
                    ))}
                    {template.strategies.length > 2 && (
                      <List.Item className="text-xs">+ {template.strategies.length - 2} more</List.Item>
                    )}
                  </List.Root>

                  <Heading size="md">Indicators:</Heading>

                  <List.Root>
                    {template.indicators.slice(0, 2).map((indicator, i) => (
                      <List.Item key={i} className="text-xs">{indicator.content}</List.Item>
                    ))}
                    {template.indicators.length > 2 && (
                      <List.Item className="text-xs">+ {template.indicators.length - 2} more</List.Item>
                    )}
                  </List.Root>
                </div>
              </Card.Body>
              <Card.Footer>
                <Dialog.Root open={isDialogOpen && selectedTemplate?.id === template.id} placement="top" size="lg" onOpenChange={(open) => {
                  setIsDialogOpen(open.open);
                  if (!open.open) setSelectedTemplate(null);
                }}>
                  <Dialog.Trigger asChild>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setSelectedTemplate(template)}
                      disabled={!currentPlan}
                    >
                      <GoPlus className="h-4 w-4 mr-2" /> Use Template
                    </Button>
                  </Dialog.Trigger>
                  <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                      <Dialog.Content>
                        <Dialog.Header>
                          <Dialog.Title>Apply Template: {template.title}</Dialog.Title>
                          <Dialog.Body>
                            This will add a new goal to your plan based on this template.
                          </Dialog.Body>
                        </Dialog.Header>
                        <Dialog.Body>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Heading size="md" className="font-medium">Actions:</Heading>
                              <List.Root>
                                {template.strategies.map((strategy, i) => (
                                  <List.Item key={i} className="text-xs">{strategy.content} ({strategy.frequency}x/week)</List.Item>
                                ))}
                              </List.Root>
                            </div>

                            <div className="space-y-2">
                              <Heading size="md" className="font-medium">Indicators:</Heading>
                              <List.Root>
                                {template.indicators.map((indicator, i) => (
                                  <List.Item key={i} className="text-xs">{indicator.content}: {indicator.initialValue} → {indicator.goalValue} {indicator.metric}</List.Item>
                                ))}
                              </List.Root>
                            </div>
                          </div>
                        </Dialog.Body>
                        <Dialog.Footer className="h-20px">
                          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleApplyTemplate}>
                            Apply Template
                          </Button>
                        </Dialog.Footer>
                      </Dialog.Content>
                    </Dialog.Positioner>
                  </Portal>
                </Dialog.Root>
              </Card.Footer>
            </Card.Root>
          ))}
        </div>
      )}
    </div>
  );
}
