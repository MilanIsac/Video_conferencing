import { useState } from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { CameraIcon, LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from 'lucide-react';
import { completeOnboarding } from '../lib/api';

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formstate, setFormState] = useState({
    username: authUser?.username || '',
    bio: authUser?.bio || '',
    location: authUser?.location || '',
    profile_pic: authUser?.profile_pic || '',
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },

    onError: (error) => {
      toast.error(error.response.data.message);
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formstate);
  }

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100 + 1);
    const randomAvatar = `https://api.dicebear.com/7.x/adventurer/png?seed=${idx}`;
    setFormState({ ...formstate, profile_pic: randomAvatar });
    toast.success("Random profile pic generated")
  }

  return (
    <div className='min-h-screen bg-base-100 flex justify-center p-4'>
      <div className='card bg-base-200 w-full max-w-3xl shadow-xl'>
        <div className='card-body p-6 sm:p-8'>
          <h1 className='text-2xl sm:text-3xl font-bold text-center mb-6'>
            Complete your Profile
          </h1>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='flex flex-col items-center justify-center space-y-4'>
              <div className='size-32 rounded-full bg-base-300 overflow-hidden'>
                {formstate.profile_pic ? (
                  <img src={formstate.profile_pic} alt="Profile Review"
                    className='w-full h-full object-cover' />
                ) : (
                  <div>
                    <CameraIcon className='size-12 text-base-content opacity-40' />
                  </div>
                )}
              </div>
              <div className='flex items-center gap-2'>
                <button className='btn btn-accent' type='button' onClick={handleRandomAvatar}>
                  <ShuffleIcon className='size-4 mr-2' />
                  Generate Random Avatar
                </button>
              </div>
            </div>

            {/* username */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Full Name</span>
              </label>

              <input type="text" name="username"
                value={formstate.username}
                onChange={(e) => setFormState({ ...formstate, username: e.target.value })}
                className='input input-bordered w-full'
                placeholder='Your name'
              />
            </div>

            {/* bio */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Bio</span>
              </label>

              <input type="text" name="bio"
                value={formstate.bio}
                onChange={(e) => setFormState({ ...formstate, bio: e.target.value })}
                className='input input-bordered w-full'
                placeholder='Bio'
              />
            </div>

            {/* location */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Location</span>
              </label>

              <div className='relative'>
                <MapPinIcon className='absolute top-1/2 transform -translate-y-1/2 
                left-3 size-5 text-based-content opacity-70'/>
                <input type="text" name="location"
                  value={formstate.location}
                  onChange={(e) => setFormState({ ...formstate, location: e.target.value })}
                  className='input input-bordered w-full pl-10'
                  placeholder='City, Country'
                />
              </div>
            </div>

            <button className='btn btn-primary w-full' disabled={isPending} type='submit'>
              { !isPending ? (
                <>
                <ShipWheelIcon className='size-5 mr-2'/>
                Complete Onboarding
                </>
              ) : (
                <>
                <LoaderIcon className='animate-spin size-5 mr-2'/>
                Onboarding...
                </>
              ) }
            </button>


          </form>
        </div>
      </div>
    </div>
  )
}

export default OnboardingPage
