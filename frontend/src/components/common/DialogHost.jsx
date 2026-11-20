import { useUiStore } from '../../stores/uiStore.js';
import Button from './Button.jsx';
import Modal from './Modal.jsx';

/** 확인·알림 대화상자 (useConfirm, useAlert, client.js 오류 안내). 앱에 한 번만 둡니다. */
export default function DialogHost() {
  const dialog = useUiStore((s) => s.dialogs[s.dialogs.length - 1]);
  const closeDialog = useUiStore((s) => s.closeDialog);
  if (!dialog) return null;

  const close = (result) => closeDialog(dialog.id, result);
  const isConfirm = dialog.kind === 'confirm';

  return (
    <Modal
      key={dialog.id}
      open
      size="s"
      title={isConfirm ? '확인' : '알림'}
      onClose={() => close(false)}
      footer={
        <>
          {isConfirm && <Button onClick={() => close(false)}>취소</Button>}
          <Button variant={dialog.danger ? 'danger' : 'primary'} onClick={() => close(true)} data-autofocus="true">
            확인
          </Button>
        </>
      }
    >
      {dialog.text}
    </Modal>
  );
}
