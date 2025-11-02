# API Testing & Database Access Guide

## 📊 Accessing the Database

### Using MongoDB Shell (`mongosh`)

```bash
# Connect to your database
mongosh sweet-shop

# Or with full connection string
mongosh "mongodb://localhost:27017/sweet-shop"
```

**Useful MongoDB Commands:**

```javascript
// List all collections
show collections

// View all users
db.users.find().pretty()

// View all sweets
db.sweets.find().pretty()

// Count documents
db.users.countDocuments()
db.sweets.countDocuments()

// Make yourself admin (run this!)
db.users.updateOne(
  { email: "shreyasjha16@gmail.com" },
  { $set: { role: "admin" } }
)

// Verify admin role
db.users.findOne({ email: "shreyasjha16@gmail.com" })

// Add a test sweet directly to database
db.sweets.insertOne({
  name: "Chocolate Bar",
  category: "Chocolate",
  price: 5.99,
  quantity: 10
})

// Delete all sweets (cleanup)
db.sweets.deleteMany({})
```

### Using MongoDB Compass (GUI)

1. Download from: https://www.mongodb.com/products/compass
2. Connect using: `mongodb://localhost:27017/sweet-shop`
3. Browse collections visually

---

## 🔐 Step 1: Get Authentication Token

First, you need to login and get your JWT token.

### Option A: Via Browser (Easiest)
1. Open `http://localhost:3000/login`
2. Login with your credentials
3. Open Browser DevTools (F12)
4. Go to: Application → Cookies → `http://localhost:3000`
5. Copy the `token` value

### Option B: Via API
```bash
# Login via API to get token
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "shreyasjha16@gmail.com", "password": "YOUR_PASSWORD"}'

# Response will contain the token
# Save it as TOKEN variable:
export TOKEN="your-jwt-token-here"
```

---

## ✅ Testing All API Endpoints

### Authentication Endpoints

#### 1. POST /api/auth/register
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### 2. POST /api/auth/login
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "shreyasjha16@gmail.com",
    "password": "YOUR_PASSWORD"
  }'
```

---

### Sweets Endpoints (Protected - Need Token)

#### 3. GET /api/sweets - List all sweets
```bash
curl -X GET http://localhost:5001/api/sweets \
  -H "Authorization: Bearer $TOKEN"
```

#### 4. GET /api/sweets/search - Search sweets
```bash
# Search by name
curl -X GET "http://localhost:5001/api/sweets/search?name=chocolate" \
  -H "Authorization: Bearer $TOKEN"

# Search by category
curl -X GET "http://localhost:5001/api/sweets/search?category=Candy" \
  -H "Authorization: Bearer $TOKEN"

# Search by price range
curl -X GET "http://localhost:5001/api/sweets/search?minPrice=3&maxPrice=10" \
  -H "Authorization: Bearer $TOKEN"

# Combined search
curl -X GET "http://localhost:5001/api/sweets/search?name=chocolate&category=Candy&minPrice=1&maxPrice=20" \
  -H "Authorization: Bearer $TOKEN"
```

#### 5. GET /api/sweets/:id - Get single sweet
```bash
# First, get a sweet ID from listing all sweets
curl -X GET http://localhost:5001/api/sweets \
  -H "Authorization: Bearer $TOKEN"

# Then use the _id to get details
curl -X GET "http://localhost:5001/api/sweets/SWEET_ID_HERE" \
  -H "Authorization: Bearer $TOKEN"
```

#### 6. POST /api/sweets - Add new sweet (Admin only)
```bash
curl -X POST http://localhost:5001/api/sweets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Gummy Bears",
    "category": "Candy",
    "price": 3.99,
    "quantity": 50
  }'
```

#### 7. PUT /api/sweets/:id - Update sweet (Admin only)
```bash
curl -X PUT "http://localhost:5001/api/sweets/SWEET_ID_HERE" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "price": 4.99,
    "quantity": 75
  }'
```

#### 8. DELETE /api/sweets/:id - Delete sweet (Admin only)
```bash
curl -X DELETE "http://localhost:5001/api/sweets/SWEET_ID_HERE" \
  -H "Authorization: Bearer $TOKEN"
```

---

### Inventory Endpoints (Protected)

#### 9. POST /api/sweets/:id/purchase - Purchase a sweet
```bash
# Purchase 1 unit (default)
curl -X POST "http://localhost:5001/api/sweets/SWEET_ID_HERE/purchase" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"quantity": 1}'

# Purchase multiple units
curl -X POST "http://localhost:5001/api/sweets/SWEET_ID_HERE/purchase" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"quantity": 5}'
```

#### 10. POST /api/sweets/:id/restock - Restock sweet (Admin only)
```bash
curl -X POST "http://localhost:5001/api/sweets/SWEET_ID_HERE/restock" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"quantity": 100}'
```

---

## 🚀 Quick Test Script

Save this as `test-api.sh`:

```bash
#!/bin/bash

# Set your credentials
EMAIL="shreyasjha16@gmail.com"
PASSWORD="YOUR_PASSWORD"
BASE_URL="http://localhost:5001/api"

echo "=== 1. Testing Login ==="
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

echo $LOGIN_RESPONSE | jq .

# Extract token (requires jq or manual extraction)
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token: $TOKEN"

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed!"
  exit 1
fi

echo -e "\n=== 2. Testing GET /api/sweets ==="
curl -s -X GET "$BASE_URL/sweets" \
  -H "Authorization: Bearer $TOKEN" | jq .

echo -e "\n=== 3. Testing POST /api/sweets (Admin only) ==="
curl -s -X POST "$BASE_URL/sweets" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Sweet",
    "category": "Test",
    "price": 2.99,
    "quantity": 10
  }' | jq .

echo -e "\n=== 4. Testing GET /api/sweets/search ==="
curl -s -X GET "$BASE_URL/sweets/search?name=Test" \
  -H "Authorization: Bearer $TOKEN" | jq .

echo -e "\n=== All endpoints tested! ==="
```

---

## 🎯 Current Database Status

**Collections:**
- ✅ `users` - 1 user (Shreyas)
- ✅ `sweets` - 0 sweets (empty, need to add)

**Current User:**
- Username: Shreyas
- Email: shreyasjha16@gmail.com
- Role: user (needs to be admin for admin endpoints)

---

## 🔧 Make User Admin (Required for Admin Endpoints)

Run this in MongoDB shell:
```javascript
db.users.updateOne(
  { email: "shreyasjha16@gmail.com" },
  { $set: { role: "admin" } }
)
```

Or via command line:
```bash
mongosh sweet-shop --eval 'db.users.updateOne({email: "shreyasjha16@gmail.com"}, {$set: {role: "admin"}})'
```

After this, logout and login again from the frontend to refresh your token!

---

## 📝 Verify All Endpoints Are Working

1. ✅ Health check: `curl http://localhost:5001/health`
2. ✅ Register: Test registration
3. ✅ Login: Get token
4. ✅ GET /api/sweets: List sweets
5. ✅ GET /api/sweets/search: Search functionality
6. ✅ POST /api/sweets: Add sweet (as admin)
7. ✅ PUT /api/sweets/:id: Update sweet (as admin)
8. ✅ DELETE /api/sweets/:id: Delete sweet (as admin)
9. ✅ POST /api/sweets/:id/purchase: Purchase sweet
10. ✅ POST /api/sweets/:id/restock: Restock sweet (as admin)

All endpoints are implemented and ready to test! 🎉

