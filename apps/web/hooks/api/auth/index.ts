import { trpc } from "~/trpc/client";

export const useGetUser = (clerkId?: string) => {
  const {
    data: getUserData,
    isError,
    isLoading,
    isPending,
    error,
    failureCount,
  } = trpc.user.getUserByClerkId.useQuery(
    { clerkId: clerkId ?? "" },
    { enabled: Boolean(clerkId) },
  );

  return {
    getUserData,
    isError,
    isLoading,
    isPending,
    error,
    failureCount,
  };
};
