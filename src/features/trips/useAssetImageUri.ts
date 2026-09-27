import { useQuery } from '@tanstack/react-query';

import type { ServiceError } from '@/services/errors';
import { getAssetImageUri } from '@/services/photos';

/** Displayable URI for a media library asset; idle when there is no asset id. */
export function useAssetImageUri(assetId: string | null) {
  return useQuery<string, ServiceError>({
    queryKey: ['assetImageUri', assetId],
    queryFn: () => getAssetImageUri(assetId as string),
    enabled: assetId !== null,
    staleTime: Infinity,
  });
}
