import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import useAuthUser from '../hooks/useAuthUser';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api';

import {
  Channel,
  ChannelHeader,
  Chat,
  Message,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import ChatLoader from '../components/ChatLoader';
import CallButton from '../components/CallButton';
import { toast } from 'react-hot-toast';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {

  const { id: targetUserId } = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
    enabled: !!authUser // this will run only whne auth user is available
  });

  useEffect(() => {
    const initChat = async () => {
      if (!authUser || !tokenData?.token) {
        return;
      }

      console.log("Stream tokenData:", tokenData);

      const token = tokenData.token;

      try {
        console.log("Initializing stream chat cient...")
        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser({
          id: authUser._id,
          name: authUser.username,
          image: authUser.profile_pic,
        }, token)

        const channelId = [authUser._id, targetUserId].sort().join("-");

        const currChannel = client.channel('messaging', channelId, {
          members: [authUser._id, targetUserId],
        });
        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);

      }
      catch (error) {
        console.error("Error initializing chat", error);
        toast.error("Could not connect to chat. Please try again");
      }
      finally {
        setLoading(false);
      }
    };

    initChat();

  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've a started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully");
    }
  }

  if (loading || !chatClient || !channel) {
    return <ChatLoader />
  }

  // return (
  //   <div className='h-[calc(100vh-4rem)]'>
  //     <Chat client={chatClient}>
  //       <Channel channel={channel}>
  //         <div className='w-full realtive'>
  //           <CallButton handleVideoCall={handleVideoCall} />
  //           <Window>
  //             <ChannelHeader />
  //             <MessageList />
  //             <MessageInput focus/>
  //           </Window>
  //         </div>
  //       </Channel>
  //     </Chat>
  //   </div>
  // )

  return (
    <div className='h-[calc(100vh-4rem)]'> {/* avoid overlapping the sticky navbar */}
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className='w-full relative'>
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
        </Channel>
      </Chat>
    </div>
  )

}

export default ChatPage
