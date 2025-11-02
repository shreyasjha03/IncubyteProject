# Test-Driven Development (TDD) Guide

This project follows the **Red-Green-Refactor** TDD cycle to ensure high-quality, well-tested code.

## TDD Cycle Explained

### 🔴 RED: Write a Failing Test
- Write a test that defines the desired behavior
- Run the test to confirm it fails (RED)
- Commit with message: `test: Add test for [feature]`

### 🟢 GREEN: Make the Test Pass
- Implement the minimal code to make the test pass
- Run the test to confirm it passes (GREEN)
- Commit with message: `feat: Implement [feature] to pass tests`

### 🔵 REFACTOR: Improve the Code
- Improve code quality without changing behavior
- Ensure all tests still pass
- Commit with message: `refactor: Improve [feature] implementation`

## AI Co-Author Attribution

Every commit that uses AI assistance must include a co-author trailer:

```bash
git commit -m "feat: Implement user registration endpoint

Used an AI assistant to generate the initial boilerplate for the controller and service, then manually added validation logic.

Co-authored-by: Cursor AI <auto@cursor.com>"
```

### Format:
1. Commit message describing what was done
2. Two empty lines
3. Co-author trailer: `Co-authored-by: Tool Name <email>`

## Example TDD Workflow

### Example: Adding a New Endpoint

#### 1. RED - Write Failing Test
```bash
# Write test in backend/src/__tests__/feature.test.ts
git add backend/src/__tests__/feature.test.ts
git commit -m "test: Add test for new feature endpoint (RED)

Write failing tests for POST /api/feature endpoint.
Tests verify request validation and response format.

Co-authored-by: Cursor AI <auto@cursor.com>"
```

#### 2. GREEN - Implement Feature
```bash
# Implement minimal code to pass tests
git add backend/src/routes/feature.routes.ts
git commit -m "feat: Implement feature endpoint (GREEN)

Implement POST /api/feature to make tests pass.
Added validation and error handling.

Co-authored-by: Cursor AI <auto@cursor.com>"
```

#### 3. REFACTOR - Improve Code
```bash
# Improve code structure
git add backend/src/routes/feature.routes.ts backend/src/services/feature.service.ts
git commit -m "refactor: Extract feature logic to service layer

Move business logic from routes to service.
Improve error handling and code organization.

Co-authored-by: Cursor AI <auto@cursor.com>"
```

## Commit Message Conventions

### Test Commits (RED)
- Start with `test:` prefix
- Describe what is being tested
- Mention "RED" or "failing test" in message

### Feature Commits (GREEN)
- Start with `feat:` prefix
- Describe what was implemented
- Mention "GREEN" or "make test pass"

### Refactor Commits
- Start with `refactor:` prefix
- Describe improvements made
- Ensure no behavior changes

### Other Commit Types
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `chore:` - Build/config changes
- `style:` - Code style changes (formatting)

## Viewing Commit History

```bash
# View commit history with graph
git log --oneline --graph

# View detailed commit history
git log --pretty=format:"%h - %an, %ar : %s" --graph

# View commits with co-authors
git log --pretty=format:"%h - %s%n%b" | grep -A 2 "Co-authored"
```

## Running Tests

### Backend Tests
```bash
cd backend
npm test
```

### Watch Mode (for TDD)
```bash
cd backend
npm test -- --watch
```

## Best Practices

1. **Always write tests first** - This ensures you're testing behavior, not implementation
2. **Keep tests simple** - One assertion per test when possible
3. **Make minimal changes** - Only implement what's needed to pass the test
4. **Refactor confidently** - Tests give you confidence to improve code
5. **Commit frequently** - Small, focused commits show clear progression
6. **Always attribute AI** - Be transparent about AI tool usage

## Project Test Coverage Goals

- **Backend**: Aim for >80% coverage on business logic
- **Critical paths**: 100% coverage (auth, payments, etc.)
- **Frontend**: Focus on component integration tests

## Current Test Files

- `backend/src/__tests__/auth.test.ts` - Authentication tests
- `backend/src/__tests__/sweets.test.ts` - Sweet management tests
- `backend/src/__tests__/inventory.test.ts` - Inventory operation tests

## Viewing Red-Green-Refactor Pattern in Commit History

### 🌐 On GitHub (Easiest Way)

1. **Go to your repository:**
   https://github.com/shreyasjha03/IncubyteProject

2. **Click on "commits" or view the commit history**

3. **Look for these commit patterns:**

#### Authentication TDD Cycle:
- 🔴 **RED**: `test: Add authentication tests (RED)` - Commit `b26b23d`
- 🟢 **GREEN**: `feat: Implement user authentication (GREEN)` - Commit `c2dce13`
- 🔵 **REFACTOR**: `refactor: Improve authentication code structure` - Commit `4e438e4`

#### Sweets Management TDD Cycle:
- 🔴 **RED**: `test: Add sweets CRUD tests (RED)` - Commit `65ccbb5`
- 🟢 **GREEN**: `feat: Implement sweets management endpoints (GREEN)` - Commit `1d3e10c`
- 🔵 **REFACTOR**: `refactor: Improve sweets route organization` - Commit `d6b3359`

#### Inventory Management TDD Cycle:
- 🔴 **RED**: `test: Add inventory management tests (RED)` - Commit `4520f1b`
- 🟢 **GREEN**: `feat: Implement inventory management (GREEN)` - Commit `8a91d51`
- 🔵 **REFACTOR**: `refactor: Improve inventory operations` - Commit `4bddfb7`

### 💻 Using Git Commands Locally

#### View TDD Pattern Commits Only
```bash
cd /Users/shreyasjha/Desktop/IncubyteAssignment
git log --oneline | grep -E "(RED|GREEN|refactor)"
```

#### View Detailed TDD Commits
```bash
git log --pretty=format:"%h - %s%n%b" | grep -A 5 -E "(RED|GREEN|refactor)" | head -40
```

#### View Graph with TDD Pattern
```bash
git log --oneline --graph -25
```

This shows:
```
* 4bddfb7 refactor: Improve inventory operations
* 8a91d51 feat: Implement inventory management (GREEN)
* 4520f1b test: Add inventory management tests (RED)
* d6b3359 refactor: Improve sweets route organization
* 1d3e10c feat: Implement sweets management endpoints (GREEN)
* 65ccbb5 test: Add sweets CRUD tests (RED)
* 4e438e4 refactor: Improve authentication code structure
* c2dce13 feat: Implement user authentication (GREEN)
* b26b23d test: Add authentication tests (RED)
```

#### View All Commits with Details
```bash
git log --oneline -25
```

### 📊 Visual TDD Pattern Summary

The pattern repeats for each feature:

1. **🔴 RED Phase**: Write failing test
   - Commit message: `test: Add [feature] tests (RED)`
   - Shows: Tests written before implementation

2. **🟢 GREEN Phase**: Make test pass
   - Commit message: `feat: Implement [feature] (GREEN)`
   - Shows: Minimal implementation to pass tests

3. **🔵 REFACTOR Phase**: Improve code
   - Commit message: `refactor: Improve [feature] implementation`
   - Shows: Code improvements without changing behavior

### 🔍 Quick View Commands

#### Count TDD Cycles
```bash
git log --oneline | grep -c "RED\|GREEN\|refactor"
```

#### See Authentication TDD Cycle
```bash
git log --oneline --all --grep="authentication" | head -5
```

#### View Commit Details with Co-Authors
```bash
git log --pretty=format:"%h - %s%n%b%n" | grep -A 2 "Co-authored"
```

### 📝 GitHub UI Tips

On GitHub, you can:
1. Click on any commit hash (e.g., `b26b23d`) to see full details
2. View commit messages - they clearly show (RED), (GREEN), or refactor
3. Check co-author attribution - every commit has "Co-authored-by: Cursor AI"
4. Use the search/filter to find specific patterns

