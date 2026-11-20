import { useStdTermList } from '../../../api/sy/stdQueries.js';
import StatusBadge from '../../../components/common/StatusBadge.jsx';
import PageHeader from '../../../components/layout/PageHeader.jsx';
import { CODE_GROUP } from '../../../constants/codes.js';
import { useSearchParamsState } from '../../../hooks/useSearchParamsState.js';
import StdGridCard from './components/StdGridCard.jsx';
import StdSearchPanel from './components/StdSearchPanel.jsx';
import TermCheckCard from './components/TermCheckCard.jsx';
import { STD_DEFAULT_PARAMS } from './stdSearch.js';

const SCREEN_ID = 'SY0101L';

const columns = [
  { field: 'rowNo', header: 'No', width: 60, align: 'center' },
  { field: 'trmNm', header: '용어명', width: 180 },
  { field: 'engAbbrNm', header: '영문약어명', width: 180, align: 'center' },
  { field: 'dmnNm', header: '도메인명', width: 130, align: 'center' },
  { field: 'trmExpln', header: '용어설명', minWidth: 240 },
  { field: 'enctCyclNm', header: '제정차수명', width: 130, align: 'center' },
  { field: 'dscdYn', header: '상태', width: 80, align: 'center', render: (v) => <StatusBadge group={CODE_GROUP.DSCD_YN} value={v} /> },
];

/** 표준용어 목록 + 용어 확인 (검색어가 있으면 표준용어 여부와 신규 용어 제안을 함께 표시) */
export default function SY0101L() {
  const [params, setParams] = useSearchParamsState(STD_DEFAULT_PARAMS);
  const query = useStdTermList(params);

  return (
    <>
      <PageHeader title="표준용어" screenId={SCREEN_ID} />
      <StdSearchPanel label="용어명" params={params} setParams={setParams} />
      {params.keyword && <TermCheckCard trmNm={params.keyword} />}
      <StdGridCard columns={columns} rowKey="trmSn" query={query} params={params} setParams={setParams} />
    </>
  );
}
