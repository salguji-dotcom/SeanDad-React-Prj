import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Button from './Button.jsx';
import { FieldLayoutContext } from './fieldContext.js';
import styles from './SearchPanel.module.css';

const trimValues = (values) =>
  Object.fromEntries(Object.entries(values).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]));

/**
 * 검색 영역 (목록 화면). 한 행 4칸 자동 배치, 입력칸에서 Enter = 조회.
 * defaultValues: 현재 조건(URL), resetValues: [초기화] 시 기본값
 * 자식 입력칸은 name 으로 연결합니다: <FormField label="품목명" name="itemNm"><Input name="itemNm" /></FormField>
 */
export default function SearchPanel({ defaultValues, resetValues, onSearch, children }) {
  const form = useForm({ defaultValues });
  const { reset } = form;
  const key = JSON.stringify(defaultValues);

  // 뒤로가기 등으로 URL 조건이 바뀌면 입력칸도 맞춥니다.
  useEffect(() => {
    reset(JSON.parse(key));
  }, [key, reset]);

  const handleReset = () => reset(resetValues ?? defaultValues);

  return (
    <FormProvider {...form}>
      <form className={styles.panel} onSubmit={form.handleSubmit((v) => onSearch(trimValues(v)))} role="search">
        <FieldLayoutContext.Provider value="search">
          <div className={styles.grid}>{children}</div>
        </FieldLayoutContext.Provider>
        <div className={styles.buttons}>
          <Button onClick={handleReset}>초기화</Button>
          <Button type="submit" variant="primary">
            조회
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
