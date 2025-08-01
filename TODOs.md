# BUG
- After plan creation app is not redirecting to /plan, even if forced
- Cannot recover password 


# Post Release

- Integrate templates
- Improve HOME page with demo video, wishlist and users count
- Add reflection section for each week
- Unify colors


# Complimentary Pages:
- Past years
- Create your own template
- Vision & 3-year Milestone


# Print: 🔥 (?) - Not sure about this
- Create printable templates for the weekly score tracking

























# Auth & Persistency P4

- Optimize dashboard get requests
  - Improve cache use
  - Remove indexed db code, not needed?

- Fix cross browser sync - when login in another browser the data is not synced [WIP]
  * Haven't been able to reproduce it consistently, but it's happening
- Simplify BE
- Fix "random" redirect to plan/new ✅
- Create all 12 weeks for each strategy history ✅
- Remove auth0 code ✅
- Fix edit strategy sequences ❓ (not sure if already fixed)







- Fix dashboard frequency bug [Don't remember]❓
- Create VIP role [is it needed?]❓

- Upload screenshots for feedback
- Test app theme dark
  - plan overview is unreadable in dark mode (related to next item)
- FF for enable/disable remote sync
- Pricing page ❓ (self deployed)
- Stripe integration ❓
- create reddit post  ✅
- limit db writes ✅
- Create test DB replica ✅
- Make indicator creation a 1 liner + change the icon and button color ✅


# Auth & Persistency P3
- BE integration
  - improve BE error responses
  - Refactor api/plan/history performance
  - add cache? ✅
  - Refactor api/plan/create ✅
  - only save on click ❓
- FE Improvements
  - Create plan history page
  - Unify services - structure is repeated ❌
  - Unify actions - structure is repeated ❌
  - Create overview progress page ✅ - Can be improved
  - Create route guard ✅
  - Create plan read only view ✅


# Extra 
AI: 🔥
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


# ################################################################################################################################################################
# DONE
# ################################################################################################################################################################


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

# Pre release
- Test y prod db ✅
- Only allow up to 10 users to test ✅ (Fixed with limited invites)
- Test welcome page ✅
- Save to db unique user ids ✅
- Allow anonymous testing ✅
- Create feedback box ✅
- Quitarle el autocomplete a todos los campos ✅
- Create wait list section -> Wire up with db ✅

# Release
- Deploy ✅

# Post Release MOST IMPORTANT - Deadline Feb 21
- Test app responsive ✅
- invite guests flow ✅
- Auth for prod ✅ [Not needed yet]
- FIX CREATE PLAN - duplicate error 🚨 ✅
- FIX CREATE PLAN 🚨 ✅
- disable dark mode ✅

- Clear on logout ✅
- Store on login ✅
- Solve delete item delay ✅
- Solve enable sync getByPlanId/undefined ❓ ✅
- Test new process queue implementation 🔥✅
- On the edit, create the bulk with the entity creation ✅
- Only push to DB strategies and indicators with existing goals ✅
- Enable edit plan ✅
- Save user data to DB on signup - Create user put ✅
- Merge authenticated user and stored user ✅
- Merge queued syncs  ✅
- Sync guest user data to cloud ✅
- Delayed sync ✅

- Auth Refactor [WIP]
  - Simplify Auth and Account providers
  - Replace Auth0 with Supabase auth 🚨 ✅
  - Fix new email/password user flow - register to user db ✅
- 🚨 FIX Sync/login Bug 🚨 ✅
- Test Claude implementation ❌

# Auth integration
- Create Trigger in Supabase to create user on signup ✅
- Clean up non needed sync code - auth0 related ✅
- Remove AuthContext (?) ✅
- Remove all redirect logic and validate the middleware is handling it correctly ✅
- Remove all prisma related code ❌

# URGENT BUGS
- Login issues? - Joel's email - CANNOT REPRODUCE  ❌
- Duplicated goals? - Joel's email - CANNOT REPRODUCE ❌
- Fix: when a strategy is created, let's say frequency 3, the user checks one of the checkboxes in the dashboard and the boolean array is created with length frequency, but then the user updates it, let's say to 5, the checkboxes are still 3. This must be addressed in the update logic. ✅

# Bug
- strategies and goals are reordering randomly - avoid that. ✅

# Post Release
- Refactor dashboard ✅
- Integrate charts page ✅
- In strategies, create 7 checkboxes, one for each day, and let the user select the days they worked on it ✅
- Progress in new plan-v2 is not wired to real results. ❌ [Will remove it]
- Integrate AI suggestions
- Improve the plan view and colors and reuse component in step4 ✅
- Improve the goals/strategies/indicator creation forms ✅
- Add password login? Or another auth provider? ❌ (Not needed, Already had email/password)
- Goals & Strategies editor ✅

# BUG
- Fix google button randomly not appear ✅
- Cannot create new users via google on prod ✅
