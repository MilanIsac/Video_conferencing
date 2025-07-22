import React from 'react'

const NoRecommendedUsers = () => {
  return (
    <div className='card bg-base-100 text-center'>
      <h3 className='font-semibold text-lg mb-2'>
        No Recommendations Found
      </h3>
      <p className='text-based-content opacity-70'>
        It seems like there are no recommended users at the moment.
      </p>
    </div>
  )
}

export default NoRecommendedUsers
