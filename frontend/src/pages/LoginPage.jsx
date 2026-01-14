import React from 'react'
import { useState } from 'react';
import {login} from '../lib/api.js';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { ShipWheelIcon } from 'lucide-react';
import { Link } from 'react-router';

const LoginPage = () => {

  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const queryClient = useQueryClient();

  const {mutate: loginMutation, isPending, error} = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['authUser']});
    }
  });

  const handleChange = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  }
  return (
    <div className="h-screen flex items-center justify-center sm:p-6 md:p-8" data-theme="valentine">
      <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'>
        {/* Login Form Section */}
        <div className='w-full lg:w-1/2 p-8 sm:p-8 flex flex-col'>
          {/* Logo */}
          <div className='mb-4 flex items-center justify-start gap-2'>
            <ShipWheelIcon className='text-primary size-9' />
            <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider'>
              Connectify
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div className='mb-4 alert alert-error'>
              {error.response?.data?.message || 'An error occurred. Please try again.'}
            </div>
          )}

          <div className='w-full'>
            <form onSubmit={handleChange}>
              <div className='space-y-4'>
                <div>
                  <h2 className="text-xl font-semibold">Welcome Back</h2>
                  <p className="text-sm opacity-70">
                    Sign in to your account to continue your language journey
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="form-control w-full space-y-2">
                    <label className="label">
                      <span className="label-text">Username</span>
                    </label>
                    <input
                      type="username"
                      placeholder="Harry Nohara"
                      className="input input-bordered w-full"
                      value={loginData.username}
                      onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-control w-full space-y-2">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="input input-bordered w-full"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
                    {isPending ? (
                      <span className="loading loading-spinner loading-xs">
                        Logging In...
                      </span>
                    ) : (
                      'Log In'
                    )}
                  </button>

                  <div className='text-center mt-4'>
                    <p className='text-sm'>
                      Don't have an account? {""}
                      <Link to='/signup' className='text-primary hover:underline'>
                        Create One!
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Image Section */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/i2.png" alt="Language connection illustration" className="w-full h-full" />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
              <p className="opacity-70 text-sm">
                Practice conversations, make friends, and improve your language skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage