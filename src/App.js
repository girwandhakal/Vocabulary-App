import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Authentication/Login';
import Signup from './Components/Authentication/Signup';
import HomePage from './Components/HomePage/HomePage';
import ReviewWords from './Components/Review/ReviewWords';
import Quiz from './Components/Quiz/Quiz';
import './App.scss';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/review" element={<ReviewWords />} />
        <Route path="/quiz" element ={<Quiz/>}/>
      </Routes>
    </Router>
  );
}

export default App;
