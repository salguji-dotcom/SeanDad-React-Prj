import { Link, useNavigate } from 'react-router-dom';
import { useItemList } from '../../../api/pr/itemQueries.js';
import { useStdSummary } from '../../../api/sy/stdQueries.js';
import Button from '../../../components/common/Button.jsx';
import Card from '../../../components/common/Card.jsx';
import DataGrid from '../../../components/common/DataGrid.jsx';
import StatusBadge from '../../../components/common/StatusBadge.jsx';
import PageHeader from '../../../components/layout/PageHeader.jsx';
import { CODE_GROUP, YN } from '../../../constants/codes.js';
import { ROUTES, itemPath } from '../../../constants/routes.js';
import { fmtNumber } from '../../../utils/format.js';
import styles from './CM0001M.module.css';

const SCREEN_ID = 'CM0001M';

const columns = [
  { field: 'rowNo', header: 'No', width: 60, align: 'center' },
  { field: 'itemSn', header: '품목일련번호', width: 120, align: 'center' },
  { field: 'itemNm', header: '품목명', minWidth: 200 },
  { field: 'useYn', header: '사용여부', width: 100, align: 'center', render: (v) => <StatusBadge group={CODE_GROUP.USE_YN} value={v} /> },
  { field: 'regDt', header: '등록일시', width: 170, align: 'center', format: 'datetime' },
];

const RECENT_PARAMS = { page: 1, size: 10, sort: 'regDt,desc' };
const USED_PARAMS = { page: 1, size: 10, useYn: YN.Y };

function Kpi({ label, value, unit, to }) {
  return (
    <Card>
      <Link to={to} className={styles.kpi}>
        <span className={styles.kpiLabel}>{label}</span>
        <span className={styles.kpiValue}>
          {fmtNumber(value)}
          <small className={styles.kpiUnit}>{unit}</small>
        </span>
      </Link>
    </Card>
  );
}

/** 대시보드: KPI 카드(최대 4개) → 최근 등록 품목 */
export default function CM0001M() {
  const navigate = useNavigate();
  const recent = useItemList(RECENT_PARAMS);
  const used = useItemList(USED_PARAMS);
  const { data: summary } = useStdSummary();

  return (
    <>
      <PageHeader title="대시보드" screenId={SCREEN_ID} />
      <div className={styles.kpis}>
        <Kpi label="전체 품목" value={recent.data?.totalCount} unit="건" to={ROUTES.ITEMS} />
        <Kpi label="사용 품목" value={used.data?.totalCount} unit="건" to={`${ROUTES.ITEMS}?useYn=${YN.Y}`} />
        <Kpi label="표준용어" value={summary?.trmCnt} unit="건" to={ROUTES.STD_TERMS} />
        <Kpi label="표준단어" value={summary?.wordCnt} unit="건" to={ROUTES.STD_WORDS} />
      </div>
      <Card title="최근 등록 품목" actions={<Button onClick={() => navigate(ROUTES.ITEMS)}>목록</Button>}>
        <DataGrid
          columns={columns}
          rows={recent.data?.list}
          rowKey="itemSn"
          loading={recent.isFetching}
          onRowClick={(row) => navigate(itemPath(row.itemSn))}
        />
      </Card>
    </>
  );
}
