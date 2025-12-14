import { Route, Routes } from 'react-router-dom'
import { Home, Login, Signup, About, Users } from './pages'
import { Toaster } from 'react-hot-toast'
import Layout from './Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PersistLogin from './components/PersistLogin.jsx'


function App() {
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path='/' element={<Layout />}>

          <Route element={<PersistLogin />}>
              <Route path='/' element={<Home />} />
            <Route element={<ProtectedRoute />}>
              <Route path='/about' element={<About />} />
              <Route path='/users' element={<Users />} />
            </Route>
          </Route>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
