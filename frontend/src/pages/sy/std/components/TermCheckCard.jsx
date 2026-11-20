import { useTermSuggest } from '../../../../api/sy/stdQueries.js';
import Card from '../../../../components/common/Card.jsx';
import DataGrid from '../../../../components/common/DataGrid.jsx';
import FormField from '../../../../components/common/FormField.jsx';
import StatusBadge from '../../../../components/common/StatusBadge.jsx';
import { CODE_GROUP, TRM_CHCK } from '../../../../constants/codes.js';
import { msg } from '../../../../constants/messages.js';
import { fmtText } from '../../../../utils/format.js';
import styles from './TermCheckCard.module.css';

const wordColumns = [
  { field: 'pieceNo', header: 'No', width: 60, align: 'center' },
  { field: 'inputNm', header: '입력 단어', width: 160 },
  { field: 'wordNm', header: '표준단어명', width: 160 },
  { field: 'engAbbrNm', header: '영문약어명', align: 'center' },
];

const RESULT = {
  [TRM_CHCK.STD]: 'I004',
  [TRM_CHCK.NEW]: 'I005',
  [TRM_CHCK.INVALID]: 'W006',
};

const judge = (s) => (s.standard ? TRM_CHCK.STD : s.valid ? TRM_CHCK.NEW : TRM_CHCK.INVALID);

/** 용어 확인: 표준용어면 그대로, 없으면 표준단어 조합으로 신규 용어 제안 */
export default function TermCheckCard({ trmNm }) {
  const { data: s } = useTermSuggest(trmNm);
  if (!s) return null;

  const result = judge(s);
  const words = (s.words ?? []).map((w, i) => ({ ...w, pieceNo: i + 1 }));
  const dmn = s.dmnNm ?? (s.dmnCandidates?.length ? `후보: ${s.dmnCandidates.join(', ')}` : null);

  return (
    <Card title="용어 확인" fields>
      <FormField label="판정">
        <span className={styles.judge}>
          <StatusBadge group={CODE_GROUP.TRM_CHCK} value={result} />
          {msg(RESULT[result])}
        </span>
      </FormField>
      <FormField label="용어명">{fmtText(s.trmNm)}</FormField>
      <FormField label="영문약어명">
        <span className={styles.mono}>{fmtText(s.engAbbrNm)}</span>
      </FormField>
      <FormField label="컬럼명">
        <span className={styles.mono}>{fmtText(s.engAbbrNm?.toLowerCase())}</span>
      </FormField>
      <FormField label="도메인명" full>
        {fmtText(dmn)}
      </FormField>
      {s.messages?.length > 0 && (
        <FormField label="확인 사항" full>
          <ul className={styles.messages}>
            {s.messages.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </FormField>
      )}
      {!s.standard && words.length > 0 && (
        <FormField label="단어 구성" full>
          <DataGrid columns={wordColumns} rows={words} rowKey="pieceNo" />
        </FormField>
      )}
    </Card>
  );
}
