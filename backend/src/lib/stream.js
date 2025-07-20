import { StreamChat } from 'stream-chat';
import dotenv from 'dotenv';


dotenv.config();

const api_key = process.env.STEAM_API_KEY;
const api_secret = process.env.STEAM_API_SECRET;

if(!api_key || !api_secret) {
  console.error('Stream API key and secret must be provided in the environment variables.');
}

const streamClient = StreamChat.getInstance(api_key, api_secret);

export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUsers([userData])
    return userData;
  }
  catch (error) {
    console.error('Error upserting Stream user:', error);
    throw error;
  }
}

export const generateStreamToken = async (userId) => {
   try {
    const userIdStr = userId.toString();
    return streamClient.createToken(userIdStr);
   } catch (error) {
    console.error("Error generating stream token: ", error);
   }
}