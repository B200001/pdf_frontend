import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  CssBaseline,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Link as MuiLink,
  Divider,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDropzone } from 'react-dropzone';

import ResponsiveAppBar from '../components/ResponsiveAppBar';
import Footer from '../components/Footer';
import AppTheme from '../shared-theme/AppTheme';
import axios from 'axios';

interface FileEntry {
  _id: string;
  filename: string;
  comments: { user: string; text: string }[];
}
interface Comment {
  author: string; // Changed from 'user' to match API
  created_At: string;
  text: string | Comment[]; // Text can be string or array of comments
}

const URI = 'https://render-flask-deployment-6xzh.onrender.com';
// const URI = 'https://render-flask-deployment-6xzh.onrender.com';

// Update your state type


const UploadPage = () => {
  const [file, setFile] = useState<File | any>();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});


  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setMessage('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });
  
  // http://localhost:5000
  const fetchFiles = async () => {
    const token = localStorage.getItem('token'); // or sessionStorage
    try {
      const response = await fetch(`${URI}/api/pdf/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      // console.log(".........", data);
      if (Array.isArray(data)) {
        // console.log('aray', data);
        setFiles(data);
      } else {
        console.error('Expected an array but got:', data);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const fetchComments = async (pdfId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${URI}/api/pdf/comments/${pdfId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      const data: Comment[] = await response.json();

      const uniqueComments = data.filter(comment => typeof comment.text === 'string');

      console.log("Unique comments:", uniqueComments); // Should show 4 comments
      // Flatten the comments
      const flattenedComments = data.flatMap(comment =>
        typeof comment.text === 'string'
          ? [comment]
          : comment.text
      );

      console.log("Flattened comments:", flattenedComments);

      // Update state and use the new value
      setComments(prev => {
        const newState = { ...prev, [pdfId]: uniqueComments };
        console.log("New state being set:", newState);
        return newState;
      });

      // To see the updated state, use useEffect:
      // useEffect(() => {
      //   console.log("Current comments state:", comments);
      // }, [comments]); // This will log whenever comments changes
      console.log("CPMMMM", comments);

    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };








  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    files.forEach(file => {
      fetchComments(file._id);
      console.log("Comments........", comments);
    });
  }, [files]);
  useEffect(() => {
    console.log("Current comments state:", comments);
  }, [comments]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setMessage('Please select a PDF file first.');

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${URI}/api/pdf/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || 'Upload failed');
        // console.log(data);
      } else {
        setMessage('File uploaded successfully!');
        setFile(null);
        fetchFiles(); // refresh list
      }
    } catch {
      setMessage('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentChange = (fileId: string, text: string) => {
    setCommentInputs(prev => ({ ...prev, [fileId]: text }));
  };


  const handleCommentSubmit = async (fileId: string) => {
    const comment = commentInputs[fileId];
    if (!comment) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${URI}/api/pdf/comment/${fileId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ comment }),
      });

      if (res.ok) {
        setCommentInputs(prev => ({ ...prev, [fileId]: '' }));
        fetchComments(fileId); // fetch only this file's comments
      }
    } catch (err) {
      console.error('Failed to submit comment', err);
    }
  };
  const handleGetShareLink = async (file : any) => {
    if (!file || !file._id) {
      console.error("Invalid file provided to share link handler.");
      return;
    }

    try {
      const response = await axios.get(`${URI}/api/pdf/share/${file._id}`);
      const sharedId = response.data.share_link.split("/").pop();

      // ✅ Correct route to match your frontend <Route>
      window.open(`/shared/${sharedId}`, "_blank");
    } catch (err) {
      console.error("Error generating share link:", err);
    }
  };





  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <ResponsiveAppBar />
      <Container maxWidth="md" sx={{ my: 12 }}>
        <Typography variant="h4" gutterBottom>
          Upload PDF
        </Typography>

        <Card variant="outlined" sx={{ mb: 4 }}>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Box
                {...getRootProps()}
                sx={{
                  border: '2px dashed #90caf9',
                  borderRadius: 2,
                  p: 5,
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: isDragActive ? '#e3f2fd' : 'transparent',
                }}
              >
                <input {...getInputProps()} />
                <CloudUploadIcon sx={{ fontSize: 50, color: '#90caf9' }} />
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {isDragActive
                    ? 'Drop the file here...'
                    : 'Drag & drop a PDF here, or click to select'}
                </Typography>
                {file && (
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    Selected: {file.name}
                  </Typography>
                )}
              </Box>

              <Box sx={{ mt: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Upload'}
                </Button>
                {message && (
                  <Typography variant="body2" color="text.secondary">
                    {message}
                  </Typography>
                )}
              </Box>
            </form>
          </CardContent>
        </Card>

        <Typography variant="h5" gutterBottom>
          Uploaded Files
        </Typography>

        {files.map(file => (
          <Card variant="outlined" key={file._id} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                <strong>{file.filename}</strong>
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <MuiLink href={`/pdf/${file._id}`} target="_blank" underline="hover">
                  View
                </MuiLink>
                <MuiLink
                  component="button"
                  onClick={() => handleGetShareLink(file)}
                  underline="hover"
                >
                  Get Share Link
                </MuiLink>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  label="Add a comment"
                  size="small"
                  fullWidth
                  value={commentInputs[file._id] || ''}
                  onChange={e => handleCommentChange(file._id, e.target.value)}
                />
                <Button
                  variant="contained"
                  onClick={() => handleCommentSubmit(file._id)}
                >
                  Comment
                </Button>
              </Box>

              <Divider sx={{ my: 1 }} />
              {comments[file._id] && comments[file._id].length > 0 ? (
                comments[file._id].map((c, idx) => (
                  <Typography key={idx} variant="body2" sx={{ mt: 1 }}>
                    <>
                      <strong>{c.author}</strong> {c.text}
                    </>
                    
                  </Typography>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No comments yet.
                </Typography>
              )}





            </CardContent>
          </Card>
        ))}
      </Container>
      <Footer />
    </AppTheme>
  );
};

export default UploadPage;
