import { createContext, useContext } from 'react';
import { useFormContext } from 'react-hook-form';

/** FormField 배치: 'cell'(상세·등록 2열 라벨-값) | 'search'(검색 영역) */
export const FieldLayoutContext = createContext('cell');

export const useFieldLayout = () => useContext(FieldLayoutContext);

export const fieldId = (name) => (name ? `fld-${name}` : undefined);

/**
 * 입력 컴포넌트를 React Hook Form 에 연결합니다.
 * FormProvider(SearchPanel, 등록 화면) 안에서 name 이 있으면 register, 아니면 일반 입력칸으로 동작합니다.
 */
export function useFieldRegister(name, options) {
  const form = useFormContext();
  if (form && name) return { form, ...form.register(name, options), id: fieldId(name) };
  return { form: null, name, id: fieldId(name) };
}
