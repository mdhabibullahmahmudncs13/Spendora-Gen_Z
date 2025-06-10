# Appwrite Backend Setup for Spendora

This guide will walk you through setting up Appwrite as the backend for the Spendora financial application.

## Prerequisites

- Node.js and npm installed
- Appwrite account (sign up at [https://appwrite.io](https://appwrite.io) if you don't have one)

## Step 1: Create an Appwrite Project

1. Log in to your Appwrite Console
2. Create a new project named "Spendora"
3. Note your Project ID (you'll need this later)

## Step 2: Set Up Database

1. In your Appwrite project, go to Databases and create a new database named "spendora-db"
2. Note your Database ID
3. Create the following collections in your database:

### Users Collection

- Collection ID: `users`
- Document Security: Enable "Document Security"

Attributes:
- `userId` (string, required) - Relationship with Appwrite Auth
- `email` (email, required)
- `name` (string, required)
- `preferences` (object):
  - `currency` (string, default: "USD")
  - `theme` (string, enum: ["light", "dark"], default: "light")
  - `notifications` (boolean, default: true)

Indexes:
- Create an index on `userId` (attribute: userId, type: key)

### Expenses Collection

- Collection ID: `expenses`
- Document Security: Enable "Document Security"

Attributes:
- `userId` (string, required)
- `amount` (number, required)
- `category` (string, required)
- `description` (string, required)
- `date` (datetime, required)
- `type` (string, enum: ["income", "expense"], required)
- `createdAt` (datetime, required)

Indexes:
- Create an index on `userId` (attribute: userId, type: key)
- Create an index on `date` (attribute: date, type: key)
- Create an index on `category` (attribute: category, type: key)
- Create an index on `type` (attribute: type, type: key)

### Goals Collection

- Collection ID: `goals`
- Document Security: Enable "Document Security"

Attributes:
- `userId` (string, required)
- `title` (string, required)
- `description` (string)
- `targetAmount` (number, required)
- `currentAmount` (number, required)
- `category` (string)
- `type` (string, enum: ["spending", "saving", "income"], required)
- `period` (string, enum: ["weekly", "monthly", "yearly", "custom"], required)
- `startDate` (datetime, required)
- `endDate` (datetime, required)
- `isActive` (boolean, required)
- `createdAt` (datetime, required)

Indexes:
- Create an index on `userId` (attribute: userId, type: key)
- Create an index on `type` (attribute: type, type: key)
- Create an index on `isActive` (attribute: isActive, type: key)

### Categories Collection (Optional)

- Collection ID: `categories`
- Document Security: Enable "Document Security"

Attributes:
- `name` (string, required)
- `icon` (string)
- `color` (string)
- `type` (string, enum: ["income", "expense"], required)

Indexes:
- Create an index on `type` (attribute: type, type: key)

## Step 3: Set Up Storage

1. Go to Storage in your Appwrite console
2. Create a new bucket named "attachments"
3. Set permissions as needed (typically allow read for authenticated users, write for authenticated users)
4. Note your Bucket ID

## Step 4: Configure Environment Variables

1. Copy the `.env.example` file to `.env.local`
2. Fill in your Appwrite details:

```
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
NEXT_PUBLIC_APPWRITE_BUCKET_ID=your_bucket_id
```

## Step 5: Test Your Setup

1. Run the application with `npm run dev`
2. Try to register a new user
3. Test creating expenses and goals

## Troubleshooting

- If you encounter CORS issues, make sure to add your application's URL to the allowed platforms in your Appwrite project settings
- Check that all collection attributes and indexes are set up correctly
- Verify that your environment variables are correctly set

## Additional Resources

- [Appwrite Documentation](https://appwrite.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)