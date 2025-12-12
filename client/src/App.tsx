import { Route, Routes } from 'react-router-dom';
import './App.css'
import Home from './pages/Home';
import Chating from './pages/Chating';
import Contacts from './pages/Contacts';
import ContactNew from './pages/ContactNew';
import ContactDetail from './pages/ContactDetail';
import Login from './pages/Login';
import PrivateRoute from './components/privateRoute';
import Register from './pages/Register';
import EditContact from './pages/EditContact';

function App() {
  return (
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/chating' element={<Chating/>}/>
        <Route path='/contacts' element={<Contacts/>}/>
        <Route 
          path='/contact/new'
          element={
            <PrivateRoute>
              <ContactNew />
            </PrivateRoute>
          }
        />
        <Route path='/contact/:id' element={<ContactDetail/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path="/contact/edit/:id" element={<EditContact/>}/>
      </Routes>
  )
}

export default App;
