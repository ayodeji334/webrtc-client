// import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Classroom from './pages/classroom';
import Home from './pages/index';
import Classrooms from './pages/classrooms';


function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='classrooms' element={<Classrooms />}>
        <Route path=':classroomid' element={<Classroom />} />
      </Route>
    </Routes>
  </BrowserRouter>
  );
}

export default App;
