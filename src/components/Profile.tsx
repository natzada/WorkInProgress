import React from 'react'
import pfp from '../assets/images/user.pfp.png'

function Profile() {
  return (
    <div className="flex justify-center items-center">
        <div className='bg-placeholder/80 w-80 h-120 mt-25 flex flex-col justify-start items-center p-2'>
            <img src={pfp} className='rounded-full w-50 h-50' alt="profile-image" />
            <h1 className='font-bold text-2xl'>Seu nome</h1>
        </div>
    </div>
  )
}

export default Profile