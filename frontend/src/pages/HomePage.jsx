import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { getOutgoingFriendRequests, getRecommendedUsers, getUserFriends, sendFriendRequest } from '../lib/api';
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from 'lucide-react';
import { Link } from 'react-router-dom'
import FriendCard from '../components/FriendCard';
import NoFriendsFound from '../components/NoFriendsFound';
import NoRecommendedUsers from '../components/NoRecommendedUsers';

const HomePage = () => {

  const queryClient = useQueryClient();
  const [outGoingRequestId, setOutGoingRequest] = useState(new Set())

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ['friends'],
    queryFn: getUserFriends
  })

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: getRecommendedUsers
  })

  const { data: outgoingFriendRequests } = useQuery({
    queryKey: ['outgoingFriendRequests'],
    queryFn: getOutgoingFriendRequests
  })

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['outgoingFriendRequests'] })
  })

  useEffect(() => {
    const outgoingIds = new Set()
    if (outgoingFriendRequests && outgoingFriendRequests.length > 0) {
      outgoingFriendRequests.forEach((req) => {
        outgoingIds.add(req.recipient._id)
      })
      setOutGoingRequest(outgoingIds)
    }
  })

  // useEffect(() => {
  //   const outgoingIds = new Set();
  //   if (outgoingFriendRequests && outgoingFriendRequests.length > 0) {
  //     outgoingFriendRequests.forEach((req) => {
  //       outgoingIds.add(req.id);
  //     });
  //     setOutGoingRequest(outgoingIds);
  //   }
  // }, [outgoingFriendRequests]);


  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className='container mx-auto space-y-10'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>Your Friends</h2>
          <Link to='/notifications' className='btn btn-outline btn-sm'>
            <UsersIcon className='mr-2 size-4' />Friend Requests
          </Link>
        </div>

        {loadingFriends ? (
          <div className='flex justify-center py-12'>
            <span className='loading loading-spinner loading-lg' />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div>
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        <section>
          <div className='mb-6 sm:mb-8'>
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
              <div>
                <h2 className='text-2xl sm:text-3xl font-bold tracking-light'>
                  Recommended Users
                </h2>
                <p className='opacity-60'>
                  People you might want to connect with
                </p>
              </div>
            </div>
          </div>

          {loadingUsers ? (
            <div className='flex justify-center py-12'>
              <span className='loading loading-spinner loading-lg' />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <NoRecommendedUsers />
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {recommendedUsers.map((user) => {
                const requestSent = outGoingRequestId.has(user._id);

                return (
                  <div key={user._id} className='card bg-base-200 hover:shadow-lg transition-all duration-300'>
                    <div className='card-body p-5 space-y-4'>
                      <div className='flex items-center gap-3'>
                        <div className='avatar size-16 rounded-full'>
                          <img src={user.profile_pic} alt={user.username} />
                        </div>

                        <div>
                          <h3 className='font-semibold text-lg'>
                            {user.username}
                          </h3>

                          {user.location && (
                            <div className='flex items-center text-xs opacity-70 mt-1'>
                              <MapPinIcon className='size-3 mr-1' />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      <button className={`btn w-full mt-2 ${ requestSent ? 'btn-disabled' : 'btn-primary'}`}
                      onClick={() => sendRequestMutation(user._id)}
                      disabled={requestSent || isPending}>
                        {requestSent ? (
                          <>
                          <CheckCircleIcon className='size-4 mr-2'/>
                          Request Sent
                          </>
                        ) : (
                          <>
                          <UserPlusIcon className='size-4 mr-2'/>
                          Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

      </div>
    </div>
  )
}

export default HomePage
