import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { setServerErrors } from '../../../api/client.js';
import { useItem, useSaveItem } from '../../../api/pr/itemQueries.js';
import Button from '../../../components/common/Button.jsx';
import Card from '../../../components/common/Card.jsx';
import CodeRadio from '../../../components/common/CodeRadio.jsx';
import FormField from '../../../components/common/FormField.jsx';
import Input from '../../../components/common/Input.jsx';
import Textarea from '../../../components/common/Textarea.jsx';
import PageHeader from '../../../components/layout/PageHeader.jsx';
import { CODE_GROUP } from '../../../constants/codes.js';
import { ROUTES, itemPath } from '../../../constants/routes.js';
import { useDirtyGuard } from '../../../hooks/useDirtyGuard.js';
import { useConfirm, useToast } from '../../../hooks/useMessage.js';
import { fmtDateTime, fmtText } from '../../../utils/format.js';
import { ITEM_DEFAULTS, ITEM_MAX, itemSchema } from './itemSchema.js';

const SCREEN_ID = 'PR0101R';

/** 품목 등록·수정 (URL 의 :itemSn 유무로 모드 구분) */
export default function PR0101R() {
  const { itemSn } = useParams();
  const isEdit = Boolean(itemSn);
  const { state } = useLocation();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const toast = useToast();
  const { data: item, error } = useItem(itemSn);
  const saveItem = useSaveItem();
  const listUrl = `${ROUTES.ITEMS}${state?.listSearch ?? ''}`;

  const form = useForm({ resolver: zodResolver(itemSchema), mode: 'onBlur', defaultValues: ITEM_DEFAULTS });
  const { reset, handleSubmit, setError, formState } = form;
  const allowLeave = useDirtyGuard(formState.isDirty);

  useEffect(() => {
    if (item) reset({ itemNm: item.itemNm, useYn: item.useYn, itemCn: item.itemCn ?? '' });
  }, [item, reset]);

  useEffect(() => {
    if (error?.response?.status === 404) navigate(listUrl, { replace: true });
  }, [error, listUrl, navigate]);

  // 저장: 전체 검증(첫 오류 칸 포커스는 React Hook Form 이 처리) → C001 확인 → 저장 → I001
  const handleSave = async (values) => {
    if (!(await confirm('C001'))) return;
    try {
      const saved = await saveItem.mutateAsync({ itemSn, body: values });
      allowLeave();
      toast.success('I001');
      navigate(itemPath(saved.itemSn), { replace: true, state });
    } catch (e) {
      setServerErrors(e, setError);
    }
  };

  const handleCancelClick = () => navigate(isEdit ? itemPath(itemSn) : listUrl, { state });

  return (
    <>
      <PageHeader title={isEdit ? '품목 수정' : '품목 등록'} screenId={SCREEN_ID} />
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(handleSave)} noValidate>
          <Card
            title="기본정보"
            fields
            meta={item && `등록일시 ${fmtDateTime(item.regDt)} · 수정일시 ${fmtDateTime(item.mdfcnDt)}`}
            footer={
              <>
                <Button onClick={handleCancelClick}>취소</Button>
                <Button type="submit" variant="primary" loading={saveItem.isPending} disabled={isEdit && !item}>
                  저장
                </Button>
              </>
            }
          >
            <FormField label="품목일련번호">{fmtText(item?.itemSn)}</FormField>
            <FormField label="사용여부" name="useYn" required>
              <CodeRadio name="useYn" codeGroup={CODE_GROUP.USE_YN} />
            </FormField>
            <FormField label="품목명" name="itemNm" required full>
              <Input name="itemNm" maxLength={ITEM_MAX.itemNm} />
            </FormField>
            <FormField label="품목내용" name="itemCn" full>
              <Textarea name="itemCn" maxLength={ITEM_MAX.itemCn} rows={6} />
            </FormField>
          </Card>
        </form>
      </FormProvider>
    </>
  );
}
