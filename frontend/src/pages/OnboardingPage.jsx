import React, { use } from 'react'
import useAuthUser from '../hooks/useAuthuser';
import toast from 'react-hot-toast';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { completeOnboarding } from '../lib/api.js';
import { useState } from 'react';
import { CameraIcon } from 'lucide-react';
import { LANGUAGES } from '../constants/index.js';
import { LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from "lucide-react";

const OnboardingPage = () => {

  const {authUser} = useAuthUser();
  const queryClient = new QueryClient();

  const [formState, setFormState] = useState({
    username: authUser?.fullName || '',
    bio: authUser?.bio || '',
    nativeLanguage: authUser?.nativeLanguage || '',
    learningLanguage: authUser?.learningLanguage || '',
    location: authUser?.location || '',
    profilePic: authUser?.profilePic || '',    
  });

  const {mutate :onboardingMutation, isPending} = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: async () => {
      toast.success("Onboarding Completed!");
      await queryClient.invalidateQueries({queryKey: ['authUser']});
      await queryClient.refetchQueries({queryKey: ["authUser"]});
    },

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Onboarding Failed!");
    }
  });


  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  }

  const handleRandomAvatar = () => {
    const randomId = Math.floor(Math.random() * 100) ;
    const randomAvatar = `https://avatar.iran.liara.run/public/${randomId}.png`;

    setFormState({...formState, profilePic: randomAvatar});
    toast.success("Random Avatar Generated!");
  }
  return (
    <div className='min-h-screen bg-base-100 flex items-center justify-center p-4'>
      <div className='card bg-base-200 w-full max-w-2xl shadow-xl'>
        <div className='card-body p-6 sm:p-8'>
          <h1 className='text-2xl sm:text-3xl font-bold text-center mb-6'>Complete Your Profile</h1>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* PROFILE PIC CONTAINER */}
            <div className='flex flex-col items-center justify-center space-y-4'>
              {/* PROFILE PIC PREVIEW */}
              <div className='w-32 h-32 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center'>
                {formState?.profilePic ? (
                  <img src={formState?.profilePic} alt='Profile Preview' className='w-full h-full object-cover' />
                ) : (
                  <div className='w-full h-full bg-gray-400 flex items-center justify-center'>
                    <CameraIcon className='size-12 text-base-content opacity-40' />
                  </div>
                )}
              </div>

              {/* Generate Random Avatar Buttons */}
              <div className='flex items-center gap-2'>
                <button type='button' onClick={handleRandomAvatar} className='btn btn-sm btn-outline'>
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
              </div>
            </div>
            {/* USERNAME INPUT */}
            <div className='form-control'>
              <label className="label">
                <span className='label-text'>Username:</span>
                <input
                type='text'
                name='username'
                value={formState?.username}
                onChange={(e) => setFormState({...formState, username: e.target.value})}
                placeholder='Enter your username'
                className='input input-bordered w-full'
                required
                />
              </label>
            </div>
            {/* BIO INPUT */}
            <div className='form-control'>
              <label className="label">
                <span className='label-text'>Bio:</span>
                <textarea
                name='bio'
                value={formState?.bio}
                onChange={(e) => setFormState({...formState, bio: e.target.value})}
                placeholder='Tell us about yourself and your language learning goals'
                className='textarea textarea-bordered w-full'
                rows={3}
                />
              </label>
            </div>
            {/* LANGUAGES INPUT */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* NATIVE LANGUAGE */}
              <div className='form-control'>
                <label className="label">
                  <span className="label-text">Native Language</span>
                </label>
                <select
                  name='nativeLanguage'
                  value={formState?.nativeLanguage}
                  onChange={(e) => setFormState({...formState, nativeLanguage: e.target.value})}
                  className='select select-bordered w-full'
                >
                <option value="">Select your native language</option>
                {LANGUAGES.map((lang) => (
                  <option key={`naive-${lang}`} value={lang.toLowerCase()}>
                    {lang}
                  </option>
                ))}
                </select>
              </div>
              {/* LEARNING LANGUAGE */}
              <div className='form-control'>
                <label className="label">
                  <span className="label-text">Learning Language</span>
                </label>
                <select
                  name='learningLanguage'
                  value={formState?.learningLanguage}
                  onChange={(e) => setFormState({...formState, learningLanguage: e.target.value})}
                  className='select select-bordered w-full'
                >
                <option value=''>Select your learning language</option>
                {LANGUAGES.map((lang) => (
                  <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                    {lang}
                  </option>
                ))}
                </select>
              </div>
            </div>

            {/* LOCATION INPUT */}
            <div className='form-control'>
              <label className="label">
                <span className='label-text'>Location:</span>
              </label>
              <div className='relative'>
              <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                type='text'
                name='location'
                value={formState?.location}
                onChange={(e) => setFormState({...formState, location: e.target.value})}
                placeholder='Enter your location (city, country)'
                className='input input-bordered w-full pl-10'
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
              <button type='submit' disabled={isPending} className='btn btn-primary w-full' >
                {!isPending ? (
                  <>
                    <ShipWheelIcon className=" size-5 mr-2" />
                    Complete Onboarding
                  </>
                ): (
                  <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                  </>
                )}
              </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OnboardingPage;