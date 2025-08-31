import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';

// Import Components and Pages
import Navbar from './components/Navbar/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home/Home.jsx';
import About from './pages/About/About.jsx';
import Blog from './pages/Blog/Blog.jsx';
import BlogPost from './pages/BlogPost/BlogPost.jsx'; 
import Contact from './pages/Contact/Contact.jsx';
import CreatePost from './pages/CreatePost/CreatePost.jsx';
import EditPost from './pages/EditPost/EditPost.jsx'; 
import LoginPage from './pages/Login/LoginPage.jsx';
import RegisterPage from './pages/Register/RegisterPage.jsx';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* --- Public Routes --- */}
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/blog' element={<Blog />} />
        <Route path='/blog/:id' element={<BlogPost />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />

        {/* --- Protected Routes --- */}
        <Route
          path='/create-post'
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        
        {/* 👇 This is the new protected route for editing posts */}
        <Route
          path='/edit-post/:id'
          element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;