import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  CssBaseline,
} from '@mui/material'

import AppTheme from '../shared-theme/AppTheme'
import ResponsiveAppBar from '../components/ResponsiveAppBar'
import Footer from '../components/Footer'
const URI = 'https://render-flask-deployment-6xzh.onrender.com';

const PDFViewer = (props: { disableCustomTheme?: boolean }) => {
  const { id } = useParams<{ id: string }>()
  const [pdfUrl, setPdfUrl] = useState('')

  useEffect(() => {
    setPdfUrl(`${URI}/files/${id}`) // Adjust to your backend route
  }, [id])

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
          PDF Viewer
        </Typography>

        <Typography variant="body1" color="text.secondary" gutterBottom>
          Viewing document with ID: <strong>{id}</strong>
        </Typography>

        <Card variant="outlined">
          <CardContent>
            {pdfUrl ? (
              <Box
                component="iframe"
                src={pdfUrl}
                sx={{
                  width: '100%',
                  height: '600px',
                  border: 'none',
                  borderRadius: 2,
                  boxShadow: 1,
                }}
                title="PDF Viewer"
              />
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                <CircularProgress />
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>

      <Footer />
    </AppTheme>
  )
}

export default PDFViewer
