import { Route, Routes } from 'react-router-dom';
import './App.css'
import Home from './pages/Home';
import Chating from './pages/Chating';
import Contacts from './pages/Contacts';
import ContactNew from './pages/ContactNew';
import ContactDetail from './pages/ContactDetail';

function App() {
  return (
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/chating' element={<Chating/>}/>
        <Route path='/contacts' element={<Contacts/>}/>
        <Route path='/contact/new' element={<ContactNew/>}/>
        <Route path='/contact/:id' element={<ContactDetail/>}/>
      </Routes>
  )
}

export default App;
