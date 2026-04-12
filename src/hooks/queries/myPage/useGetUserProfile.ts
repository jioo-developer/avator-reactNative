import { getProfile } from "@/api/profile";
import { queryKeys } from "@/constants";
import { useQuery } from "@tanstack/react-query";

function useGetUserProfile(id: number) {
  return useQuery({
    queryFn: () => getProfile(id),
    queryKey: queryKeys.AUTH.GET_USER_PROFILE(id),
  });
}

export default useGetUserProfile;
