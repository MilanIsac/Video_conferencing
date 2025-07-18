import { useQuery } from '@tanstack/react-query';
import { getAuthUser } from '../lib/api';
import { User } from 'lucide-react';

const useAuthUser = () => {
    const authUser = useQuery({
        queryKey: ['authUser'],
        queryFn: getAuthUser,
        retry: false // it is used so the req is not made 3 times since tanstack is used
    });

    return { isLoading: authUser.isLoading, authUser: authUser.data?.user }
}

export default useAuthUser
