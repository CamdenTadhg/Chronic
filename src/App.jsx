import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import ProtectedRoutes from './components/ProtectedRoutes';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Latest from './components/Latest';
import Profile from './components/Profile';
import About from './components/About';
import Tracking from './components/Tracking';
import Data from './components/Data';


function App() {

  return (
    <>
      <BrowserRouter>
        <NavBar className='fixed-top'/>
        <Routes>
          <Route path="/latest" element={<Latest/>}/>
          <Route path="/about" element={<About/>}/>
          <Route element={<ProtectedRoutes/>}>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/tracking' element={<Tracking/>}/>
            <Route path='/data' element={<Data/>}/>
          </Route>
          <Route path="/" element={<Home/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
