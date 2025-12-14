import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className='py-6 px-10 flex justify-end border-b border-neutral-400/50'>
        <div className='flex gap-8 uppercase text-sm font-semibold'>
            <Link to={'/'}>Home</Link>
            <Link to={'/about'}>About</Link>
            <Link to={'/users'}>Users</Link>
        </div>
    </header>
  )
}
