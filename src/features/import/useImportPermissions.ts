import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getCalendarPermission, requestCalendarPermission } from '@/services/calendar';
import type { ServiceError } from '@/services/errors';
import { getHealthPermission, requestHealthPermission } from '@/services/health';
import type { ImportSource } from '@/services/import/types';
import type { PermissionState } from '@/services/permissions';
import { getPhotoPermission, requestPhotoPermission } from '@/services/photos';

const PERMISSION_READERS: Record<ImportSource, () => Promise<PermissionState>> = {
  photos: getPhotoPermission,
  health: getHealthPermission,
  calendar: getCalendarPermission,
};

const PERMISSION_REQUESTERS: Record<ImportSource, () => Promise<PermissionState>> = {
  photos: requestPhotoPermission,
  health: requestHealthPermission,
  calendar: requestCalendarPermission,
};

const permissionKey = (source: ImportSource) => ['permissions', source] as const;

export function useImportPermission(source: ImportSource) {
  return useQuery<PermissionState, ServiceError>({
    queryKey: permissionKey(source),
    queryFn: PERMISSION_READERS[source],
  });
}

/** Shows the system prompt for a source and stores the resulting state. */
export function useRequestImportPermission(source: ImportSource) {
  const queryClient = useQueryClient();
  return useMutation<PermissionState, ServiceError, void>({
    mutationFn: () => PERMISSION_REQUESTERS[source](),
    onSuccess: (state) => queryClient.setQueryData(permissionKey(source), state),
  });
}
