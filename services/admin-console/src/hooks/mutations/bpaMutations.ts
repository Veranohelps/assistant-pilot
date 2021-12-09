import { useMutation, UseMutationOptions, useQueryClient } from 'react-query';
import {
  createBpaProviderService,
  createBpaReportService,
  createBpaZoneService,
  deleteBpaReportService,
  updateBpaProviderService,
  updateBpaReportService,
  updateBpaZoneService,
} from '../../services/bpaService';
import {
  ICreatBpaReportPayload,
  ICreateBpaProviderPayload,
  ICreateBpaProviderResponse,
  ICreateBpaReportResponse,
  ICreateBpaZonePayload,
  ICreateBpaZoneResponse,
} from '../../types/bpa';
import { IBaseResponse } from '../../types/request';

type TMutationOptions<T1, T2, T3> = Omit<UseMutationOptions<T1, unknown, T2, T3>, 'mutationFn'>;

export const useDeleteBpaReport = <C = unknown>(
  options?: TMutationOptions<IBaseResponse, string, C>
) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(deleteBpaReportService, {
    ...(options && options),
    onSuccess: (...args) => {
      queryClient.invalidateQueries(['bpa']);
      options?.onSuccess?.(...args);
    },
  });

  return mutation;
};

export const useCreateBpaReport = <C = unknown>(
  options?: TMutationOptions<ICreateBpaReportResponse['data'], ICreatBpaReportPayload, C>
) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(createBpaReportService, {
    ...(options && options),
    onSuccess: (...args) => {
      queryClient.invalidateQueries(['bpa']);
      options?.onSuccess?.(...args);
    },
  });

  return mutation;
};

export const useUpdateBpaReport = <C = unknown>(
  id: string,
  options?: TMutationOptions<ICreateBpaReportResponse['data'], Partial<ICreatBpaReportPayload>, C>
) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (payload: Partial<ICreatBpaReportPayload>) => updateBpaReportService(id, payload),
    {
      ...(options && options),
      onSuccess: (...args) => {
        queryClient.invalidateQueries(['bpa']);
        options?.onSuccess?.(...args);
      },
    }
  );

  return mutation;
};

export const useCreateBpaProvider = <C = unknown>(
  options?: TMutationOptions<ICreateBpaProviderResponse['data'], ICreateBpaProviderPayload, C>
) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(createBpaProviderService, {
    ...(options && options),
    onSuccess: (...args) => {
      queryClient.invalidateQueries(['bpa']);
      options?.onSuccess?.(...args);
    },
  });

  return mutation;
};

export const useUpdateBpaPRovider = <C = unknown>(
  id: string,
  options?: TMutationOptions<
    ICreateBpaProviderResponse['data'],
    Partial<ICreateBpaProviderPayload>,
    C
  >
) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (payload: Partial<ICreateBpaProviderPayload>) => updateBpaProviderService(id, payload),
    {
      ...(options && options),
      onSuccess: (...args) => {
        queryClient.invalidateQueries(['bpa']);
        options?.onSuccess?.(...args);
      },
    }
  );

  return mutation;
};

export const useCreateBpaZone = <C = unknown>(
  options?: TMutationOptions<ICreateBpaZoneResponse['data'], ICreateBpaZonePayload, C>
) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(createBpaZoneService, {
    ...(options && options),
    onSuccess: (...args) => {
      queryClient.invalidateQueries(['bpa']);
      options?.onSuccess?.(...args);
    },
  });

  return mutation;
};

export const useUpdateBpaZone = <C = unknown>(
  id: string,
  options?: TMutationOptions<ICreateBpaZoneResponse['data'], Partial<ICreateBpaZonePayload>, C>
) => {
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (payload: Partial<ICreateBpaZonePayload>) => updateBpaZoneService(id, payload),
    {
      ...(options && options),
      onSuccess: (...args) => {
        queryClient.invalidateQueries(['bpa']);
        options?.onSuccess?.(...args);
      },
    }
  );

  return mutation;
};
