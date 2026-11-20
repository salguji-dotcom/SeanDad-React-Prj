import Card from '../../../../components/common/Card.jsx';
import DataGrid from '../../../../components/common/DataGrid.jsx';
import GridToolbar from '../../../../components/common/GridToolbar.jsx';
import Pagination from '../../../../components/common/Pagination.jsx';

/** 표준 사전 목록 카드: 총 건수 → 그리드 → 페이징 (행 클릭·버튼 없음, 조회 전용) */
export default function StdGridCard({ columns, rowKey, query, params, setParams }) {
  const { data, isFetching } = query;
  return (
    <Card>
      <GridToolbar total={data?.totalCount} />
      <DataGrid
        columns={columns}
        rows={data?.list}
        rowKey={rowKey}
        loading={isFetching}
        page={params.page}
        size={params.size}
      />
      <Pagination
        page={params.page}
        size={params.size}
        total={data?.totalCount}
        onChange={(page, size) => setParams({ ...params, page, size })}
      />
    </Card>
  );
}
