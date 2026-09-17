import { trpc } from "~/trpc/client";

// Template hooks
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

export const useGetAllTemplates = () => {
  const {
    data: getAllTemplatesData,
    isError,
    isPaused,
    isPending,
    isSuccess,
    error,
    failureCount,
  } = trpc.template.getAllTemplates.useQuery();

  return {
    getAllTemplatesData,
    isError,
    isPaused,
    isPending,
    isSuccess,
    error,
    failureCount,
  };
};

export const useGetTemplateById = (templateId?: string) => {
  const {
    data: getTemplateByIdData,
    isError,
    isPaused,
    isPending,
    isSuccess,
    error,
    failureCount,
  } = trpc.template.getTemplateById.useQuery(
    { templateId: templateId ?? "" },
    { enabled: Boolean(templateId) },
  );

  return {
    getTemplateByIdData,
    isError,
    isPaused,
    isPending,
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

// Template Field hooks
export const useCreateTemplateField = () => {
  const {
    mutateAsync: createTemplateFieldAsync,
    mutate: createTemplateField,
    isError,
    isPaused,
    isPending,
    isIdle,
    isSuccess,
    error,
    failureCount,
  } = trpc.template.createTemplateField.useMutation();

  return {
    createTemplateFieldAsync,
    createTemplateField,
    isError,
    isPaused,
    isPending,
    isIdle,
    isSuccess,
    error,
    failureCount,
  };
};

export const useDeleteTemplateField = () => {
  const {
    mutateAsync: deleteTemplateFieldAsync,
    mutate: deleteTemplateField,
    isError,
    isPaused,
    isPending,
    isIdle,
    isSuccess,
    error,
    failureCount,
  } = trpc.template.deleteTemplateField.useMutation();

  return {
    deleteTemplateFieldAsync,
    deleteTemplateField,
    isError,
    isPaused,
    isPending,
    isIdle,
    isSuccess,
    error,
    failureCount,
  };
};
