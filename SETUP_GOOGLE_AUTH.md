# Google OAuth Setup Guide for EKALAVYA

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API and Google OAuth2 API

## Step 2: Create OAuth 2.0 Credentials

1. Go to APIs & Services > Credentials
2. Click "Create Credentials" > "OAuth 2.0 Client ID"
3. Select "Web application"
4. Add authorized redirect URIs:
   - Development: `http://localhost:5000/api/auth/google/callback`
   - Production: `https://yourdomain.com/api/auth/google/callback`
5. Copy the Client ID and Client Secret

## Step 3: Environment Variables

Create a `.env` file in the project root:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend Environment Variables (create .env in client folder)
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here

# Other required variables
MONGODB_URI=mongodb://localhost:27017/ekalavya
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5174
PORT=5000
NODE_ENV=development
SESSION_SECRET=your-session-secret-key-change-this-in-production
```

## Step 4: Install Dependencies

Backend (already installed):
```bash
npm install passport passport-google-oauth20 express-session connect-mongo
```

Frontend (already installed):
```bash
npm install @react-oauth/google
```

## Step 5: Test the Integration

1. Start the backend server:
```bash
cd server
npm start
```

2. Start the frontend:
```bash
cd client
npm start
```

3. Go to `http://localhost:5174/login`
4. Click "Sign in with Google"
5. Complete the Google OAuth flow

## Features Implemented

- **Backend**: Passport.js Google OAuth strategy
- **Frontend**: Google One Tap integration
- **Database**: User creation/updates with Google profile data
- **Session Management**: Secure session storage
- **JWT Tokens**: Automatic token generation
- **Profile Sync**: Google avatar and profile info

## Security Notes

- Never commit `.env` files to version control
- Use HTTPS in production
- Set appropriate redirect URIs in Google Console
- Regularly rotate secrets
- Enable 2FA on your Google account

## Troubleshooting

1. **"redirect_uri_mismatch"**: Check redirect URI in Google Console
2. **"invalid_client"**: Verify Client ID and Secret
3. **CORS errors**: Check server CORS configuration
4. **Session issues**: Clear browser cookies and localStorage

## Next Steps

- Add Google Analytics tracking
- Implement social login buttons for other providers
- Add email verification flow
- Set up production deployment
