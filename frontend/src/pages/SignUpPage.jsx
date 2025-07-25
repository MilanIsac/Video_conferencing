import React, { useState } from 'react'
import { ShipWheelIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';
import { signup } from '../lib/api.js';
import useSignup from '../hooks/useSignup.js';

const SignUpPage = () => {

  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const { isPending, error, signupMutation } = useSignup();

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  }

  return <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' data-theme='forest'>
    <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl 
    shadow-lg overflow-hidden'>

      {/* left side */}
      <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col'>
        {/* logo */}
        <div className='mb-4 flex items-center justify-start gap-2'>
          <ShipWheelIcon className='w-9 h-9 text-primary' />
          <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r
          from-primary to-secondary tracking-wider'>
            Streamify
          </span>
        </div>

        {error && (
          <div className='alert alert-error bg-red-400 border-none mb-4'>
            <span>{error.response.data.message}</span>
          </div>
        )}

        <div className='w-full'>
          <form onSubmit={handleSignup}>
            <div className='space-y-3'>
              <div>
                <h2 className='text-xl font-semibold'>Create an account</h2>
                <p className='text-sm opacity-70'>Join Streamify and start your language learning adventure</p>
              </div>

              <div className='space-y-3'>

                {/* name */}
                <div className='form-control w-full'>
                  <label className='label'>
                    <span className='label-text'>Full Name</span>
                  </label>
                  <input type="text" placeholder='Milan Isac'
                    className='input input-bordered w-full'
                    value={signupData.name}
                    onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                    required
                  />
                </div>

                {/* email */}
                <div className='form-control w-full'>
                  <label className='label'>
                    <span className='label-text'>Email</span>
                  </label>
                  <input type="email" placeholder='milan.7@gmail.com'
                    className='input input-bordered w-full'
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                  />
                </div>

                {/* password */}
                <div className='form-control w-full'>
                  <label className='label'>
                    <span className='label-text'>Password</span>
                  </label>
                  <input type="password" placeholder='********'
                    className='input input-bordered w-full'
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                  />
                  <p className='text-xs opacity-70 mt-1 ms-2 mb-2'>Password must be 6 characters long</p>
                </div>

                <button type='submit' className='btn btn-primary w-full'>
                  {isPending ? (
                    <><span className='loading loading-spinner loading-xs'></span></>
                  ) : (
                    'Create Account'
                  )}
                </button>

                <div className='text-center mt-4'>
                  <p className='text-sm'>Already have an account?{" "}
                    <Link to="/login" className='text-primary hover:underline'>Sign In</Link>
                  </p>
                </div>
              </div>

            </div>
          </form>
        </div>

      </div>

      {/* SIGNUP FORM - RIGHT SIDE */}
      <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
        <div className="max-w-md p-8">
          {/* Illustration */}
          <div className="relative aspect-square max-w-sm mx-auto">
            <img src="/pic.png" alt="Language connection illustration" className="w-full h-full" />
          </div>

          <div className="text-center space-y-3 mt-6">
            <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
            <p className="opacity-70">
              Practice conversations, make friends, and improve your language skills together
            </p>
          </div>
        </div>
      </div>

    </div>

  </div>;
};

export default SignUpPage
