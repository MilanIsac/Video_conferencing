import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import useAuthUser from '../hooks/useAuthUser';
import { getStreamToken } from '../lib/api';

import '@stream-io/video-react-sdk/dist/css/styles.css'
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import toast from 'react-hot-toast';
import PageLoader from '../components/PageLoader';
import { useQuery } from '@tanstack/react-query';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY


const CallPage = () => {

  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [connecting, setConnecting] = useState(true);

  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ['streamtoken'],
    queryFn: getStreamToken,
    enabled: !!authUser,
  })

  useEffect(() => {

    const initCall = async () => {
      if (!tokenData.token || !authUser || !callId) {
        return;
      }

      try {
        console.log('Initializing Stream video client')

        const user = {
          id: authUser._id,
          name: authUser.username,
          image: authUser.image
        }

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        })

        const callInstance = videoClient.call('default', callId);
        await callInstance.join({ create: true })

        console.log('Joined call successfully');

        setClient(videoClient);
        setCall(callInstance)

      } catch (error) {
        console.error('Error joining call: ', error)
        toast.error('Could not join the call. Please try again');
      }
      finally {
        setConnecting(false);
      }
    };

    initCall();
  }, [tokenData, authUser, callId])

  if (isLoading || connecting) {
    return <PageLoader />
  }

  return (
    <div>
      <div>
        {client && call ? (
          <StreamVideo call={call}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className='flex items-center justify-center h-full'>
            <p>Could not initialize call. Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  )
}

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks()
  const callingState = useCallCallingState()

  const navigate = useNavigate()

  if(callingState === CallingState.LEFT){
    return navigate('/');
  }

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  )
}

export default CallPage
