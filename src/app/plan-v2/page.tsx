"use client";
import {
  DashboardProvider,
  useDashboardContext,
} from "@/app/dashboard/dashboardContext";
import { GoalCard } from "@/app/plan-v2/GoalCard";
import { GoalDialog } from "@/app/plan-v2/GoalDialog";
import { usePlanContext } from "@/app/providers/usePlanContext";
import { getCurrentWeekFromStartDate, handleKeyDown } from "@/app/util";
import { SavingSpinner } from "@/components/SavingSpinner";
import { Button } from "@/components/ui/button";
import {
  ProgressBar,
  ProgressRoot,
  ProgressValueText,
} from "@/components/ui/progress";
import {
  Box,
  Card,
  Collapsible,
  Container,
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
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import { LuCalendarDays, LuPlus, LuTarget } from "react-icons/lu";
import { PiChartPieSlice, PiFileText, PiLightbulb } from "react-icons/pi";

function PlanV2Page() {
  const { plan, planActions, goalActions } = usePlanContext();
  const { planScore } = useDashboardContext();
  const startOfYPlan = dayjs(plan?.startDate).format("MMMM, DD YYYY");
  const endOfYPlan = dayjs(plan?.endDate).format("MMMM, DD YYYY");
  const currentWeek = getCurrentWeekFromStartDate(plan?.startDate as Date) || 0;
  const hasNotStarted = currentWeek <= 0;
  const progressValue = hasNotStarted ? 0 : (currentWeek / 12) * 100;
  const week = hasNotStarted ? 1 : currentWeek;
  const [editing, setEditing] = useState(false);
  const [vision, setVision] = useState(plan?.vision || "");
  const update = planActions.useUpdate();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [newGoal, setNewGoal] = useState<Goal | null>(null);

  const { data: goalsData = [], isLoading: loadingGoals } =
    goalActions.useGetByPlanId(plan?.id);
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
        // same set - update in place
        return prev.map((g) => goalsData.find((ng) => ng.id === g.id) ?? g);
      }
      return goalsData;
    });
  }, [goalsData]);

  const toggleDetails = () => {
    setDetailsOpen(!detailsOpen);
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

  if (!plan) return null;

  return (
    <Container padding="10px">
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
              <Stat.Root
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
              </Stat.Root>
            </Flex>
          </Flex>
          <ProgressRoot colorPalette="yellow" value={progressValue}>
            <HStack gap="5">
              <ProgressBar flex="1" />
              <ProgressValueText>{week}/12</ProgressValueText>
            </HStack>
          </ProgressRoot>
          <Card.Root>
            <Card.Body gap="2">
              {/* TODO: change to this year's vision? */}
              <Card.Title mt="2">Define your long term vision</Card.Title>
              <Card.Description>
                Dare to dream without limits. Picture a future where you've
                achieved everything you’ve ever desired. Be bold and dream
                unapologetically—this is your life, your vision, your legacy.
                What passions have you followed fearlessly? What does
                fulfillment look like in your career, relationships, and
                personal growth? Envision a life where every choice you make
                aligns with your deepest values and aspirations. Let your
                imagination run free, embrace your wildest ambitions, and create
                a vision that excites and motivates you every day. Dream as if
                failure isn’t an option, and let your boldness pave the way.
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
                <GoalDescription open={detailsOpen} onToggle={toggleDetails} />
              </Card.Description>
              {/* TODO: Goals section */}
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
          <div className="grid gap-4 md:grid-cols-3">
            <Card.Root className="flex flex-col items-center text-center p-6">
              <PiChartPieSlice className="h-12 w-12 mb-4 text-black" />
              <h3 className="text-xl font-bold mb-2">Track Progress</h3>
              <p className="text-muted-foreground mb-4">
                View charts and trends of your indicators to see your progress over time.
              </p>
              <Button as={NextLink} href="/indicators" colorPalette="black" className="mt-auto">
                View Indicators
              </Button>
            </Card.Root>

            <Card.Root className="flex flex-col items-center text-center p-6">
              <PiFileText className="h-12 w-12 mb-4 text-black" />
              <h3 className="text-xl font-bold mb-2">Goal Templates</h3>
              <p className="text-muted-foreground mb-4">
                Browse pre-built goal templates for common objectives and add them to your plan.
              </p>
              <Button as={NextLink} href="/templates" colorPalette="black" className="mt-auto">
                Browse Templates
              </Button>
            </Card.Root>

            <Card.Root className="flex flex-col items-center text-center p-6">
              <PiLightbulb className="h-12 w-12 mb-4 text-black" />
              <h3 className="text-xl font-bold mb-2">AI Suggestions</h3>
              <p className="text-muted-foreground mb-4">
                Get intelligent suggestions for goals, strategies, and indicators based on your plan.
              </p>
              <Button as={NextLink} href="/suggestions" colorPalette="black" className="mt-auto">
                Get Suggestions
              </Button>
            </Card.Root>
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
