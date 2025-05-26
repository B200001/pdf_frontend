import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  CssBaseline,
  Divider,
  Paper,
 
} from '@mui/material'

import AppTheme from '../shared-theme/AppTheme'
import Footer from '../components/Footer'

interface Comment {
  _id: string
  author: string
  text: string
  comment_id: string
  'created-At': string
  pdf_id: string
}
const URI = 'https://render-flask-deployment-6xzh.onrender.com';

const SharedViewer = (props: { disableCustomTheme?: boolean }) => {
  const { sharedId } = useParams<{ sharedId: string }>()
  const [pdfUrl, setPdfUrl] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const [loadingPdf, setLoadingPdf] = useState(true)
  const [loadingComments, setLoadingComments] = useState(true)
  const [errorPdf, setErrorPdf] = useState<string | null>(null)
  const [errorComments, setErrorComments] = useState<string | null>(null)
  // const [newComment, setNewComment] = useState('')
  // const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const fetchPdf = async () => {
    try {
      setPdfUrl(`${URI}/api/sharable/get_pdf/${sharedId}`)
    } catch (err) {
      console.error('Error fetching PDF:', err)
      setErrorPdf('Failed to load PDF. Please try again later.')
    } finally {
      setLoadingPdf(false)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await axios.get<Comment[]>(
        `${URI}/api/sharable/get_comments/${sharedId}`
      )
      setComments(response.data)
    } catch (err) {
      console.error('Error fetching comments:', err)
      setErrorComments('Failed to load comments.')
    } finally {
      setLoadingComments(false)
    }
  }



  // const handleCommentSubmit = async (fileId: string) => {
  //   const comment = commentInputs[fileId];
  //   if (!comment) return;

  //   try {
  //     const token = localStorage.getItem('token');
  //     const res = await fetch(`http://localhost:5000/api/pdf/comment/${fileId}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({ comment }),
  //     });

  //     if (res.ok) {
  //       setCommentInputs(prev => ({ ...prev, [sharedId]: '' }));
  //       fetchComments(sharedId); // fetch only this file's comments
  //     }
  //   } catch (err) {
  //     console.error('Failed to submit comment', err);
  //   }
  // };


  useEffect(() => {
    console.log("LOCALLLLLLLLLL", localStorage);
    console.log("USERRRRRRRRRRRR", user);




    fetchPdf()
    fetchComments()
  }, [sharedId])

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      <Container
        maxWidth="md"
        component="main"
        sx={{ my: 16, display: 'flex', flexDirection: 'column', gap: 4 }}
      >
        <Typography variant="h4" gutterBottom>
          Shared PDF Viewer
        </Typography>

        {loadingPdf ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={300}>
            <CircularProgress />
          </Box>
        ) : errorPdf ? (
          <Typography color="error">{errorPdf}</Typography>
        ) : (
          <Card variant="outlined">
            <CardContent>
              <Box
                component="iframe"
                src={pdfUrl}
                sx={{
                  width: '100%',
                  height: '600px',
                  border: 'none',
                  borderRadius: 2,
                }}
                title="Shared PDF"
              />
            </CardContent>
          </Card>
        )}
        {/* <Box mt={4}>
          {user ? (
            <>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  label="Add a comment"
                  size="small"
                  fullWidth
                  value={commentInputs[sharedId] || ''}
                  onChange={e => handleCommentChange(sharedId, e.target.value)}
                />
                <Button
                  variant="contained"
                  onClick={() => handleCommentSubmit(sharedId)}
                >
                  Comment
                </Button>
              </Box>
            </>
          ) : (
            <Typography variant="body1" color="text.secondary">
              Please <a href="/login">log in</a> or <a href="/signup">sign up</a> to add a comment.
            </Typography>
          )}
        </Box> */}


        <Box>
          <Typography variant="h6" gutterBottom>
            Comments {loadingComments ? '(Loading...)' : `(${comments.length})`}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {errorComments && <Typography color="error">{errorComments}</Typography>}

          {!loadingComments && comments.length === 0 && (
            <Typography>No comments yet. Be the first to comment!</Typography>
          )}

          {!loadingComments &&
            comments.map((comment) => {
              const author = typeof comment.author === 'string' ? comment.author : '[Invalid author]'
              const text = typeof comment.text === 'string' ? comment.text : JSON.stringify(comment.text)
              const createdAt = comment['created-At']

              return (
                <Paper
                  key={comment._id}
                  elevation={1}
                  sx={{
                    p: 2,
                    mb: 2,
                    backgroundColor: 'background.default',
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                  }}
                >
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="subtitle2">{author}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2">{text}</Typography>
                </Paper>
              )
            })}

        </Box>
      </Container>

      <Footer />
    </AppTheme>
  )
}

export default SharedViewer
