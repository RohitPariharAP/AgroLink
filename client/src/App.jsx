// client/src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Forum from "./pages/Forum";
import SinglePost from "./pages/SinglePost";
import Marketplace from "./pages/Marketplace";
import Scanner from "./pages/Scanner";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Landing from './pages/Landing';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-brand-mid font-bold">
        Loading...
      </div>
    );

  return (
    <Router>
      <div className="font-sans text-gray-800">
        <Routes>
          {/* The Main Entry Point - Landing Page */}
          <Route 
            path="/" 
            element={!user ? <Landing /> : <Navigate to="/dashboard" replace />} 
          />

          {/* Public Auth Routes */}
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/dashboard" replace />}
          />

          {/* Protected Routes (Only accessible if logged in) */}
          <Route element={user ? <Layout /> : <Navigate to="/login" replace />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/forum/:id" element={<SinglePost />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<Profile />} />
          </Route>

          {/* Default Route (If they type a wrong URL, send them to the Landing page) */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;