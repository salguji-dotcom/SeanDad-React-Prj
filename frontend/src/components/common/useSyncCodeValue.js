import { useEffect } from 'react';

/** 공통코드 옵션이 늦게 도착해도 폼 값이 선택 상태로 보이도록 다시 반영합니다. */
export function useSyncCodeValue(form, name, codes) {
  useEffect(() => {
    if (form && name && codes.length) {
      form.setValue(name, form.getValues(name), { shouldDirty: false });
    }
  }, [form, name, codes]);
}
