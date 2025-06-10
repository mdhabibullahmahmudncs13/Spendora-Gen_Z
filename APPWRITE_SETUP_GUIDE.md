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

## Step 4: CRITICAL - Set Up Collection Permissions

**This is the most important step to fix authorization errors!**

For each collection, you need to set up permissions correctly:

### Setting Permissions for Each Collection:

1. **Go to your collection** (Users, Expenses, or Goals)
2. **Click on the "Settings" tab**
3. **Click on "Permissions"**
4. **You will see different permission types: Create, Read, Update, Delete**

### For Users Collection:
- **Create**: Click "Add a role" → Select "Any" → Click "Add"
- **Read**: Click "Add a role" → Select "Users" → Click "Add" 
- **Update**: Click "Add a role" → Select "Users" → Click "Add"
- **Delete**: Click "Add a role" → Select "Users" → Click "Add"

### For Expenses Collection:
- **Create**: Click "Add a role" → Select "Users" → Click "Add"
- **Read**: Click "Add a role" → Select "Users" → Click "Add"
- **Update**: Click "Add a role" → Select "Users" → Click "Add"
- **Delete**: Click "Add a role" → Select "Users" → Click "Add"

### For Goals Collection:
- **Create**: Click "Add a role" → Select "Users" → Click "Add"
- **Read**: Click "Add a role" → Select "Users" → Click "Add"
- **Update**: Click "Add a role" → Select "Users" → Click "Add"
- **Delete**: Click "Add a role" → Select "Users" → Click "Add"

### Alternative Method - Using Role Labels:
If you see text fields instead of dropdowns, enter these exact values:

**For Users Collection:**
- Create: `any`
- Read: `users`
- Update: `users`
- Delete: `users`

**For Expenses Collection:**
- Create: `users`
- Read: `users`
- Update: `users`
- Delete: `users`

**For Goals Collection:**
- Create: `users`
- Read: `users`
- Update: `users`
- Delete: `users`

## Step 5: Configure Platform Settings

1. **Add Platform for CORS**
   - Go to "Settings" → "Platforms" in your Appwrite project
   - Click "Add Platform"
   - Select "Web App"
   - Name: `FinanceAI Local`
   - Hostname: `localhost:3000`
   - Click "Next" and then "Create"

2. **For Production** (when you deploy):
   - Add another platform with your production domain

## Step 6: Configure Environment Variables

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

## Step 7: Test Your Setup

1. Make sure your development server is running: `npm run dev`
2. Go to `http://localhost:3000/dashboard`
3. Try to register a new user
4. **Test adding an expense** - this should now work without authorization errors
5. Add some goals
6. Check your Appwrite console to see the data appearing

## Troubleshooting Authorization Errors

### If you still get "not authorized" errors:

1. **Double-check permissions**:
   - Go to each collection → Settings → Permissions
   - Ensure "Users" role is added to Create, Read, Update, Delete
   - Save changes and wait a few seconds

2. **Verify user authentication**:
   - Check that the user is properly logged in
   - Look at the browser's Network tab to see if auth headers are being sent

3. **Check collection IDs**:
   - Ensure your collection IDs in Appwrite match exactly what's in your code
   - Collection IDs are case-sensitive

4. **Platform settings**:
   - Make sure `localhost:3000` is added as a platform in your Appwrite project

### Common Permission Setup Mistakes:

❌ **Wrong**: Setting permissions to "Guests" or "Any" for data operations
✅ **Correct**: Setting permissions to "Users" for authenticated operations

❌ **Wrong**: Forgetting to enable "Document Security" on collections
✅ **Correct**: Always enable "Document Security" for user-specific data

❌ **Wrong**: Using different role names or typos
✅ **Correct**: Use exactly "users" (lowercase) or select "Users" from dropdown

## Step-by-Step Permission Configuration Screenshots Guide:

1. **Navigate to Collection**: Databases → financeai-db → expenses
2. **Go to Settings Tab**: Click "Settings" at the top
3. **Click Permissions**: You'll see a permissions interface
4. **For Create Permission**: 
   - Click "Add a role"
   - Select "Users" from the dropdown (or type "users")
   - Click "Add" or "Save"
5. **Repeat for Read, Update, Delete**: Follow the same process
6. **Save Changes**: Make sure to save/apply the changes

## Verification Steps:

After setting up permissions, verify they're correct:

1. **Check Permission Display**: Each permission should show "Users" as an allowed role
2. **Test in App**: Try creating an expense - it should work without errors
3. **Check Appwrite Logs**: Go to "Logs" in your Appwrite console to see any permission errors

## Important Notes:

- **Document Security**: Must be enabled for all collections containing user data
- **Role Names**: Use "users" (lowercase) or select "Users" from dropdown
- **Platform Setup**: Required for CORS to work properly
- **Environment Variables**: Must match your actual Appwrite project settings exactly

If you're still experiencing issues after following this guide, check the Appwrite console logs for specific error messages and ensure all steps were completed exactly as described.