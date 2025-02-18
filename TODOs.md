# Pre release
- Only allow up to 10 users to test
- Test y prod db
- Test welcome page ✅
- Save to db unique user ids ✅
- Allow anonymous testing ✅
- Create feedback box ✅
- Quitarle el autocomplete a todos los campos ✅
- Create wait list section -> Wire up with db ✅


# Release
- Deploy


# Post Release
- Upload screenshots for feedback
- Make indicator creation a 1 liner + change the icon and button color ✅
- Improve the goals/strategies/indicator creation forms
- Improve HOME page with steps and everything
- Improve the plan view and colors and reuse component in step4
- Delayed sync
- Pricing page ❓
- Stripe integration ❓


# Auth & Persistency P3
- BE integration
  - improve BE error responses
  - Refactor api/plan/history performance
  - add cache?
  - Refactor api/plan/create ✅
  - only save on click ❓
- FE Improvements
  - Create route guard
  - Create plan read only view ✅
- Auth Refactor
  - Replace Auth0 with Supabase auth 🚨


# Extra 
AI:
- 3-year milestone summary generator
- Goals from vision generator
- Strategies from vision goal
- Indicators from vision goal

Validations:
- Validate current step is completed ✅

UI:
- Improve user feedback messages/components

Responsive capabilities

Complimentary Pages:
 - Vision & 3-year Milestone
 - Goals & Strategies editor
 - Past years

For each goal reflect on:
- List commitment costs for each goal
- List hidden intentions
- what actions with you struggle with?
- what would you do to overcome these struggles?

Time blocking:
- Sunday or Monday first time:
  - Score previous week
  - Plan next week
  - Participate in WAM
- Strategic block: once a week, 3 hours -> high payoff activities
- Buffer blocks: 1 or 2 daily, 30 min - 1 hour -> low level activities
- Breakout blocks: once a month, 3 hours
- Week 13: Celebrate last year achievements/last opportunity to close last year's goals/**Plan next year**

Print:
- Create printable templates for the weekly score tracking


# ####################
# DONE
# ####################


# Wizard
1. Long term vision ✅
2. 3-year vision ✅
3. Create measurable goals ✅
4. Prioritize goals ✅
5. Select up to 3 goals ✅
6. Create tactics for each goal with their due date ✅
7. Set lead and lag indicators ✅
8. Select start date ✅


# Planning
- Weekly scoring
  - Show current week number ✅
  - Show week slider (research creative way to show a cool "End of Year") ✅
  - Show week start and end dates ✅
  - Show week completion rate ✅
  - Show graph to compare weeks historic value ❌
  - Show goal card  ✅
    - Header:  ✅
      - Goal ✅
      - Show completion % by goal ✅
    - Body: 
      - Strategies list (check list) with its due date ✅
      - Mark overdue goals ✅
      - Indicators components list ✅
        - Show input to track current indicator value ✅
        - Show graph to compare indicator historic value? ✅


with persistance will come success

# Auth & Persistency P1
- Create auth provider ✅
- Save data to DB
  - clean up interfaces ✅
  - include user id to the models ✅
  - create prisma schema ✅
  - create db manager ✅
  - Refactor DB ✅ 
  - Create queries to add plan_id to other tables ✅
  - Rename tables? ❌
  - Add frequency to goal model? ✅
- BE integration
  - integrate db + backend + frontend - Create plan ✅
- FE Fixes
  - save to db after each step ✅
  - Refactor CREATE PLAN flow -> add a welcome page to plan + confirm button ✅
  - Add de/select all weeks button ✅
  - Centralize types (interfaces / classes) ✅
  - Refactor usePlan hook, is still necessary? - Removed ✅ 
  - Handle loading/error states of requests - react query? ✅
  - create a model folder? Not needed, using prisma generated types ❌

  # Auth & Persistency For release
- FE Fixes
  - Something weird with creating/updating/loading strategy ✅
  - Create home page ✅
  - Remove is not removing ✅
  - Fix scroll on plan/view ✅
  - Add local persistency ✅
  - Refactor dashboard -> see mockup references ✅
- BE integration
  - integrate db + backend + frontend - Track plan ✅
