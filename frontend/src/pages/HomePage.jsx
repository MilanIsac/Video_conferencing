import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { getOutgoingFriendRequests, getRecommendedUsers, getUserFriends, sendFriendRequest } from '../lib/api';
import { UsersIcon } from 'lucide-react';
import { Link } from 'react-router'
import FriendCard from '../components/FriendCard';
import NoFriendsFound from '../components/NoFriendsFound';

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
        outgoingIds.add(req.id)
      })
      setOutGoingRequest(outgoingIds)
    }
  })

  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className='container mx-auto space-y-10'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>Your Friends</h2>
          <Link to='/notifications' className='btn btn-outline btn-sm'>
            <UsersIcon className='mr-2 size-4'/>Friend Requests
          </Link>
        </div>

        { loadingFriends ? (
          <div className='flex justify-center py-12'>
            <span className='loading loading-spinner loading-lg'/>
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div>
            {friends.map((friend) => (
              <FriendCard key = {friend._id} friend={friend}/>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default HomePage
