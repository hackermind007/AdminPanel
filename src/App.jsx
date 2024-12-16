import React from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard';
import Category from './Pages/Category';
import SubCategory from './Pages/SubCategory';
import Signup from './Pages/Signup';
import QA from './Pages/QA';

const App = () => {
  return (
    // <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path="/signup" element={<Signup />} />
        <Route path='/admin/' element={<Dashboard />}></Route>
        <Route path='/admin/category' element={<Category />}></Route>
        <Route path='/admin/subcategory' element={<SubCategory />}></Route>
        <Route path='/admin/qa' element={<QA />}></Route>
      </Routes>
    // </BrowserRouter> 
  )
}

export default App
