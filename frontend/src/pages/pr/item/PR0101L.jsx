import { useLocation, useNavigate } from 'react-router-dom';
import { useItemList } from '../../../api/pr/itemQueries.js';
import Button from '../../../components/common/Button.jsx';
import Card from '../../../components/common/Card.jsx';
import CodeSelect from '../../../components/common/CodeSelect.jsx';
import DataGrid from '../../../components/common/DataGrid.jsx';
import FormField from '../../../components/common/FormField.jsx';
import GridToolbar from '../../../components/common/GridToolbar.jsx';
import Input from '../../../components/common/Input.jsx';
import Pagination from '../../../components/common/Pagination.jsx';
import SearchPanel from '../../../components/common/SearchPanel.jsx';
import StatusBadge from '../../../components/common/StatusBadge.jsx';
import PageHeader from '../../../components/layout/PageHeader.jsx';
import { CODE_GROUP, DEFAULT_PAGE_SIZE } from '../../../constants/codes.js';
import { ITEM_NEW_PATH, itemPath } from '../../../constants/routes.js';
import { usePermission } from '../../../hooks/usePermission.js';
import { useSearchParamsState } from '../../../hooks/useSearchParamsState.js';
import { ITEM_MAX } from './itemSchema.js';

const SCREEN_ID = 'PR0101L';

const columns = [
  { field: 'rowNo', header: 'No', width: 60, align: 'center' },
  { field: 'itemSn', header: '품목일련번호', width: 120, align: 'center', sortable: true },
  { field: 'itemNm', header: '품목명', minWidth: 200, sortable: true },
  { field: 'useYn', header: '사용여부', width: 100, align: 'center', render: (v) => <StatusBadge group={CODE_GROUP.USE_YN} value={v} /> },
  { field: 'mdfcnDt', header: '수정일시', width: 170, align: 'center', format: 'datetime' },
  { field: 'regDt', header: '등록일시', width: 170, align: 'center', format: 'datetime', sortable: true },
];

const SEARCH_DEFAULTS = { itemNm: '', useYn: '' };
const DEFAULT_PARAMS = { ...SEARCH_DEFAULTS, page: 1, size: DEFAULT_PAGE_SIZE, sort: 'regDt,desc' };

/** 품목 목록 */
export default function PR0101L() {
  const [params, setParams] = useSearchParamsState(DEFAULT_PARAMS);
  const { data, isFetching } = useItemList(params);
  const { canCreate } = usePermission(SCREEN_ID);
  const navigate = useNavigate();
  const { search } = useLocation();

  const handleNewClick = () => navigate(ITEM_NEW_PATH, { state: { listSearch: search } });
  const newButton = canCreate && (
    <Button variant="primary" onClick={handleNewClick}>
      신규
    </Button>
  );
  const isFirstEmpty = data?.totalCount === 0 && !params.itemNm && !params.useYn;

  return (
    <>
      <PageHeader title="품목" screenId={SCREEN_ID} />
      <SearchPanel
        defaultValues={{ itemNm: params.itemNm, useYn: params.useYn }}
        resetValues={SEARCH_DEFAULTS}
        onSearch={(v) => setParams({ ...params, ...v, page: 1 })}
      >
        <FormField label="품목명" name="itemNm">
          <Input name="itemNm" maxLength={ITEM_MAX.itemNm} width="full" />
        </FormField>
        <FormField label="사용여부" name="useYn">
          <CodeSelect name="useYn" codeGroup={CODE_GROUP.USE_YN} allOption />
        </FormField>
      </SearchPanel>
      <Card>
        <GridToolbar total={data?.totalCount}>{newButton}</GridToolbar>
        <DataGrid
          columns={columns}
          rows={data?.list}
          rowKey="itemSn"
          loading={isFetching}
          page={params.page}
          size={params.size}
          sort={params.sort}
          onSortChange={(sort) => setParams({ ...params, sort, page: 1 })}
          onRowClick={(row) => navigate(itemPath(row.itemSn), { state: { listSearch: search } })}
          emptyAction={isFirstEmpty && newButton}
        />
        <Pagination
          page={params.page}
          size={params.size}
          total={data?.totalCount}
          onChange={(page, size) => setParams({ ...params, page, size })}
        />
      </Card>
    </>
  );
}
