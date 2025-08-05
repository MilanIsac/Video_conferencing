import React from 'react'
import { Link, useParams } from 'react-router'
import useAuthUser from '../hooks/useAuthUser';
import { useQuery } from '@tanstack/react-query';
import PageLoader from '../components/PageLoader';
import { MapPinIcon, MessageSquareIcon, UserPlusIcon } from 'lucide-react';
import { getUserProfile } from '../lib/api';

const ProfilePage = () => {

    const { userId } = useParams();
    const { authUser } = useAuthUser();

    const isOwnUserProfile = !userId || userId === authUser._id;

    const { data: profile, isLoading, error } = useQuery({
        queryKey: ['userProfile', userId || authUser._id],
        queryFn: getUserProfile(userId || authUser._id),
    });

    if (isLoading) {
        return <PageLoader />
    }
    if (error) {
        return <div className='text-center text-error'>Error Loading Profile</div>
    }

    return (
        <div className='max-w-3xl mx-auto p-6 space-y-6'>
            <div className='flex items-center gap-6'>
                <div className='avatar size-24 rounded-full overflow-hidden'>
                    <img src={profile.profile_pic} alt={profile.username} />
                </div>

                <div>
                    <h1 className='text-3xl font-bold'>
                        {profile.username}
                    </h1>

                    {profile.location && (
                        <div className='flex items-center text-sm opacity-70 mt-1'>
                            <MapPinIcon className='size-4 mr-1' />
                        </div>
                    )}
                </div>
            </div>

            {profile.bio && (
                <div className='bg-base-200 p-4 rounded-lg'>
                    <h2 className='font-semibold mb-2'>Bio</h2>
                    <p className='opacity-80'>{profile.bio}</p>
                </div>
            )}

            {!isOwnUserProfile && (
                <div className='flex gap-4'>
                    <Link to={`/chat/${profile._id}`} className='btn btn-primary'>
                    <MessageSquareIcon className='size-4 mr-2' />
                    Message
                    </Link>

                    <button className='btn btn-outline'>
                        <UserPlusIcon className='size-4 mr-2' />
                        Add Friend
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProfilePage
