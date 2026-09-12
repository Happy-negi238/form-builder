import { trpc } from "~/trpc/client";

export const useCreateTemplate = () => {
  const {
    mutateAsync: createTemplateAsync,
    mutate: createTemplate,
    isError,
    isPaused,
    isPending,
    isIdle,
    isSuccess,
    error,
    failureCount,
  } = trpc.template.createTemplate.useMutation();

  return {
    createTemplateAsync,
    createTemplate,
    isError,
    isPaused,
    isPending,
    isIdle,
    isSuccess,
    error,
    failureCount,
  };
};

export const useDeleteTemplate = () => {
  const {
    mutateAsync: deleteTemplateAsync,
    mutate: deleteTemplate,
    isError,
    isPaused,
    isPending,
    isIdle,
    isSuccess,
    error,
    failureCount,
  } = trpc.template.deleteTemplate.useMutation();

  return {
    deleteTemplateAsync,
    deleteTemplate,
    isError,
    isPaused,
    isPending,
    isIdle,
    isSuccess,
    error,
    failureCount,
  };
};
