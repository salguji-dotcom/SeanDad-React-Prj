import { create } from 'zustand';

// 전역 UI 상태: 토스트, 확인·알림 대화상자, LNB 접힘 (서버 데이터는 두지 않습니다)

let seq = 0;
const nextId = () => {
  seq += 1;
  return seq;
};

const TOAST_DURATION_MS = 3000;

export const useUiStore = create((set, get) => ({
  lnbCollapsed: false,
  toggleLnb: () => set((s) => ({ lnbCollapsed: !s.lnbCollapsed })),

  toasts: [],
  showToast: (type, text) => {
    const id = nextId();
    set((s) => ({ toasts: [...s.toasts, { id, type, text }] }));
    setTimeout(() => get().closeToast(id), TOAST_DURATION_MS);
  },
  closeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  /** kind: confirm([취소][확인]) | alert([확인]). 결과는 Promise<boolean> */
  dialogs: [],
  openDialog: ({ kind, text, danger = false }) =>
    new Promise((resolve) => {
      const id = nextId();
      set((s) => ({ dialogs: [...s.dialogs, { id, kind, text, danger, resolve }] }));
    }),
  closeDialog: (id, result) => {
    const dialog = get().dialogs.find((d) => d.id === id);
    set((s) => ({ dialogs: s.dialogs.filter((d) => d.id !== id) }));
    dialog?.resolve(result);
  },
}));

/** 컴포넌트 밖(client.js 인터셉터 등)에서 알림 대화상자 띄우기 */
export const openAlert = (text) => useUiStore.getState().openDialog({ kind: 'alert', text });
