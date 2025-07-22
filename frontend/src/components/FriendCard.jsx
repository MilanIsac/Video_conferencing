import { Link } from 'react-router'
import React from 'react'

const FriendCard = ({friend}) => {
  return (
    <div className='card bg-base-200 hover:shadow-md transition-shadow'>
      <div className='card-body p-4'>
        <div className='flex itmes-center gap-3 mb-3'>
          <div className='avatar size-12'>
            <img src={friend.profile_pic} alt={friend.name} />
          </div>
          <h2 className='font-semibold truncate'>{friend.name}</h2>
        </div>

        <Link className='btn btn-outline w-full' to={`/chat/${friend._id}`}>
        Message
        </Link>

      </div>
    </div>
  )
}

export default FriendCard
