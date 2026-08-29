import { trpc } from "~/trpc/client";

// FORM HOOKS
export const useGetFromById = (formId: string) => {
  const {
    data: getFromByIdData,
    isPending,
    isError,
    isFetched,
    isFetching,
    status,
    isSuccess,
    failureCount,
  } = trpc.form.getFromById.useQuery({ formId });

  return {
    getFromByIdData,
    isPending,
    isError,
    isFetched,
    isFetching,
    status,
    isSuccess,
    failureCount,
  };
};

export const useCreateForm = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: createFormAsync,
    mutate: createForm,
    error,
    isError,
    failureCount,
    isIdle,
    isSuccess,
    status,
    isPending,
  } = trpc.form.createForm.useMutation({
    onSuccess: async () => {
      await utils.form.invalidate();
    },
  });

  return {
    createFormAsync,
    createForm,
    error,
    isError,
    failureCount,
    isIdle,
    isSuccess,
    status,
    isPending,
  };
};

export const useListForm = () => {
  const {
    data: forms,
    error,
    isFetched,
    isFetching,
    isError,
    failureCount,
    isPending,
    status,
    isSuccess,
  } = trpc.form.listFormByUserId.useQuery();

  return {
    forms,
    error,
    isFetched,
    isFetching,
    isError,
    failureCount,
    isPending,
    status,
    isSuccess,
  };
};

export const useDeleteForm = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: deleteFormAsync,
    mutate: deleteForm,
    isError,
    failureCount,
    status,
    isSuccess,
    isPending,
  } = trpc.form.deleteForm.useMutation({
    onSuccess: async () => {
      await utils.form.listFormByUserId.invalidate();
    },
  });

  return { deleteFormAsync, deleteForm, isError, failureCount, status, isSuccess, isPending };
};

// FORM FIELD HOOKS
export const useGetAllFormField = (formId: string) => {
  const {
    data: formFields,
    error,
    isFetched,
    isFetching,
    isError,
    failureCount,
    isPending,
    status,
    isSuccess,
  } = trpc.form.getFormField.useQuery({ formId });

  return {
    formFields,
    error,
    isFetched,
    isFetching,
    isError,
    failureCount,
    isPending,
    status,
    isSuccess,
  };
};

export const useCreatFormField = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: creatFormFieldAsync,
    mutate: creatFormField,
    error,
    isError,
    failureCount,
    isIdle,
    isSuccess,
    status,
    isPending,
  } = trpc.form.createFormField.useMutation({
    onSuccess: async () => {
      await utils.form.getFormField.invalidate();
    },
  });

  return {
    creatFormFieldAsync,
    creatFormField,
    error,
    isError,
    failureCount,
    isIdle,
    isSuccess,
    status,
    isPending,
  };
};

export const useUpdateFormField = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: updateFormFieldAsync,
    mutate: updateFormField,
    isError,
    isIdle,
    isPending,
    status,
    error,
    failureCount,
    isSuccess,
  } = trpc.form.updateFormField.useMutation({
    onSuccess: async () => {
      await utils.form.getFormField.invalidate();
    },
  });

  return {
    updateFormFieldAsync,
    updateFormField,
    isError,
    isIdle,
    isPending,
    status,
    error,
    failureCount,
    isSuccess,
  };
};

export const useDeleteFormField = () => {
  const utils = trpc.useUtils();

  const {
    mutateAsync: deleteFormFieldAsync,
    mutate: deleteFormField,
    isError,
    isIdle,
    isPending,
    status,
    error,
    failureCount,
    isSuccess,
  } = trpc.form.deleteFormField.useMutation({
    onSuccess: async () => {
      await utils.form.getFormField.invalidate();
    },
  });

  return {
    deleteFormFieldAsync,
    deleteFormField,
    isError,
    isIdle,
    isPending,
    status,
    error,
    failureCount,
    isSuccess,
  };
};

// FORM SUBMISSION HOOKS
export const useFormSubmission = () => {
  const {
    mutateAsync: formSubmissionAsync,
    mutate: formSubmission,
    isPending,
    isSuccess,
    status,
    isError,
    isIdle,
    error,
    failureCount,
  } = trpc.form.formSubmission.useMutation();

  return {
    formSubmissionAsync,
    formSubmission,
    isPending,
    isSuccess,
    status,
    isError,
    isIdle,
    error,
    failureCount,
  };
};

export const useGetFromSubmissionById = (formId: string) => {
  const {
    data: formSubmissions,
    error,
    isFetched,
    isFetching,
    isError,
    failureCount,
    isPending,
    status,
    isSuccess,
  } = trpc.form.getFormSubmissionById.useQuery({ formId });

  return {
    formSubmissions,
    error,
    isFetched,
    isFetching,
    isError,
    failureCount,
    isPending,
    status,
    isSuccess,
  };
};
