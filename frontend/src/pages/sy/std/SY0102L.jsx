import { useStdWordList } from '../../../api/sy/stdQueries.js';
import StatusBadge from '../../../components/common/StatusBadge.jsx';
import PageHeader from '../../../components/layout/PageHeader.jsx';
import { CODE_GROUP } from '../../../constants/codes.js';
import { useSearchParamsState } from '../../../hooks/useSearchParamsState.js';
import StdGridCard from './components/StdGridCard.jsx';
import StdSearchPanel from './components/StdSearchPanel.jsx';
import { STD_DEFAULT_PARAMS } from './stdSearch.js';

const SCREEN_ID = 'SY0102L';

const columns = [
  { field: 'rowNo', header: 'No', width: 60, align: 'center' },
  { field: 'wordNm', header: '단어명', width: 130 },
  { field: 'engAbbrNm', header: '영문약어명', width: 110, align: 'center' },
  { field: 'engNm', header: '영문명', width: 160 },
  { field: 'frmWordYn', header: '형식단어여부', width: 110, align: 'center', codeGroup: CODE_GROUP.YN },
  { field: 'dmnClsfNm', header: '도메인분류명', width: 110, align: 'center' },
  { field: 'synmCn', header: '동의어내용', width: 150 },
  { field: 'phwrdCn', header: '금칙어내용', width: 150 },
  { field: 'wordExpln', header: '단어설명', minWidth: 220 },
  { field: 'dscdYn', header: '상태', width: 80, align: 'center', render: (v) => <StatusBadge group={CODE_GROUP.DSCD_YN} value={v} /> },
];

/** 표준단어 목록 (이음동의어·금칙어로도 검색) */
export default function SY0102L() {
  const [params, setParams] = useSearchParamsState(STD_DEFAULT_PARAMS);
  const query = useStdWordList(params);

  return (
    <>
      <PageHeader title="표준단어" screenId={SCREEN_ID} />
      <StdSearchPanel label="단어명" params={params} setParams={setParams} />
      <StdGridCard columns={columns} rowKey="wordSn" query={query} params={params} setParams={setParams} />
    </>
  );
}
