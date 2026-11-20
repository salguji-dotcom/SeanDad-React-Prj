import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDeleteItem, useItem } from '../../../api/pr/itemQueries.js';
import Button from '../../../components/common/Button.jsx';
import Card from '../../../components/common/Card.jsx';
import FormField from '../../../components/common/FormField.jsx';
import StatusBadge from '../../../components/common/StatusBadge.jsx';
import PageHeader from '../../../components/layout/PageHeader.jsx';
import { CODE_GROUP } from '../../../constants/codes.js';
import { ROUTES, itemEditPath } from '../../../constants/routes.js';
import { useConfirm, useToast } from '../../../hooks/useMessage.js';
import { usePermission } from '../../../hooks/usePermission.js';
import { fmtDateTime, fmtText } from '../../../utils/format.js';

const SCREEN_ID = 'PR0101D';

/** 품목 상세 */
export default function PR0101D() {
  const { itemSn } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { data: item, error } = useItem(itemSn);
  const deleteItem = useDeleteItem();
  const confirm = useConfirm();
  const toast = useToast();
  const { canUpdate, canDelete } = usePermission(SCREEN_ID);
  const listUrl = `${ROUTES.ITEMS}${state?.listSearch ?? ''}`;

  // 404: 안내(E004)는 client.js 가 띄우고, 화면은 목록으로 돌아갑니다 (표준 12장).
  useEffect(() => {
    if (error?.response?.status === 404) navigate(listUrl, { replace: true });
  }, [error, listUrl, navigate]);

  const handleDeleteClick = async () => {
    if (!(await confirm('C002', { danger: true }))) return;
    try {
      await deleteItem.mutateAsync(itemSn);
    } catch {
      return; // 오류 안내는 client.js 가 이미 했습니다.
    }
    toast.success('I002');
    navigate(listUrl);
  };

  return (
    <>
      <PageHeader title="품목 상세" screenId={SCREEN_ID} />
      <Card
        title="기본정보"
        fields
        meta={item && `등록일시 ${fmtDateTime(item.regDt)} · 수정일시 ${fmtDateTime(item.mdfcnDt)}`}
        footerStart={<Button onClick={() => navigate(listUrl)}>목록</Button>}
        footer={
          <>
            {canDelete && (
              <Button variant="danger" onClick={handleDeleteClick} loading={deleteItem.isPending} disabled={!item}>
                삭제
              </Button>
            )}
            {canUpdate && (
              <Button onClick={() => navigate(itemEditPath(itemSn), { state })} disabled={!item}>
                수정
              </Button>
            )}
          </>
        }
      >
        <FormField label="품목일련번호">{fmtText(item?.itemSn)}</FormField>
        <FormField label="사용여부">
          <StatusBadge group={CODE_GROUP.USE_YN} value={item?.useYn} />
        </FormField>
        <FormField label="품목명" full>
          {fmtText(item?.itemNm)}
        </FormField>
        <FormField label="품목내용" full>
          {fmtText(item?.itemCn)}
        </FormField>
      </Card>
    </>
  );
}
