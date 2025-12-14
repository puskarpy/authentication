import { useAuth } from '../hooks/useAuth.js';
import { Link, useNavigate } from 'react-router-dom';
import useLogout from '../hooks/useLogout.js';

export default function Home() {

  const { auth } = useAuth()
  const logout = useLogout()
  let isAuthenticated = !!auth?.user;
  const navigate = useNavigate()

  const handleLogout = async() => {
    await logout()
    navigate('/')
  }

  return (
    <div className='max-w-6xl mx-auto p-20'>
      <div>
        {
          isAuthenticated && <p className='font-bold text-4xl'>Welcome! {auth.user.fullName}</p>
        }
        {
          isAuthenticated ?
            <div className='mt-4'>
              <button onClick={handleLogout} className='bg-violet-500 px-4 py-2 cursor-pointer'>Log out</button>
            </div>
            :
            <div className='mt-4'>
              <div className='text-4xl font-bold mb-4'>Welcome.</div>
              <div>
                <p className="text-lg text-gray-400 mb-8 max-w-prose">
                  This is an auth system built from scratch.
                  It uses React Context to hold global auth state and React Query for server interactions and caching. It supports user registration, login and persistent sessions via refresh tokens, and centralizes auth logic into custom hooks (useAuth, useAxiosPrivate, useRefreshToken, useLogout) to handle token storage, automatic token refresh, and authenticated API requests for a responsive and secure UX.
                </p>
              </div>
              <Link to={'/login'} className='bg-violet-500 px-4 py-2 mr-4'>Login</Link>
              <Link to={'/signup'} className='bg-violet-500 px-4 py-2'>Signup</Link>
            </div>
            }
      </div>
    </div>
  )
}
