import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import axios from '../api/axios.js'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth.js'

export default function Login() {

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [error, setError] = useState(null);
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/";

  const { setAuth } = useAuth()

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFormSubmit = async () => {
    try {
      const res = await axios.post("/api/v1/users/login", formData, {
        withCredentials: true
      })
      const accessToken = res?.data?.data?.accessToken;
      const user = res?.data?.data?.user;
      setAuth({ accessToken, user })
      setFormData({
        email: "",
        password: ""
      })
      toast.success(res.data?.message)
      navigate(from, {replace: true})
    } catch (error) {
      if(!error?.response){
        setError("No server response.")
        toast.error("No server response.")
      } else{
        toast.error(error?.response?.data?.message)
        setError(error?.response?.data?.message)
      }
    }
  }

  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <form action="" className='w-80 p-4'>
        <div>
          <input type="email" name='email' required className='w-full outline outline-neutral-100 p-2 rounded-lg' value={formData.email} onChange={handleInputChange} placeholder='Enter email here...' />
        </div>
        <div className='mt-4 mb-4'>
          <input type="password" name="password" required className='w-full outline outline-neutral-100 p-2 rounded-lg' value={formData.password} onChange={handleInputChange} placeholder='Enter password here...' />
        </div>
        <div className='flex'>
          <button type='button' onClick={handleFormSubmit} className='p-2 bg-indigo-500'>
            Login
          </button>
        </div>
        {error && <p className='text-red-500 mt-2 mb-2'>{error}</p>}
        <div>
          Don't have an account?<Link to={'/signup'} className='underline'>signup</Link>
        </div>
      </form>
    </div>
  )
}
