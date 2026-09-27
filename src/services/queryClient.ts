import { QueryClient } from '@tanstack/react-query';

import { isServiceError } from './errors';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retrying cannot fix a denied permission or bad input, so only retry other failures.
      retry: (failureCount, error) => {
        if (
          isServiceError(error) &&
          (error.code === 'permission_denied' || error.code === 'invalid_input')
        ) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});
