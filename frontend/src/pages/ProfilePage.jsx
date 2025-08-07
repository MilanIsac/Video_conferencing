import { Link, useParams } from 'react-router-dom'
import useAuthUser from '../hooks/useAuthUser';
import { useQuery } from '@tanstack/react-query';
import PageLoader from '../components/PageLoader';
import { MapPinIcon, MessageSquareIcon, UserPlusIcon, PencilIcon, BadgeCheckIcon } from 'lucide-react';
import { getUserProfile } from '../lib/api';


const ProfilePage = () => {
    const { id } = useParams();
    const { authUser } = useAuthUser();

    const isOwnUserProfile = !id || id === authUser._id;

    const { data: profile, isLoading, error } = useQuery({
        queryKey: ['userProfile', id || authUser._id],
        queryFn: () => getUserProfile(id || authUser._id),
    });

    if (isLoading) return <PageLoader />
    if (error) return <div className='text-center text-red-500 font-semibold'>Error Loading Profile</div>
    if (!profile) return <div className="text-center">No profile data found.</div>

    return (
        <div className='min-h-screen flex items-center justify-center bg-stone-900'>
            <div className="max-w-xl w-full mx-auto py-10 px-5 flex flex-col gap-8 min-h-[50vh] items-center justify-center bg-gradient-to-b from-blue-900 via-blue-950 to-blue-900 rounded-xl shadow-2xl border border-blue-800 relative">

                {/* --- Avatar & username --- */}
                <div className="flex items-center gap-6 px-2">
                    <div className="relative">
                        <img
                            src={profile.profile_pic}
                            alt={profile.username}
                            className="size-28 rounded-full border-4 border-blue-400 shadow-lg object-cover transition-transform duration-200 hover:scale-105"
                            style={{ background: "#fafbfc" }}
                        />
                        <span
                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-500 px-2 py-0.5 rounded-full text-xs text-white shadow-md font-bold"
                            title="Creative Soul"
                        >
                        </span>
                    </div>
                    <div>
                        <h1 className='text-4xl font-extrabold flex items-center gap-2 text-white drop-shadow-md'>
                            {profile.username}
                            <BadgeCheckIcon className='size-6 text-green-400 ml-1' title="Verified" />
                        </h1>
                        {profile.location && (
                            <div className='flex items-center text-md text-blue-200 mt-1 gap-2'>
                                <MapPinIcon className='size-4 opacity-60' />
                                <span className="font-medium">{profile.location}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* --- Bio Section --- */}
                <div className='bg-blue-950/80 border border-blue-700 backdrop-blur-sm p-6 rounded-xl shadow-md relative overflow-hidden'>
                    {/* <h2 className='font-bold mb-1 text-blue-100 flex gap-2 items-center'>
                    <span role="img" aria-label="notebook">📝</span>
                    Bio
                    {isOwnUserProfile &&
                        <Link to="/profile/edit" className="ml-2 text-blue-400 hover:text-blue-200 transition-all" title="Edit Bio">
                            <PencilIcon className="size-4" />
                        </Link>
                    }
                </h2> */}
                    <p className='italic text-blue-100 opacity-90 text-lg'>
                        {profile.bio || "No bio added yet."}
                    </p>
                </div>

                {/* --- Actions --- */}
                {!isOwnUserProfile && (
                    <div className='flex gap-4 mt-4 items-center justify-center'>
                        <Link to={`/chat/${profile._id}`} className='btn btn-primary shadow-lg transition-all hover:-translate-y-1'>
                            <MessageSquareIcon className='size-4 mr-2' />
                            Message
                        </Link>
                        <button className='btn btn-outline bg-blue-900/70 border-blue-700 text-blue-100 shadow-lg hover:bg-blue-800 hover:text-white'>
                            <UserPlusIcon className='size-4 mr-2' />
                            Add Friend
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
