import { useStdDomainList } from '../../../api/sy/stdQueries.js';
import StatusBadge from '../../../components/common/StatusBadge.jsx';
import PageHeader from '../../../components/layout/PageHeader.jsx';
import { CODE_GROUP } from '../../../constants/codes.js';
import { useSearchParamsState } from '../../../hooks/useSearchParamsState.js';
import StdGridCard from './components/StdGridCard.jsx';
import StdSearchPanel from './components/StdSearchPanel.jsx';
import { STD_DEFAULT_PARAMS } from './stdSearch.js';

const SCREEN_ID = 'SY0103L';

const columns = [
  { field: 'rowNo', header: 'No', width: 60, align: 'center' },
  { field: 'dmnNm', header: '도메인명', width: 140 },
  { field: 'dmnGroupNm', header: '도메인그룹명', width: 120, align: 'center' },
  { field: 'dmnClsfNm', header: '도메인분류명', width: 120, align: 'center' },
  { field: 'dataTypeNm', header: '자료유형명', width: 110, align: 'center' },
  { field: 'dataLen', header: '자료길이', width: 90, align: 'right', format: 'number' },
  { field: 'dataDcptLen', header: '자료소수점길이', width: 120, align: 'right', format: 'number' },
  { field: 'dmnExpln', header: '도메인설명', minWidth: 240 },
  { field: 'dscdYn', header: '상태', width: 80, align: 'center', render: (v) => <StatusBadge group={CODE_GROUP.DSCD_YN} value={v} /> },
];

/** 표준도메인 목록 (검색어가 비어 있으면 전체) */
export default function SY0103L() {
  const [params, setParams] = useSearchParamsState(STD_DEFAULT_PARAMS);
  const query = useStdDomainList(params);

  return (
    <>
      <PageHeader title="표준도메인" screenId={SCREEN_ID} />
      <StdSearchPanel label="도메인명" params={params} setParams={setParams} />
      <StdGridCard columns={columns} rowKey="dmnSn" query={query} params={params} setParams={setParams} />
    </>
  );
}
