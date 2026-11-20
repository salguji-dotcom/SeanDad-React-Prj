import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useStdImport, useStdSummary } from '../../../api/sy/stdQueries.js';
import Button from '../../../components/common/Button.jsx';
import Card from '../../../components/common/Card.jsx';
import FileInput from '../../../components/common/FileInput.jsx';
import FormField from '../../../components/common/FormField.jsx';
import PageHeader from '../../../components/layout/PageHeader.jsx';
import { msg } from '../../../constants/messages.js';
import { ROUTES } from '../../../constants/routes.js';
import { useDirtyGuard } from '../../../hooks/useDirtyGuard.js';
import { useAlert, useConfirm, useToast } from '../../../hooks/useMessage.js';
import { fmtNumber } from '../../../utils/format.js';
import { UPLOAD_FIELDS, firstFile, hasAnyFile, stdUploadSchema } from './stdUploadSchema.js';

const SCREEN_ID = 'SY0104R';

const countText = (n) => (n === undefined ? fmtNumber(n) : `${fmtNumber(n)}건`);

/** 표준 사전 업로드: 공통표준 엑셀(용어·단어·도메인)을 올려 사전을 교체합니다. */
export default function SY0104R() {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const alert = useAlert();
  const toast = useToast();
  const { data: summary } = useStdSummary();
  const stdImport = useStdImport();

  const form = useForm({ resolver: zodResolver(stdUploadSchema), mode: 'onChange' });
  const { handleSubmit, reset, formState } = form;
  useDirtyGuard(formState.isDirty && !stdImport.isPending);

  const handleSave = async (values) => {
    if (!hasAnyFile(values)) {
      await alert('W004');
      return;
    }
    if (!(await confirm('C001'))) return;
    const files = Object.fromEntries(UPLOAD_FIELDS.map((f) => [f.name, firstFile(values[f.name])]));
    try {
      await stdImport.mutateAsync(files);
    } catch {
      return; // 오류 안내는 client.js 가 이미 했습니다.
    }
    reset();
    toast.success('I001');
  };

  const handleCancelClick = () => navigate(ROUTES.STD_TERMS);

  return (
    <>
      <PageHeader title="표준 사전 업로드" screenId={SCREEN_ID} />
      <Card title="사전 현황" fields>
        <FormField label="표준용어">{countText(summary?.trmCnt)}</FormField>
        <FormField label="표준단어">{countText(summary?.wordCnt)}</FormField>
        <FormField label="표준도메인">{countText(summary?.dmnCnt)}</FormField>
      </Card>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(handleSave)} noValidate>
          <Card
            title="엑셀 파일"
            fields
            meta={msg('I006')}
            footer={
              <>
                <Button onClick={handleCancelClick}>취소</Button>
                <Button type="submit" variant="primary" loading={stdImport.isPending}>
                  저장
                </Button>
              </>
            }
          >
            {UPLOAD_FIELDS.map((f) => (
              <FormField key={f.name} label={f.label} name={f.name} help={`예) ${f.sample}`} full>
                <FileInput name={f.name} accept=".xlsx" />
              </FormField>
            ))}
          </Card>
        </form>
      </FormProvider>
    </>
  );
}
