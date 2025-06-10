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
- `userId` (String, Size: 255, Required: Yes) - Links to Appwrite Auth user
- `email` (Email, Required: Yes)
- `name` (String, Size: 255, Required: Yes)
- `currency` (String, Size: 10, Required: No, Default: "USD")
- `theme` (String, Size: 20, Required: No, Default: "light")
- `notifications` (Boolean, Required: No, Default: true)

**Indexes:**
- Key: `userId_index`, Type: Key, Attributes: [`userId`]

### Expenses Collection
- Collection ID: `expenses`
- Name: `Expenses`
- Permissions: Document Security enabled

**Attributes:**
- `userId` (String, Size: 255, Required: Yes)
- `amount` (Float, Required: Yes)
- `category` (String, Size: 255, Required: Yes)
- `description` (String, Size: 1000, Required: Yes)
- `date` (DateTime, Required: Yes)
- `type` (String, Size: 50, Required: Yes) - "income" or "expense"
- `createdAt` (DateTime, Required: Yes)

**Indexes:**
- Key: `userId_index`, Type: Key, Attributes: [`userId`]
- Key: `date_index`, Type: Key, Attributes: [`date`]
- Key: `type_index`, Type: Key, Attributes: [`type`]

### Goals Collection
- Collection ID: `goals`
- Name: `Goals`
- Permissions: Document Security enabled

**Attributes:**
- `userId` (String, Size: 255, Required: Yes)
- `title` (String, Size: 255, Required: Yes)
- `description` (String, Size: 1000, Required: No)
- `targetAmount` (Float, Required: Yes)
- `currentAmount` (Float, Required: Yes, Default: 0)
- `category` (String, Size: 255, Required: No)
- `type` (String, Size: 50, Required: Yes)
- `period` (String, Size: 50, Required: Yes)
- `startDate` (DateTime, Required: Yes)
- `endDate` (DateTime, Required: Yes)
- `isActive` (Boolean, Required: Yes, Default: true)
- `createdAt` (DateTime, Required: Yes)

**Indexes:**
- Key: `userId_index`, Type: Key, Attributes: [`userId`]
- Key: `isActive_index`, Type: Key, Attributes: [`isActive`]

## Step 3: Set Up Authentication

1. **Enable Email/Password Auth**
   - Go to "Auth" in your Appwrite console
   - Enable "Email/Password" provider
   - Disable email verification for now (can enable later)

2. **Set Up Permissions**
   For each collection, go to Settings > Permissions:

   **Users Collection:**
   - Create: `users` (any authenticated user)
   - Read: `users` (any authenticated user) 
   - Update: `users` (any authenticated user)
   - Delete: `users` (any authenticated user)

   **Expenses Collection:**
   - Create: `users` (any authenticated user)
   - Read: `users` (any authenticated user)
   - Update: `users` (any authenticated user) 
   - Delete: `users` (any authenticated user)

   **Goals Collection:**
   - Create: `users` (any authenticated user)
   - Read: `users` (any authenticated user)
   - Update: `users` (any authenticated user)
   - Delete: `users` (any authenticated user)

## Step 4: Configure Environment Variables

Update your `.env.local` file with your actual Appwrite credentials:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_actual_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_actual_database_id
NEXT_PUBLIC_APPWRITE_BUCKET_ID=your_actual_bucket_id

# Optional: API Keys for AI features
OPENAI_API_KEY=your_openai_api_key
TAVUS_API_KEY=your_tavus_api_key
TAVUS_REPLICA_ID=your_tavus_replica_id
TAVUS_PERSONA_ID=your_tavus_persona_id
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

## Step 5: Test Your Setup

1. Make sure your development server is running: `npm run dev`
2. Go to `http://localhost:3000/dashboard`
3. Try to register a new user
4. Add some expenses and goals
5. Check your Appwrite console to see the data appearing

## Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Go to "Settings" > "Platforms" in your Appwrite project
   - Add a new Web platform with URL: `http://localhost:3000`
   - For production, add your actual domain

2. **Permission Errors**
   - Ensure "Document Security" is enabled for all collections
   - Check that permissions are set to `users` for all operations

3. **Authentication Issues**
   - Verify Email/Password provider is enabled in Auth settings
   - Check that your project ID in `.env.local` matches exactly

4. **Attribute Type Errors**
   - Use `Float` instead of `Double` for decimal numbers
   - Use `String` with appropriate size limits
   - Use `Boolean` for true/false values
   - Use `DateTime` for dates

### Important Notes:

- **Float vs Integer**: Use `Float` for amounts (allows decimals)
- **String Sizes**: Set appropriate sizes (255 for most fields, 1000 for descriptions)
- **Required Fields**: Mark essential fields as required
- **Default Values**: Set defaults where appropriate (like currency: "USD")

## Step-by-Step Collection Creation:

### Creating the Users Collection:
1. Click "Create Collection"
2. Collection ID: `users`
3. Name: `Users`
4. Enable "Document Security"
5. Add each attribute one by one using the "+ Create Attribute" button
6. Create the index after all attributes are added

### Creating Attributes Example (Users Collection):
1. Click "+ Create Attribute"
2. Select "String"
3. Key: `userId`
4. Size: `255`
5. Required: `Yes`
6. Click "Create"

Repeat for all attributes in each collection.

## Next Steps After Setup:

1. Test user registration and login
2. Verify data is being saved to Appwrite
3. Check the Appwrite console for your data
4. Optionally set up file storage for attachments
5. Configure webhooks for real-time updates (advanced)