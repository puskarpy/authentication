import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAxiosPrivate } from '../hooks/useAxiosPrivate'

export default function Users() {

  const axiosPrivate = useAxiosPrivate()
  const [allUsers, setAllUsers] = useState(null)

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const fetchAllUsers = async () => {
      try {
        const res = await axiosPrivate.get("/api/v1/users/getall",
          {
            withCredentials: true,
            signal: controller.signal
          }
        )
        isMounted && setAllUsers(res.data.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchAllUsers();

    return() => {
      isMounted= false
      controller.abort()
    }

  }, [])

  return (
    <div className='max-w-6xl mx-auto p-20'>
      <div className='mx-auto'>
        <p className='text-4xl font-bold'>All Users</p>
        {
          allUsers?.map((user, index) => (
            <div key={index} className='m-4'>{index + 1}. {user.fullName}</div>
          ))
        }
      </div>
    </div>
  )
}
