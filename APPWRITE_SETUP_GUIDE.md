# Complete Appwrite Setup Guide for FinanceAI

## Step 1: Create Appwrite Account and Project

1. **Sign up for Appwrite Cloud**
   - Go to [https://cloud.appwrite.io](https://cloud.appwrite.io)
   - Create a free account
   - Create a new project called "FinanceAI"

2. **Get Your Project Credentials**
   - Project ID: Found in your project settings
   - Endpoint: `https://cloud.appwrite.io/v1`

## Step 2: Set Up Database

1. **Create Database**
   - Go to "Databases" in your Appwrite console
   - Click "Create Database"
   - Name: `financeai-db`
   - Copy the Database ID

2. **Create Collections**

### Users Collection
- Collection ID: `users`
- Name: `Users`
- Permissions: Document Security enabled

**Attributes:**
- `userId` (String, 255 chars, required) - Links to Appwrite Auth user
- `email` (Email, required)
- `name` (String, 255 chars, required)
- `preferences` (JSON, optional)

**Indexes:**
- `userId_index` on `userId` (Key index)

### Expenses Collection
- Collection ID: `expenses`
- Name: `Expenses`
- Permissions: Document Security enabled

**Attributes:**
- `userId` (String, 255 chars, required)
- `amount` (Double, required)
- `category` (String, 255 chars, required)
- `description` (String, 1000 chars, required)
- `date` (DateTime, required)
- `type` (String, 50 chars, required) - "income" or "expense"
- `createdAt` (DateTime, required)

**Indexes:**
- `userId_index` on `userId` (Key index)
- `date_index` on `date` (Key index)
- `type_index` on `type` (Key index)

### Goals Collection
- Collection ID: `goals`
- Name: `Goals`
- Permissions: Document Security enabled

**Attributes:**
- `userId` (String, 255 chars, required)
- `title` (String, 255 chars, required)
- `description` (String, 1000 chars, optional)
- `targetAmount` (Double, required)
- `currentAmount` (Double, required, default: 0)
- `category` (String, 255 chars, optional)
- `type` (String, 50 chars, required)
- `period` (String, 50 chars, required)
- `startDate` (DateTime, required)
- `endDate` (DateTime, required)
- `isActive` (Boolean, required, default: true)
- `createdAt` (DateTime, required)

**Indexes:**
- `userId_index` on `userId` (Key index)
- `isActive_index` on `isActive` (Key index)

## Step 3: Set Up Authentication

1. **Enable Email/Password Auth**
   - Go to "Auth" in your Appwrite console
   - Enable "Email/Password" provider
   - Disable email verification for now (can enable later)

2. **Set Up Permissions**
   For each collection, set these permissions:

   **Create permissions:**
   - `users` (authenticated users can create)

   **Read permissions:**
   - `users` (authenticated users can read their own documents)

   **Update permissions:**
   - `users` (authenticated users can update their own documents)

   **Delete permissions:**
   - `users` (authenticated users can delete their own documents)

## Step 4: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id_here
NEXT_PUBLIC_APPWRITE_BUCKET_ID=your_bucket_id_here

# Optional: API Keys for AI features
OPENAI_API_KEY=your_openai_api_key
TAVUS_API_KEY=your_tavus_api_key
TAVUS_REPLICA_ID=your_tavus_replica_id
TAVUS_PERSONA_ID=your_tavus_persona_id
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

## Step 5: Test Your Setup

1. Start your development server: `npm run dev`
2. Try to register a new user
3. Add some expenses and goals
4. Check your Appwrite console to see the data

## Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Add your domain to "Platforms" in Appwrite console
   - For development: `http://localhost:3000`

2. **Permission Errors**
   - Ensure document security is enabled
   - Check that permissions are set correctly for each collection

3. **Authentication Issues**
   - Verify email/password provider is enabled
   - Check that your project ID is correct

### Security Rules

For production, you'll want to add these security rules to each collection:

```javascript
// Users collection
and([
  equal($userId, attribute("userId"))
])

// Expenses collection  
and([
  equal($userId, attribute("userId"))
])

// Goals collection
and([
  equal($userId, attribute("userId"))
])
```

## Next Steps

1. Set up file storage (optional)
2. Configure webhooks for real-time updates
3. Add more advanced security rules
4. Set up backup strategies