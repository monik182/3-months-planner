"use client";
import {
  DashboardProvider,
} from "@/app/dashboard-legacy/dashboardContext";
import { GoalCard } from "@/app/plan/GoalCard";
import { GoalDialog } from "@/components/GoalDialog";
import { usePlanContext } from "@/app/providers/usePlanContext";
import { getCurrentWeekFromStartDate, handleKeyDown } from "@/app/util";
import { SavingSpinner } from "@/components/SavingSpinner";
import { Button } from "@/components/ui/button";
import {
  Box,
  Card,
  Collapsible,
  Container,
  Center,
  Flex,
  HStack,
  Heading,
  Spacer,
  Stat,
  Text,
  Textarea,
  VStack,
  Spinner,
} from "@chakra-ui/react";
import { Goal } from "@prisma/client";
import cuid from "cuid";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import NextLink from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { SlNotebook } from "react-icons/sl";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { LuCalendarDays, LuPlus, LuTarget } from "react-icons/lu";
import { PiChartPieSlice } from "react-icons/pi";

function PlanV2Page() {
  const { plan, planActions, goalActions } = usePlanContext();
  const startOfYPlan = dayjs(plan?.startDate).format("MMMM, DD YYYY");
  const endOfYPlan = dayjs(plan?.endDate).format("MMMM, DD YYYY");
  const currentWeek = getCurrentWeekFromStartDate(plan?.startDate as Date) || 0;
  const [editing, setEditing] = useState(false);
  const [vision, setVision] = useState(plan?.vision || "");
  const update = planActions.useUpdate();
  const [goalsDescriptionOpen, setGoalsDescriptionOpen] = useState(false);
  const [visionDescriptionOpen, setVisionDescriptionOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [newGoal, setNewGoal] = useState<Goal | null>(null);

  const { data: goalsData = [], isLoading: loadingGoals } =
    goalActions.useGetByPlanId(plan?.id as string);
  const [orderedGoals, setOrderedGoals] = useState<Goal[]>([]);

  useEffect(() => {
    setOrderedGoals((prev) => {
      const prevIds = prev
        .map((g) => g.id)
        .sort()
        .join(",");
      const newIds = goalsData
        .map((g) => g.id)
        .sort()
        .join(",");

      if (prevIds === newIds) {
        // Avoid creating a new array when goals haven't changed
        return prev;
      }

      return goalsData;
    });
  }, [goalsData]);

  const toggleGoalDescription = () => {
    setGoalsDescriptionOpen(!goalsDescriptionOpen);
  };

  const toggleVisionDescription = () => {
    setVisionDescriptionOpen(prev => !prev);
  };

  const handleSave = () => {
    setEditing(false);
    update.mutate({ planId: plan!.id, updates: { vision } });
  };

  const handleCancel = () => {
    setEditing(false);
    setVision(plan!.vision);
  };

  const generateNewGoal = () => {
    return {
      id: cuid(),
      planId: plan!.id,
      content: "",
      status: `1`,
      createdAt: null,
    };
  };

  const openGoalDialog = () => {
    setNewGoal(generateNewGoal());
    setOpenDialog(true);
  };

  const closeGoalDialog = (open: boolean) => {
    setOpenDialog(open);
    if (!open) {
      setNewGoal(null);
    }
  };

  if (!plan) {
    return (
      <Center h="full">
        <EmptyState
          icon={<SlNotebook />}
          title="No plan yet"
          size="lg"
          description="Create a new plan to get started"
        >
          <Button asChild colorPalette="cyan">
            <NextLink href="/plan/new">Create Plan</NextLink>
          </Button>
        </EmptyState>
      </Center>
    );
  }

  return (
    <Container padding="10px">
      {/* <Flex justify="flex-end" mb={4}>
        <Button
          asChild
          variant="outline"
          size="sm"
          disabled={plan.started}
        >
          <NextLink href={plan.started ? "" : "/plan/new"}>Create New Plan</NextLink>
        </Button>
      </Flex> */}
      <Flex gap="20px" direction="column">
        <Box
          shadow="lg"
          padding="20px"
          borderRadius="sm"
          border="none"
          className="flex gap-5 flex-col"
        >
          <Flex
            justifyContent={{ base: "flex-start", md: "space-between" }}
            flexDirection={{ base: "column", md: "row" }}
          >
            <VStack gap="2" align="start" mb="4">
              <Heading size="2xl">My Plan</Heading>
              <HStack gap="2">
                <LuCalendarDays />
                <Text fontWeight="light" fontSize="sm" color="gray.500">
                  {startOfYPlan} to {endOfYPlan}
                </Text>
              </HStack>
            </VStack>
            <Flex gap="4">
              <Stat.Root
                maxW="300px"
                borderWidth="1px"
                p="4"
                rounded="md"
                alignItems="center"
                justifyContent="center"
              >
                <HStack justify="space-between">
                  <Stat.Label>Current Week</Stat.Label>
                </HStack>
                <Stat.ValueText>{currentWeek}/12</Stat.ValueText>
              </Stat.Root>
              {/* <Stat.Root
                maxW="300px"
                borderWidth="1px"
                p="4"
                rounded="md"
                alignItems="center"
                justifyContent="center"
              >
                <HStack justify="space-between">
                  <Stat.Label>Progress</Stat.Label>
                </HStack>
                <Stat.ValueText>{planScore}%</Stat.ValueText>
              </Stat.Root> */}
            </Flex>
          </Flex>
          {/* <ProgressRoot colorPalette="cyan" value={progressValue}>
            <HStack gap="5">
              <ProgressBar flex="1" />
              <ProgressValueText>{week}/12</ProgressValueText>
            </HStack>
          </ProgressRoot> */}
          <Card.Root>
            <Card.Body gap="2">
              <Card.Title mt="2">Define Your 3-Month Vision</Card.Title>
              <Card.Description>
                <VisionDescription open={visionDescriptionOpen} onToggle={toggleVisionDescription} />
              </Card.Description>
              <Spacer />
              {editing || update.isPending ? (
                <Textarea
                  autoresize
                  size="xl"
                  variant="subtle"
                  value={vision}
                  readOnly={update.isPending}
                  onChange={(e) => setVision(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, handleSave)}
                  placeholder="Think big. What are the dreams you’ve always wanted to pursue? How would your life look if you reached your full potential? Be bold and dream unapologetically."
                />
              ) : (
                <Text fontSize="sm">{plan.vision}</Text>
              )}

              <SavingSpinner loading={update.isPending} />
            </Card.Body>
            <Card.Footer justifyContent="flex-end">
              {editing || update.isPending ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={update.isPending}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={update.isPending}>
                    Save
                  </Button>
                </>
              ) : (
                <Button variant="ghost" onClick={() => setEditing(true)}>
                  Edit
                </Button>
              )}
            </Card.Footer>
          </Card.Root>
          <Card.Root>
            <Card.Body gap="2">
              <Card.Title mt="2">Goals</Card.Title>
              <Card.Description>
                <GoalDescription open={goalsDescriptionOpen} onToggle={toggleGoalDescription} />
              </Card.Description>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                {orderedGoals.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} />
                ))}
              </div>
              <section>
                <Card.Root className="col-span-full border-dashed bg-muted/50 new-goal-card relative">
                  <Card.Body className="flex flex-col items-center justify-center py-10">
                    <div className="text-center space-y-2">
                      <LuTarget className="mx-auto h-8 w-8 text-muted-foreground" />
                      {orderedGoals.length === 0 ? (
                        <>
                          <h3 className="font-semibold text-lg">
                            No Goals Yet
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Create goals to track your progress over the next 12
                            weeks.
                          </p>
                          <Button
                            variant="outline"
                            className="mt-2"
                            onClick={openGoalDialog}
                          >
                            <LuPlus className="mr-2 h-4 w-4" /> Add Your First
                            Goal
                          </Button>
                        </>
                      ) : (
                        <>
                          <h3 className="font-semibold text-lg">
                            Add a new goal
                          </h3>
                          <Button
                            variant="outline"
                            className="mt-2"
                            onClick={openGoalDialog}
                          >
                            <LuPlus className="mr-2 h-4 w-4" /> Add Goal
                          </Button>
                        </>
                      )}
                    </div>
                  </Card.Body>
                  {loadingGoals && (
                    <Box
                      pos="absolute"
                      inset="0"
                      bg="bg/80"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      borderRadius="inherit"
                    >
                      <Spinner />
                    </Box>
                  )}
                </Card.Root>
              </section>
            </Card.Body>
          </Card.Root>
        </Box>
        <Box shadow="lg" padding="20px" borderRadius="sm" border="none">
          <div className="grid gap-4 md:grid-cols-1">
            <Card.Root className="flex flex-col items-center text-center p-6">
              <PiChartPieSlice className="h-12 w-12 mb-4 text-black" />
              <h3 className="text-xl font-bold mb-2">Track Progress</h3>
              <p className="text-muted-foreground mb-4">
                View charts and trends of your indicators to see your progress over time.
              </p>
              <Button asChild colorPalette="black" className="mt-auto">
                <NextLink href="/progress">View Progress</NextLink>
              </Button>
            </Card.Root>

            {/* <Card.Root className="flex flex-col items-center text-center p-6">
              <PiFileText className="h-12 w-12 mb-4 text-black" />
              <h3 className="text-xl font-bold mb-2">Goal Templates</h3>
              <p className="text-muted-foreground mb-4">
                Browse pre-built goal templates for common objectives and add them to your plan.
              </p>
              <Button asChild colorPalette="black" className="mt-auto">
                <NextLink href="/templates">Browse Templates</NextLink>
              </Button>
            </Card.Root> */}
            {/* 
            <Card.Root className="flex flex-col items-center text-center p-6">
              <PiLightbulb className="h-12 w-12 mb-4 text-black" />
              <h3 className="text-xl font-bold mb-2">AI Suggestions</h3>
              <p className="text-muted-foreground mb-4">
                Get intelligent suggestions for goals, strategies, and indicators based on your plan.
              </p>
              <Button asChild colorPalette="black" className="mt-auto">
                <NextLink href="/suggestions">Get Suggestions</NextLink>
              </Button>
            </Card.Root> */}
          </div>
        </Box>
      </Flex>
      <GoalDialog
        open={openDialog}
        goal={newGoal ?? generateNewGoal()}
        onOpenChange={closeGoalDialog}
      />
    </Container>
  );
}

function PlanV2WithContext() {
  return (
    <DashboardProvider fetchHistory={false}>
      <PlanV2Page />
    </DashboardProvider>
  );
}

export default PlanV2WithContext;

function GoalDescription({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="text-gray-700">
      <Text textStyle="sm">
        Goals are the building blocks of your vision. They start with a clear
        action verb and are written as complete sentences.
      </Text>

      <Collapsible.Root open={open}>
        <Collapsible.Trigger
          onClick={onToggle}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 mt-2 mb-1"
        >
          {open ? "Show less" : "Show more"}
          {open ? (
            <HiChevronUp size={16} className="ml-1" />
          ) : (
            <HiChevronDown size={16} className="ml-1" />
          )}
        </Collapsible.Trigger>

        <Collapsible.Content className="text-sm space-y-2">
          <Text textStyle="sm">
            To create effective goals, follow these criteria:
          </Text>

          <ul className="list-disc pl-5 space-y-1">
            <li>
              <Text textStyle="sm">
                <strong>Specific and Measurable:</strong> Clearly define what
                you want to achieve and how progress will be measured.
              </Text>
            </li>
            <li>
              <Text textStyle="sm">
                <strong>Positive Framing:</strong> Write goals as affirmations
                of what you will accomplish.
              </Text>
            </li>
            <li>
              <Text textStyle="sm">
                <strong>Realistic Ambition:</strong> Set goals that are
                challenging yet attainable.
              </Text>
            </li>
            <li>
              <Text textStyle="sm">
                <strong>Time-Bound:</strong> Tie each goal to a specific due
                date.
              </Text>
            </li>
          </ul>

          <Text textStyle="sm" className="italic">
            Focus on no more than three goals at a time for maximum
            effectiveness.
          </Text>

          <div className="bg-gray-50 p-3 rounded-md border border-gray-200 mt-2">
            <Text textStyle="sm" className="font-medium">
              Example:
            </Text>
            <Text textStyle="sm">
              Instead of "Stop procrastinating," write "Complete my weekly
              project tasks by Friday."
            </Text>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  );
}
function VisionDescription({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="text-gray-700">
      <Text textStyle="sm">
        Dare to plan without limits—focus on what you’ll achieve in the next quarter. Picture where you want to be
        three months from now. Be bold and unapologetic—this is your life, your next chapter.
      </Text>

      <Collapsible.Root open={open}>
        <Collapsible.Trigger
          onClick={onToggle}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 mt-2 mb-1"
        >
          {open ? "Show less" : "Show more"}
          {open ? (
            <HiChevronUp size={16} className="ml-1" />
          ) : (
            <HiChevronDown size={16} className="ml-1" />
          )}
        </Collapsible.Trigger>

        <Collapsible.Content className="text-sm space-y-2">

          <ul className="list-disc pl-5 space-y-1">
            <li>
              <Text textStyle="sm">
                <strong>Identify Your Core Passions:</strong> Which interests energize you right now? What projects or skills
                do you most want to dive into over the next 90 days?
              </Text>
            </li>
            <li>
              <Text textStyle="sm">
                <strong>Clarify Key Milestones:</strong> In your career, relationships, health, or personal growth, what specific
                outcomes would make you feel accomplished by the end of the quarter?
              </Text>
            </li>
            <li>
              <Text textStyle="sm">
                <strong>Align with Your Values:</strong> How will each milestone reflect what matters most to you? Make sure
                every goal resonates with your deeper purpose.
              </Text>
            </li>
            <li>
              <Text textStyle="sm">
                <strong>Visualize Daily Actions:</strong> Break each milestone into weekly and daily “must-do” tasks. Envision
                yourself checking off each step—what does that feel like?
              </Text>
            </li>
            <li>
              <Text textStyle="sm">
                <strong>Fuel Your Motivation:</strong> Picture yourself at the end of three months—energized, proud, and on track.
                How will you celebrate your wins?
              </Text>
            </li>
          </ul>

          <Text textStyle="sm" className="italic">
            Dream as if failure isn’t an option—then map out exactly how you’ll make it happen in the next 12 weeks. Let this
            focused vision excite and guide you every single day.
          </Text>
          <div className="bg-gray-50 p-3 rounded-md border border-gray-200 mt-2">
            <Text textStyle="sm" className="font-medium">
              Example:
            </Text>
            <ul className="list-disc pl-5 space-y-1">
              <li>Complete an online course in digital marketing</li>
              <li>Have weekly coffee dates with three mentors</li>
              <li>Run a 5K in under 30 minutes</li>
            </ul>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  );
}
