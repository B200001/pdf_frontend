import { Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/UploadPage';
import PDFViewer from './pages/PDFViewer';
import SharedViewer from './pages/SharedViewer';
import HomePage from './pages/Home';
// import Blog from './pages/Dashboard(1)'; // Consider renaming this to Blog.tsx for clarity
import PrivateRoute from './context/PrivateRoute';

import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <PrivateRoute>
            <UploadPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/pdf/:id"
        element={
          <PrivateRoute>
            <PDFViewer />
          </PrivateRoute>
        }
      />
      <Route
        path="/shared/:sharedId"
        element={

          <SharedViewer />

        }
      />
      
    </Routes>
  );
}

export default App;
