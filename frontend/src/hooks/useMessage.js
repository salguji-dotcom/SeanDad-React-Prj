import { useCallback, useMemo } from 'react';
import { msg } from '../constants/messages.js';
import { useUiStore } from '../stores/uiStore.js';

// 메시지 Hook (웹 화면 표준 11장). alert()/confirm() 대신 사용합니다.

/** const confirm = useConfirm(); if (await confirm('C001')) ... */
export function useConfirm() {
  const openDialog = useUiStore((s) => s.openDialog);
  return useCallback(
    (code, { danger = false, args = [] } = {}) =>
      openDialog({ kind: 'confirm', text: msg(code, ...args), danger }),
    [openDialog],
  );
}

/** const alert = useAlert(); await alert('W004') */
export function useAlert() {
  const openDialog = useUiStore((s) => s.openDialog);
  return useCallback((code, ...args) => openDialog({ kind: 'alert', text: msg(code, ...args) }), [openDialog]);
}

/** const toast = useToast(); toast.success('I001') */
export function useToast() {
  const showToast = useUiStore((s) => s.showToast);
  return useMemo(
    () => ({
      success: (code, ...args) => showToast('success', msg(code, ...args)),
      info: (code, ...args) => showToast('info', msg(code, ...args)),
    }),
    [showToast],
  );
}
