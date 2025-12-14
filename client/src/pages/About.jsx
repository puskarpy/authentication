import React from 'react'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className='max-w-6xl mx-auto p-20'>
      <div className='text-gray-400 mb-8'>
         This is an auth system built from scratch.
                  It uses React Context to hold global auth state and React Query for server interactions and caching. It supports user registration, login and persistent sessions via refresh tokens, and centralizes auth logic into custom hooks (useAuth, useAxiosPrivate, useRefreshToken, useLogout) to handle token storage, automatic token refresh, and authenticated API requests for a responsive and secure UX.
      </div>
        <Link to={'/'} className='underline'>goto home</Link>
    </div>
  )
}

