import { Route, Routes } from 'react-router-dom';
import './App.css'
import Home from './pages/Home';
import Chating from './pages/Chating';

function App() {
  return (
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/chating' element={<Chating/>}/>
      </Routes>
  )
}

export default App;
