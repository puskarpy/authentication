import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function Signup() {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: ""
  })

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (data) => {
      try {
        const res = await axios.post("http://localhost:3000/api/v1/users/register", data)
        return res.data
      } catch (error) {
        console.error(error.response.data)
        throw error
      }
    }
  })

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFormSubmit = () => {
    try {
      mutate(formData)
      setFormData({
        fullName: "",
        email: "",
        username: "",
        password: ""
      })
      toast.success("User created successfully.")
      navigate('/login')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <form action="" className='w-80 p-4'>
        <div className='mt-4 mb-4'>
          <input type="text" name='fullName' className='w-full outline outline-neutral-100 p-2 rounded-lg' onChange={handleInputChange} value={formData.fullName} placeholder='Enter fullname here...' />
        </div>
        <div>
          <input type="email" name='email' className='w-full outline outline-neutral-100 p-2 rounded-lg' onChange={handleInputChange} value={formData.email} placeholder='Enter email here...' />
        </div>
        <div className='mt-4 mb-4'>
          <input type="text" name='username' className='w-full outline outline-neutral-100 p-2 rounded-lg' onChange={handleInputChange} value={formData.username} placeholder='Enter username here...' />
        </div>
        <div className='mt-4 mb-4'>
          <input type="password" name="password" className='w-full outline outline-neutral-100 p-2 rounded-lg' onChange={handleInputChange} value={formData.password} placeholder='Enter password here...' />
        </div>
        <div className='flex'>
          <button type='button' disabled={isPending} onClick={handleFormSubmit} className='p-2 bg-indigo-500'>
            {
              isPending ? "loading..." : "Signup"
            }
          </button>
        </div>
        {isError && <p className='text-red-500 mt-2 mb-2'> {error.response?.data?.message} </p>}
        <div>
          Already have an account?<Link to={'/login'} className='underline'>login</Link>
        </div>
      </form>
    </div>
  )
}
