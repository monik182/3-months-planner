export interface GoalTemplate {
  id: string;
  category: string;
  title: string;
  description: string;
  strategies: {
    content: string;
    frequency: number;
  }[];
  indicators: {
    content: string;
    metric: string;
    initialValue: number;
    goalValue: number;
  }[];
}

export const GOAL_TEMPLATES: GoalTemplate[] = [
  {
    id: "health-1",
    category: "health",
    title: "Regular Exercise Routine",
    description: "Establish a consistent exercise routine to improve physical fitness and energy levels.",
    strategies: [
      { content: "Complete a 30-minute cardio workout", frequency: 3 },
      { content: "Strength training session", frequency: 2 },
      { content: "Take a 45-minute walk", frequency: 5 }
    ],
    indicators: [
      { content: "Weekly workout sessions completed", metric: "sessions", initialValue: 0, goalValue: 10 },
      { content: "Push-up capacity", metric: "reps", initialValue: 10, goalValue: 30 },
      { content: "Running distance without stopping", metric: "km", initialValue: 1, goalValue: 5 }
    ],
  },
  {
    id: "health-2",
    category: "health",
    title: "Improve Sleep Quality",
    description: "Develop better sleep habits to enhance overall health and daily performance.",
    strategies: [
      { content: "Go to bed by 10:00 PM", frequency: 5 },
      { content: "No screen time 1 hour before bed", frequency: 7 },
      { content: "Practice 10-minute bedtime meditation", frequency: 4 }
    ],
    indicators: [
      { content: "Average hours of sleep per night", metric: "hours", initialValue: 6, goalValue: 8 },
      { content: "Sleep quality rating (1-10)", metric: "rating", initialValue: 5, goalValue: 8 },
      { content: "Days waking up refreshed", metric: "days/week", initialValue: 2, goalValue: 6 }
    ],
  },
  {
    id: "career-1",
    category: "career",
    title: "Professional Skill Development",
    description: "Enhance specific skills to advance your career and increase value in your field.",
    strategies: [
      { content: "Complete one online course module", frequency: 3 },
      { content: "Read industry publications", frequency: 2 },
      { content: "Practice new skills through practical projects", frequency: 2 }
    ],
    indicators: [
      { content: "Courses completed", metric: "courses", initialValue: 0, goalValue: 3 },
      { content: "Hours spent practicing skills", metric: "hours", initialValue: 0, goalValue: 60 },
      { content: "Professional connections made", metric: "connections", initialValue: 0, goalValue: 10 }
    ],
  },
  {
    id: "career-2",
    category: "career",
    title: "Side Business Launch",
    description: "Develop and launch a side business or freelance service.",
    strategies: [
      { content: "Work on business plan and market research", frequency: 2 },
      { content: "Develop products or service offerings", frequency: 3 },
      { content: "Marketing and outreach activities", frequency: 2 }
    ],
    indicators: [
      { content: "Completed business framework components", metric: "components", initialValue: 0, goalValue: 5 },
      { content: "Potential clients contacted", metric: "clients", initialValue: 0, goalValue: 20 },
      { content: "Revenue generated", metric: "dollars", initialValue: 0, goalValue: 1000 }
    ],
  },
  {
    id: "personal-1",
    category: "personal",
    title: "Mindfulness Practice",
    description: "Develop a consistent mindfulness practice to reduce stress and improve mental clarity.",
    strategies: [
      { content: "Morning meditation session", frequency: 5 },
      { content: "Mindful breathing breaks during day", frequency: 7 },
      { content: "Gratitude journaling", frequency: 3 }
    ],
    indicators: [
      { content: "Weekly meditation sessions", metric: "sessions", initialValue: 0, goalValue: 35 },
      { content: "Stress level rating (1-10, lower is better)", metric: "rating", initialValue: 8, goalValue: 4 },
      { content: "Days with mindfulness practice", metric: "days/week", initialValue: 1, goalValue: 7 }
    ],
  },
  {
    id: "personal-2",
    category: "personal",
    title: "Digital Detox",
    description: "Reduce screen time and create healthier digital habits.",
    strategies: [
      { content: "Phone-free morning routine", frequency: 7 },
      { content: "No social media until after noon", frequency: 5 },
      { content: "Screen-free evening hours (7-10 PM)", frequency: 4 }
    ],
    indicators: [
      { content: "Daily screen time", metric: "hours", initialValue: 6, goalValue: 3 },
      { content: "Social media checks per day", metric: "checks", initialValue: 20, goalValue: 5 },
      { content: "Days with digital boundaries maintained", metric: "days/week", initialValue: 0, goalValue: 5 }
    ],
  },
  {
    id: "creative-1",
    category: "creative",
    title: "Writing Project",
    description: "Complete a writing project, such as a short story, blog series, or book draft.",
    strategies: [
      { content: "Dedicated writing session", frequency: 5 },
      { content: "Research and planning session", frequency: 2 },
      { content: "Editing and revisions", frequency: 2 }
    ],
    indicators: [
      { content: "Words written", metric: "words", initialValue: 0, goalValue: 30000 },
      { content: "Chapters/sections completed", metric: "chapters", initialValue: 0, goalValue: 12 },
      { content: "Days with writing activity", metric: "days/week", initialValue: 1, goalValue: 5 }
    ],
  },
  {
    id: "education-1",
    category: "education",
    title: "Language Learning",
    description: "Develop basic fluency in a new language or improve existing language skills.",
    strategies: [
      { content: "Language learning app session", frequency: 7 },
      { content: "Practice with native speaker or tutor", frequency: 1 },
      { content: "Watch/listen to content in target language", frequency: 3 }
    ],
    indicators: [
      { content: "New vocabulary words mastered", metric: "words", initialValue: 0, goalValue: 500 },
      { content: "Language proficiency level (1-10)", metric: "level", initialValue: 2, goalValue: 6 },
      { content: "Minutes spent practicing daily", metric: "minutes", initialValue: 10, goalValue: 45 }
    ],
  },
];