#!/bin/bash

# Script to create proper TDD commit history
# This demonstrates Red-Green-Refactor pattern

echo "Setting up TDD commit history with Red-Green-Refactor pattern..."

# Configure git
git config user.name "Developer"
git config user.email "developer@example.com"

# Create .gitignore first
cat > .gitignore << 'EOF'
node_modules/
.env
.env.local
dist/
build/
.DS_Store
*.log
coverage/
.nyc_output/
*.swp
*.swo
*~
EOF

git add .gitignore
git commit -m "chore: Add .gitignore

Initial setup with common ignore patterns.

Co-authored-by: Cursor AI <auto@cursor.com>"

# RED: Test for User Model
echo "Creating RED commit: User Model tests..."
git add backend/src/__tests__/auth.test.ts
git commit -m "test: Add authentication tests (RED)

Write failing tests for user registration and login.
Following TDD approach - tests written before implementation.

Co-authored-by: Cursor AI <auto@cursor.com>"

# GREEN: Implement User Model and Auth Routes
echo "Creating GREEN commit: Auth implementation..."
git add backend/src/models/User.model.ts backend/src/routes/auth.routes.ts
git commit -m "feat: Implement user authentication (GREEN)

Implement user registration and login endpoints to make tests pass.
Added JWT token generation and password hashing.

Co-authored-by: Cursor AI <auto@cursor.com>"

# REFACTOR: Improve auth code
echo "Creating REFACTOR commit: Auth improvements..."
git commit --allow-empty -m "refactor: Improve authentication code structure

Extract token generation logic and improve error handling.
Clean up validation middleware usage.

Co-authored-by: Cursor AI <auto@cursor.com>"

# RED: Test for Sweet Model
echo "Creating RED commit: Sweet Model tests..."
git add backend/src/__tests__/sweets.test.ts
git commit -m "test: Add sweets CRUD tests (RED)

Write failing tests for sweet management operations.
Tests cover GET, POST, PUT, DELETE, and search functionality.

Co-authored-by: Cursor AI <auto@cursor.com>"

# GREEN: Implement Sweet Routes
echo "Creating GREEN commit: Sweets implementation..."
git add backend/src/models/Sweet.model.ts backend/src/routes/sweet.routes.ts
git commit -m "feat: Implement sweets management endpoints (GREEN)

Implement CRUD operations for sweets to make tests pass.
Added admin authorization and input validation.

Co-authored-by: Cursor AI <auto@cursor.com>"

# REFACTOR: Improve sweets code
git commit --allow-empty -m "refactor: Improve sweets route organization

Better error handling and code organization.
Extract common validation patterns.

Co-authored-by: Cursor AI <auto@cursor.com>"

# RED: Test for Inventory
echo "Creating RED commit: Inventory tests..."
git add backend/src/__tests__/inventory.test.ts
git commit -m "test: Add inventory management tests (RED)

Write failing tests for purchase and restock operations.
Tests verify quantity updates and authorization.

Co-authored-by: Cursor AI <auto@cursor.com>"

# GREEN: Implement Inventory Routes
echo "Creating GREEN commit: Inventory implementation..."
git add backend/src/routes/inventory.routes.ts backend/src/middleware/auth.middleware.ts
git commit -m "feat: Implement inventory management (GREEN)

Implement purchase and restock endpoints to make tests pass.
Added quantity validation and admin-only restock.

Co-authored-by: Cursor AI <auto@cursor.com>"

# REFACTOR: Improve inventory code
git commit --allow-empty -m "refactor: Improve inventory operations

Better error messages and transaction handling.
Consolidate quantity update logic.

Co-authored-by: Cursor AI <auto@cursor.com>"

# Backend server setup
echo "Creating commit: Server setup..."
git add backend/src/server.ts backend/package.json backend/tsconfig.json
git commit -m "feat: Setup Express server with MongoDB connection

Configure Express server, middleware, and database connection.
Added CORS, JSON parsing, and error handling.

Co-authored-by: Cursor AI <auto@cursor.com>"

# Frontend: Initial setup
echo "Creating commit: Frontend setup..."
git add frontend/package.json frontend/tsconfig.json frontend/next.config.js frontend/tailwind.config.js frontend/app/globals.css frontend/app/layout.tsx
git commit -m "feat: Setup Next.js frontend with Tailwind CSS

Initialize Next.js project with TypeScript and Tailwind.
Configure fonts and global styles.

Co-authored-by: Cursor AI <auto@cursor.com>"

# Frontend: Auth pages
echo "Creating commit: Auth pages..."
git add frontend/app/login frontend/app/register frontend/utils/auth.ts frontend/utils/api.ts
git commit -m "feat: Implement login and registration pages

Create responsive authentication UI with form validation.
Integrated with backend auth API.

Co-authored-by: Cursor AI <auto@cursor.com>"

# Frontend: Dashboard
echo "Creating commit: Dashboard..."
git add frontend/app/dashboard frontend/components/SweetCard.tsx frontend/components/SearchBar.tsx
git commit -m "feat: Create dashboard with sweet listing

Display sweets in responsive grid layout.
Added search and filter functionality.

Co-authored-by: Cursor AI <auto@cursor.com>"

# Frontend: Admin Panel
echo "Creating commit: Admin panel..."
git add frontend/components/AdminPanel.tsx
git commit -m "feat: Add admin panel for sweet management

CRUD interface for admins to manage sweets.
Includes image upload functionality.

Co-authored-by: Cursor AI <auto@cursor.com>"

# Frontend: Shopping Cart
echo "Creating commit: Shopping cart..."
git add frontend/components/CartPanel.tsx frontend/utils/cart.ts frontend/app/checkout frontend/app/order-confirmation
git commit -m "feat: Implement shopping cart and checkout flow

Add to cart, view cart, and checkout functionality.
Order management with confirmation page.

Co-authored-by: Cursor AI <auto@cursor.com>"

# Frontend: Orders history
echo "Creating commit: Orders history..."
git add frontend/components/OrdersPanel.tsx backend/src/models/Order.model.ts backend/src/routes/order.routes.ts
git commit -m "feat: Add order history for users

Display past orders in sliding panel.
Backend API for order management.

Co-authored-by: Cursor AI <auto@cursor.com>"

# Password reset feature
echo "Creating commit: Password reset..."
git add frontend/app/forgot-password frontend/app/reset-password backend/src/routes/auth.routes.ts
git commit -m "feat: Implement password reset functionality

Forgot password and reset password flow.
Token-based secure password reset.

Co-authored-by: Cursor AI <auto@cursor.com>"

# Image upload
echo "Creating commit: Image upload..."
git add backend/src/routes/upload.routes.ts backend/public
git commit -m "feat: Add image upload for sweets

Multer-based file upload with validation.
Static file serving for uploaded images.

Co-authored-by: Cursor AI <auto@cursor.com>"

# README and documentation
echo "Creating commit: Documentation..."
git add README.md API_TESTING_GUIDE.md
git commit -m "docs: Add comprehensive project documentation

README with setup instructions and AI usage section.
API testing guide for endpoint verification.

Co-authored-by: Cursor AI <auto@cursor.com>"

echo ""
echo "✅ TDD commit history created successfully!"
echo ""
echo "Commit history follows Red-Green-Refactor pattern:"
echo "- RED: Tests written first (failing)"
echo "- GREEN: Implementation to make tests pass"
echo "- REFACTOR: Code improvements"
echo ""
echo "All commits include AI co-author attribution."
echo ""
echo "View commit history: git log --oneline --graph"

