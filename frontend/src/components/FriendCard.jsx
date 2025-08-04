import { Link } from 'react-router-dom';

const FriendCard = ({ friend }) => {
  return (
    <div className='card bg-base-200 hover:shadow-md transition-shadow'>
      <div className='card-body p-4'>
        <div className='flex items-center gap-3 mb-3'>
          <div className='avatar'>
            <div className='w-12 rounded-full overflow-hidden'>
              <img src={friend.profile_pic} alt={friend.username} />
            </div>
          </div>
          <div>
            <h2 className='font-semibold truncate'>{friend.username}</h2>
            <p className='text-sm text-gray-500'>{friend.location}</p>
          </div>
        </div>

        <Link className='btn btn-outline w-full' to={`/chat/${friend._id}`}>
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;

