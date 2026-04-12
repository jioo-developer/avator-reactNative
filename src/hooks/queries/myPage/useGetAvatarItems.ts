import {
  getBottoms,
  getFaces,
  getHands,
  getHats,
  getSkins,
  getTops,
} from "@/api/avatar";
import { queryKeys } from "@/constants";
import { useQueries } from "@tanstack/react-query";

function useGetAvatarItems() {
  const [
    hatsQuery,
    facesQuery,
    topsQuery,
    bottomsQuery,
    handsQuery,
    skinsQuery,
  ] = useQueries({
    queries: [
      {
        queryFn: getHats,
        queryKey: [...queryKeys.AVATAR.ALL, "hats"],
      },
      {
        queryFn: getFaces,
        queryKey: [...queryKeys.AVATAR.ALL, "faces"],
      },
      {
        queryFn: getTops,
        queryKey: [...queryKeys.AVATAR.ALL, "tops"],
      },
      {
        queryFn: getBottoms,
        queryKey: [...queryKeys.AVATAR.ALL, "bottoms"],
      },
      {
        queryFn: getHands,
        queryKey: [...queryKeys.AVATAR.ALL, "hands"],
      },
      {
        queryFn: getSkins,
        queryKey: [...queryKeys.AVATAR.ALL, "skins"],
      },
    ],
  });

  return {
    hats: hatsQuery.data || [],
    faces: facesQuery.data || [],
    tops: topsQuery.data || [],
    bottoms: bottomsQuery.data || [],
    hands: handsQuery.data || [],
    skins: skinsQuery.data || [],
  };
}

export default useGetAvatarItems;
