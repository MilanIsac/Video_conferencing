import React from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { useLocation } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BellIcon, LogOutIcon, ShipWheelIcon } from 'lucide-react';
import { logout } from '../lib/api';
import { Link } from 'react-router-dom';
import ThemeSelector from './ThemeSelector.jsx';
import useLogout from '../hooks/useLogout.js';


const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith('/chat');

  const { logoutMutation } = useLogout();

  return <nav className='bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center'>
    <div className='container mx-auto px-4 sm:p-6 lg:px-8'>
      <div className='flex items-center justify-end w-full'>

        {/* logo only in chat page */}
        {isChatPage && (
          <div className='pl-5'>
            <Link to='/' className='flex items-center gap-2.5'>
              <ShipWheelIcon className='size-9 text-primary' />
              <span className='text-3xl font-bold font-mono bg-clip-text text-transparent 
                    bg-gradient-to-r from-primary to-secondary tracking-wider'>
                Streamify
              </span>
            </Link>
          </div>
        )}

        <div className='flex items-center gap-3 sm:gap-4 ml-auto'>
          <Link to={'/notifications'}>
            <button className='btn btn-ghost btn-circle'>
              <BellIcon className='size-6 text-based-content opacity-70 ' />
            </button>
          </Link>
        </div>

        {/* selecting themes */}
        <ThemeSelector />

        {/* profile_pic */}
        <div className='avatar'>
          <div className='w-9 rounded-full'>
            <img src={authUser.profile_pic} alt="Profile Pic" rel='noreferrer' />
          </div>
        </div>
        
        {/* logout btn */}
        <button className='btn btn-ghost btn-circle' onClick={logoutMutation}>
          <LogOutIcon className='size-6 text-base-content opacity-70' />
        </button>

      </div>
    </div>
  </nav>
}

export default Navbar
