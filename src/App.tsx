import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BoardPage } from './pages/BoardPage';
import { IssueDetailPage } from './pages/IssueDetailPage';
import { SettingsPage } from './pages/SettingsPage';
import { Navigation } from './components/Navigation';
import { useStore } from './utils/store';


export const App = () => {
  const {darkTheme, setDarkTheme} = useStore();
  function handleThemeChange() {
    setDarkTheme(!darkTheme);
    document.body.style.backgroundColor = !darkTheme ? '#333' : '#f4f4f4';
    document.body.style.color = !darkTheme ? '#fff' : '#000';
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';  
  }

  return (
    <>
    <span style={{border:"1px solid black", padding:"5px", position:"absolute", right:"10px", top:"15px", cursor:"pointer", color:"black"}} onClick = {handleThemeChange} > {darkTheme? "Light Theme" : "Dark Theme"}</span>
     <Router>
        <Navigation />
        <Routes>
          <Route path="/board" element={<BoardPage />} />
          <Route path="/issue/:id" element={<IssueDetailPage />} />
          <Route path="/settings" element={<SettingsPage />} />  
          <Route path="*" element={<Navigate to="/board" />} />      
        </Routes>
      </Router>
      </>

  );
}