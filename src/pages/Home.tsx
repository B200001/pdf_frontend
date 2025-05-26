// import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';

import AppTheme from '../shared-theme/AppTheme';
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import Footer from '../components/Footer';

export default function HomePage(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      <ResponsiveAppBar />

      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
      >
        <Typography variant="h3" gutterBottom>
          Welcome!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please sign in or sign up to get started.
        </Typography>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Access Your Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in if you already have an account, or sign up to create one.
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button variant="outlined" href="/login">
                Sign In
              </Button>
              <Button variant="contained" href="/signup">
                Sign Up
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>

      <Footer />
    </AppTheme>
  );
}
