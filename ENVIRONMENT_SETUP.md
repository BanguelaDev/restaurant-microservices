# Environment Variables Setup

This project uses environment variables to store sensitive configuration data like Firebase credentials. Follow these steps to set up your environment:

## Frontend (.env file)

Create a `.env` file in the `frontend/` directory with the following variables:

```bash
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## Backend (.env file)

Create a `.env` file in the `backend/` directory with the following variables:

```bash
# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your_project_id.iam.gserviceaccount.com

# Database Configurations
MONGODB_URL=mongodb://localhost:27017
MONGODB_DATABASE=restaurant_feedback
MONGODB_COLLECTION=feedback

MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=restaurant_orders
MYSQL_PORT=3306
```

## How to get Firebase credentials:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > Service Accounts
4. Click "Generate new private key"
5. Download the JSON file and extract the values

## Security Notes:

- **NEVER commit .env files to Git**
- Add `.env` to your `.gitignore` file
- Keep your Firebase credentials secure
- Rotate credentials regularly

## Example .gitignore entries:

```gitignore
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

## Restart Required:

After creating the `.env` files, restart your development servers for the changes to take effect.
