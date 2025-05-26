// import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { Typography, Card, CardContent, Button } from '@mui/material';

import AppTheme from '../shared-theme/AppTheme';
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import Footer from '../components/Footer';

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
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
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to your dashboard! Manage your PDFs and account settings.
        </Typography>

        {/* <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', my: 2 }}>
          <Chip label="Home" component="a" href="/" clickable />
          <Chip label="Upload PDF" component="a" href="/upload" clickable />
          <Chip label="Login" component="a" href="/login" clickable />
          <Chip label="Sign Up" component="a" href="/signup" clickable />
        </Box> */}

        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Upload PDFs
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload and manage your documents.
            </Typography>
            <Button variant="contained" sx={{ mt: 2 }} href="/upload">
              Upload PDF
            </Button>
          </CardContent>
        </Card>

        {/* <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Account Access
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Login or register to continue.
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button variant="outlined" href="/login">
                Login
              </Button>
              <Button variant="outlined" href="/signup">
                Sign Up
              </Button>
            </Box>
          </CardContent>
        </Card> */}
      </Container>

      <Footer />
    </AppTheme>
  );
}
