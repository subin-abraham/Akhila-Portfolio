'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useActionState } from 'react';

import { useTrackPending } from '@/components/AppLoader';
import { useAppToast } from '@/components/AppToast';
import { parseError } from '@/features/admin/lib/parse-error';
import type { AdminActionState } from '@/types/components/admin-shell';

const INITIAL_STATE: AdminActionState = { error: null, success: null };

interface UseAdminActionOptions {
  action: (
    prevState: AdminActionState,
    formData: FormData,
  ) => Promise<AdminActionState>;
  onSuccess?: () => void;
  successFallbackMessage?: string;
  pendingLabel?: string;
}

interface UseAdminActionResult {
  state: AdminActionState;
  formAction: (payload: FormData) => void;
  isPending: boolean;
}

export function useAdminAction({
  action,
  onSuccess,
  successFallbackMessage = 'Saved.',
  pendingLabel = 'Saving…',
}: UseAdminActionOptions): UseAdminActionResult {
  const toast = useAppToast();
  const actionRef = useRef(action);
  const onSuccessRef = useRef(onSuccess);

  useEffect(() => {
    actionRef.current = action;
  }, [action]);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  const boundAction = useCallback(
    async (prevState: AdminActionState, formData: FormData): Promise<AdminActionState> => {
      let result: AdminActionState;

      try {
        result = await actionRef.current(prevState, formData);
      } catch (error) {
        const message = parseError(error);
        window.setTimeout(() => {
          toast.error(message);
        }, 0);
        return { error: message, success: null };
      }

      if (result?.error) {
        const message = parseError(result.error);
        window.setTimeout(() => {
          toast.error(message);
        }, 0);
        return { error: message, success: null };
      }

      const successMessage = result?.success?.trim()
        ? result.success
        : successFallbackMessage;

      window.setTimeout(() => {
        toast.success(successMessage);
        onSuccessRef.current?.();
      }, 0);

      return { error: null, success: successMessage };
    },
    [successFallbackMessage, toast],
  );

  const [state, formAction, isPending] = useActionState(boundAction, INITIAL_STATE);
  useTrackPending(isPending, pendingLabel);

  return { state, formAction, isPending };
}
