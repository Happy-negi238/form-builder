import { trpc } from "~/trpc/client";

export const useCreateUser = () => {
  const {
    mutateAsync: createUserWithClerkIdAsync,
    mutate: createUserWithClerkId,
    error,
    isError,
    failureCount,
    isIdle,
    isSuccess,
    status,
  } = trpc.user.createUserWithClerkId.useMutation()

  return {
    createUserWithClerkIdAsync,
    createUserWithClerkId,
    error,
    isError,
    failureCount,
    isIdle,
    isSuccess,
    status,
  };
};
