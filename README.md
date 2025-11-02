# Sweet Shop Management System

A full-stack TDD kata project for managing a sweet shop inventory and sales. Built with Node.js/Express backend and Next.js frontend, using MongoDB as the database.

## Features

- **User Authentication**: Register and login with JWT token-based authentication
- **Sweet Management**: CRUD operations for sweets (Admin only)
- **Inventory Management**: Purchase sweets and restock inventory (Admin only)
- **Search & Filter**: Search sweets by name, category, or price range
- **Responsive UI**: Modern, mobile-friendly interface built with Tailwind CSS

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- Express Validator for input validation

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Axios for API calls

## Project Structure

```
IncubyteAssignment/
├── backend/
│   ├── src/
│   │   ├── models/         # MongoDB models (User, Sweet)
│   │   ├── routes/         # API routes (auth, sweets, inventory)
│   │   ├── middleware/     # Authentication middleware
│   │   ├── __tests__/      # Test files
│   │   └── server.ts       # Express server setup
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── app/                # Next.js app directory
│   │   ├── login/          # Login page
│   │   ├── register/       # Registration page
│   │   └── dashboard/      # Main dashboard
│   ├── components/         # React components
│   ├── utils/              # Utility functions (auth, API)
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sweet-shop
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

The backend API will be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be running on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Sweets (Protected)
- `GET /api/sweets` - Get all sweets
- `GET /api/sweets/:id` - Get a single sweet
- `GET /api/sweets/search` - Search sweets (query params: name, category, minPrice, maxPrice)
- `POST /api/sweets` - Add a new sweet (Admin only)
- `PUT /api/sweets/:id` - Update a sweet (Admin only)
- `DELETE /api/sweets/:id` - Delete a sweet (Admin only)

### Inventory (Protected)
- `POST /api/sweets/:id/purchase` - Purchase a sweet (decreases quantity)
- `POST /api/sweets/:id/restock` - Restock a sweet (Admin only, increases quantity)

### Authentication Header
All protected endpoints require the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Running Tests

### Backend Tests
```bash
cd backend
npm test
```

### Test-Driven Development (TDD)

This project follows the **Red-Green-Refactor** TDD cycle:

1. **🔴 RED**: Write failing tests first
2. **🟢 GREEN**: Implement minimal code to pass tests
3. **🔵 REFACTOR**: Improve code quality while keeping tests passing

See `TDD_GUIDE.md` for detailed TDD workflow and best practices.

### Test Coverage
- Authentication endpoints: Full coverage
- Sweet management: Full coverage
- Inventory operations: Full coverage

Run tests with coverage:
```bash
cd backend
npm test -- --coverage
```

## Git Workflow & Version Control

This project follows Git best practices with clear commit messages and AI co-author attribution.

### Commit Message Format

All commits follow this format:
```
<type>: <description>

<detailed explanation if needed>

Co-authored-by: Cursor AI <auto@cursor.com>
```

### Commit Types
- `test:` - Adding or modifying tests (RED phase)
- `feat:` - New feature implementation (GREEN phase)
- `refactor:` - Code improvements (REFACTOR phase)
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `chore:` - Build/config changes

### AI Co-Author Attribution

Every commit using AI assistance includes:
```
Co-authored-by: Cursor AI <auto@cursor.com>
```

This ensures transparency about AI tool usage in the development process.

### Setting Up TDD Commit History

To create a proper TDD commit history:
```bash
./setup-tdd-commits.sh
```

This script creates commits following the Red-Green-Refactor pattern with proper AI attribution.

## Default Admin User

To create an admin user, you can either:
1. Manually set the `role` field to `'admin'` in MongoDB
2. Or register a user and update it in the database:
```javascript
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Browse Sweets**: View all available sweets on the dashboard
3. **Search**: Use the search bar to filter sweets by name, category, or price
4. **Purchase**: Click the "Purchase" button on any sweet (disabled if out of stock)
5. **Admin Functions** (Admin users only):
   - Click "Show Admin Panel" to add new sweets
   - Use Edit/Restock/Delete buttons on sweet cards to manage inventory

## Development

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

## My AI Usage

This project was developed with the assistance of AI tools to enhance productivity, code quality, and problem-solving capabilities.

### AI Tools Used

- **Cursor AI (Auto)** - Primary AI coding assistant integrated into the development environment
- **AI-assisted code generation and debugging** - Used throughout the development lifecycle

### How AI Was Used

#### 1. **Project Structure and Architecture Design**
   - Used AI to brainstorm and design the initial project structure
   - Collaborated on RESTful API endpoint design and naming conventions
   - Discussed database schema design (User model, Sweet model, Order model)

#### 2. **Backend Development**
   - **API Routes**: AI helped generate Express route handlers for authentication, sweets management, inventory operations, and order processing
   - **Authentication Middleware**: Collaborated on implementing JWT-based authentication and admin role verification
   - **Input Validation**: Used AI to set up express-validator rules for all endpoints
   - **Error Handling**: AI assisted in creating consistent error response patterns
   - **File Upload**: Implemented Multer for image uploads with AI guidance on configuration and security

#### 3. **Frontend Development**
   - **Component Architecture**: AI helped design React component structure (AdminPanel, SweetCard, CartPanel, OrdersPanel)
   - **State Management**: Collaborated on implementing shopping cart functionality using local storage and cookies
   - **UI/UX Enhancements**: 
     - Used AI to create responsive, modern login/register pages with proper form validation
     - Implemented password visibility toggles and real-time validation feedback
     - Designed sliding panel components for cart and orders
   - **Styling**: AI assisted with Tailwind CSS configurations, custom color palettes, and responsive design patterns
   - **Client-side Routing**: Implemented Next.js navigation and route protection with AI guidance

#### 4. **Feature Implementation**
   - **Shopping Cart System**: AI helped design and implement the complete cart functionality with add/remove/update operations
   - **Order Management**: Collaborated on creating order history with backend API integration
   - **Search Functionality**: Implemented search and filter features with AI assistance
   - **Image Upload**: Developed file upload feature with preview and validation
   - **Password Reset Flow**: Created complete forgot password functionality with token generation and validation

#### 5. **Bug Fixes and Problem Solving**
   - **EADDRINUSE Error**: AI helped diagnose and fix port conflict issues
   - **Token Authentication**: Fixed token retrieval from cookies vs localStorage mismatch
   - **Form Validation**: Resolved validation errors for imageUrl with localhost URLs
   - **TypeScript Errors**: AI assisted in resolving type mismatches and interface definitions
   - **CSS Issues**: Fixed input text visibility and styling inconsistencies

#### 6. **Code Quality and Best Practices**
   - **Error Handling**: AI suggested improvements for comprehensive error handling patterns
   - **Security**: Implemented password hashing, JWT tokens, and input sanitization with AI guidance
   - **Code Organization**: Maintained clean code structure with AI-assisted refactoring
   - **Accessibility**: Added ARIA labels and keyboard navigation with AI suggestions

#### 7. **UI/UX Design**
   - **Theme Development**: Collaborated on creating "Chashni" brand identity with Indian mithai shop theme
   - **Visual Design**: AI helped design elegant backgrounds, gradient effects, and decorative elements
   - **Responsive Design**: Ensured mobile-friendly layouts with AI assistance
   - **Animation**: Implemented smooth transitions and animations for better user experience

#### 8. **Documentation and Testing**
   - **Code Comments**: AI helped generate clear, meaningful comments
   - **API Documentation**: Assisted in documenting endpoint structures and request/response formats

### Reflection on AI Impact

#### Positive Impacts

1. **Accelerated Development**: AI significantly sped up the development process by:
   - Generating boilerplate code for routes, models, and components
   - Providing instant solutions to common problems (authentication patterns, form handling)
   - Suggesting best practices without extensive research time

2. **Enhanced Code Quality**:
   - AI suggestions helped maintain consistent coding patterns across the project
   - Caught potential security issues early (token handling, input validation)
   - Improved error handling and user feedback mechanisms

3. **Learning and Problem Solving**:
   - AI served as an interactive learning tool, explaining concepts while coding
   - Provided alternative approaches and solutions when stuck
   - Helped understand complex integration patterns (file uploads, authentication flows)

4. **Design and UX**:
   - AI assisted in creating professional, modern UI designs
   - Suggested accessibility improvements and responsive design patterns
   - Helped implement smooth animations and transitions

5. **Debugging Efficiency**:
   - Rapid diagnosis of errors (token issues, port conflicts, validation problems)
   - Suggested fixes with explanations, improving understanding
   - Reduced time spent on troubleshooting

#### Challenges and Learnings

1. **Verification Required**: Not all AI suggestions were perfect; I learned to:
   - Verify AI-generated code before implementation
   - Understand the code rather than blindly accepting suggestions
   - Test thoroughly even with AI assistance

2. **Context Awareness**: 
   - Sometimes needed multiple iterations to get the right solution
   - Had to provide clear context about project requirements and constraints
   - Learned to ask more specific questions for better results

3. **Balance Between AI and Understanding**:
   - Used AI as a tool to enhance productivity, not replace learning
   - Ensured I understood the code before implementing it
   - Maintained ownership and understanding of the entire codebase

#### Overall Assessment

AI tools were instrumental in completing this project efficiently while maintaining high code quality. The collaborative approach between human judgment and AI assistance resulted in:
- Faster feature implementation
- Better code organization and consistency
- Enhanced user experience with modern UI/UX
- Comprehensive error handling and security measures
- Professional documentation and project structure

The AI acted as a powerful pair-programming partner, helping navigate complex integrations, suggesting best practices, and accelerating development without compromising code quality or understanding.

## License

ISC

