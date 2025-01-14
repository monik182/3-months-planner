# Auth & Persistency
- Create auth provider ✅
- Save data to DB
  - clean up interfaces ✅
  - include user id to the models ✅
  - create prisma schema ✅
  - create db manager ✅
  - Refactor DB ✅ 
  - improve BE error responses
  - Create queries to add plan_id to other tables ✅
  - Rename tables? ❌
- BE integration
  - integrate db + backend + frontend - Create plan ✅
  - Add frequency to goal model? 🟠
  - Refactor CREATE PLAN 🟠
  - integrate db + backend + frontend - Track plan
  - Create page auth
  - improve api/plan/create performance [WIP]
  - add cache?
- FE Fixes
  - Refactor dashboard -> see mockup references
  - save to db after each step 🟠
  - add local persistency
  - Add de/select all weeks button
  - Centralize types (interfaces / classes) ✅
  - Refactor usePlan hook, is still necessary?
  - Handle loading/error states of requests - react query?
  - create a model folder? ❌


# Release
- Deploy


# Extra 
Validations:
- Validate current step is completed ✅

UI:
- Improve user feedback messages/components

Responsive capabilities

Complimentary Pages:
 - Vision & 3-year Milestone
 - Goals & Strategies editor
 - Past years

AI:
- 3-year milestone summary generator
- Goals from vision generator
- Strategies from vision goal
- Indicators from vision goal

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