const passport = require('../config/googleAuth');

// Google OAuth routes
const googleAuthRoutes = (app) => {
  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Check if Google OAuth is configured
  if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === 'your-google-client-id-here') {
    console.log('Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env file');
    
    // Return a placeholder route that shows configuration needed
    app.get('/api/auth/google', (req, res) => {
      res.status(503).json({
        success: false,
        message: 'Google OAuth is not configured. Please contact administrator.',
        setup: 'See SETUP_GOOGLE_AUTH.md for configuration instructions.'
      });
    });
    
    return;
  }

  // Google OAuth routes
  app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  app.get('/api/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login?error=google-auth-failed' }),
    async (req, res) => {
      try {
        // Generate JWT token for the authenticated user
        const token = req.user.generateAuthToken();
        
        // Set token in cookie or send as response
        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Redirect to frontend with success
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5174';
        res.redirect(frontendUrl + '/auth/success?token=' + token);
      } catch (error) {
        console.error('Google auth callback error:', error);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5174';
        res.redirect(frontendUrl + '/login?error=server-error');
      }
    }
  );

  // Google auth success endpoint (for frontend to verify)
  app.get('/api/auth/google/success', (req, res) => {
    if (req.user) {
      const token = req.user.generateAuthToken();
      res.json({
        success: true,
        data: {
          user: req.user,
          token
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
  });
};

module.exports = googleAuthRoutes;
