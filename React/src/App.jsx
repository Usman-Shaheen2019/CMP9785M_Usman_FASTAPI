import 'react'
import './App.css'

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from '@mui/material';

import {Navbar, DailyFeeds, Login, Register,AddCategory, AddNewJoke, AddCohereLLMJoke, Overview, ProfileSetting} from './components'
function App() {
  return (
     <BrowserRouter>
    <Box sx={{ backgroundColor: '#000' }}>
      <Navbar />
      <Routes>
        <Route exact path='/' element={<DailyFeeds />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/Register" element={<Register/>} />
        <Route path="/AddCategory" element={<AddCategory/>} />
        <Route path="/AddNewJoke" element={<AddNewJoke/>} />
        <Route path="/AddCohereLLMJoke" element={<AddCohereLLMJoke/>} />
        <Route path="/Overview" element={<Overview/>} />
        <Route path="/ProfileSetting" element={<ProfileSetting/>} />
      </Routes>
    </Box>
  </BrowserRouter>
  )
}

export default App
