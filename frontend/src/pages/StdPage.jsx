import { useState } from 'react';
import {
  importStdExcel,
  searchStdDomains,
  searchStdTerms,
  searchStdWords,
  suggestStdTerm,
} from '../api/stdApi.js';

const TABS = [
  { key: 'suggest', label: '용어 확인' },
  { key: 'terms', label: '표준용어' },
  { key: 'words', label: '표준단어' },
  { key: 'domains', label: '표준도메인' },
  { key: 'import', label: '엑셀 업로드' },
];

const dash = (v) => (v === null || v === undefined || v === '' ? '-' : v);

// 검색 탭별 설정: API, 입력 안내, 표 컬럼
const SEARCH = {
  terms: {
    api: searchStdTerms,
    placeholder: '용어명 또는 영문약어명 (예: 등록일시, REG_DT)',
    rowKey: 'trmSn',
    columns: [
      ['trmNm', '용어명'],
      ['engAbbrNm', '영문약어명', 'mono'],
      ['dmnNm', '도메인명'],
      ['prmVlCn', '허용값'],
      ['trmExpln', '용어설명', 'desc'],
    ],
  },
  words: {
    api: searchStdWords,
    placeholder: '단어명, 영문약어명, 이음동의어·금칙어 (예: 등록, 유저)',
    rowKey: 'wordSn',
    columns: [
      ['wordNm', '단어명'],
      ['engAbbrNm', '영문약어명', 'mono'],
      ['frmWordYn', '형식단어'],
      ['dmnClsfNm', '도메인분류명'],
      ['synmCn', '이음동의어'],
      ['phwrdCn', '금칙어'],
      ['engNm', '영문명', 'desc'],
    ],
  },
  domains: {
    api: searchStdDomains,
    placeholder: '도메인명·분류명·그룹명 (빈 값이면 전체)',
    rowKey: 'dmnSn',
    allowEmpty: true,
    columns: [
      ['dmnGroupNm', '그룹명'],
      ['dmnClsfNm', '분류명'],
      ['dmnNm', '도메인명', 'mono'],
      ['dataTypeNm', '자료유형'],
      ['dataLen', '길이'],
      ['dataDcptLen', '소수점'],
      ['prmVlCn', '허용값', 'desc'],
    ],
  },
};

export default function StdPage() {
  const [tab, setTab] = useState('suggest');

  return (
    <main className="container wide">
      <h1>표준 사전</h1>
      <p className="desc">공공데이터 공통표준(용어·단어·도메인) 조회와 신규 용어 확인</p>

      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            className={tab === t.key ? 'tab active' : 'tab'}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'suggest' && <SuggestPanel />}
      {SEARCH[tab] && <SearchPanel key={tab} config={SEARCH[tab]} />}
      {tab === 'import' && <ImportPanel />}
    </main>
  );
}

function SuggestPanel() {
  const [trmNm, setTrmNm] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    try {
      setResult(await suggestStdTerm(trmNm));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <form onSubmit={handleSubmit} className="form">
        <input
          value={trmNm}
          onChange={(e) => setTrmNm(e.target.value)}
          placeholder="만들려는 컬럼의 한글 용어 (예: 등록자아이디)"
        />
        <button type="submit">확인</button>
      </form>
      {error && <p className="error">{error}</p>}

      {result && (
        <div className={`result-box ${result.valid ? 'ok' : 'warn'}`}>
          <div className="result-head">
            <span className={`badge ${result.standard ? 'std' : result.valid ? 'new' : 'bad'}`}>
              {result.standard ? '표준용어' : result.valid ? '신규 조합' : '확인 필요'}
            </span>
            <strong>{result.trmNm}</strong>
            {result.engAbbrNm && <code>{result.engAbbrNm}</code>}
            {result.engAbbrNm && <code>{result.engAbbrNm.toLowerCase()}</code>}
            {result.dmnNm && <span className="muted">도메인 {result.dmnNm}</span>}
          </div>

          {result.words.length > 0 && (
            <p className="muted">
              단어: {result.words.map((w) => `${w.wordNm}(${w.engAbbrNm})`).join(' + ')}
            </p>
          )}
          {result.dmnCandidates.length > 0 && (
            <p className="muted">도메인 후보: {result.dmnCandidates.join(', ')}</p>
          )}
          {result.messages.length > 0 && (
            <ul className="messages">
              {result.messages.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

function SearchPanel({ config }) {
  const [keyword, setKeyword] = useState('');
  const [includeDiscarded, setIncludeDiscarded] = useState(false);
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!keyword.trim() && !config.allowEmpty) {
      setError('검색어를 입력하세요.');
      return;
    }
    setError('');
    try {
      setRows(await config.api(keyword.trim(), includeDiscarded));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <form onSubmit={handleSubmit} className="form">
        <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder={config.placeholder} />
        <label className="check">
          <input
            type="checkbox"
            checked={includeDiscarded}
            onChange={(e) => setIncludeDiscarded(e.target.checked)}
          />
          폐기 포함
        </label>
        <button type="submit">검색</button>
      </form>
      {error && <p className="error">{error}</p>}

      {rows && (
        <>
          <p className="muted">{rows.length}건{rows.length >= 100 && ' (최대 100건까지 표시)'}</p>
          <div className="table-wrap">
            <table className="grid">
              <thead>
                <tr>
                  {config.columns.map(([key, label]) => (
                    <th key={key}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r[config.rowKey]} className={r.dscdYn === 'Y' ? 'discarded' : ''}>
                    {config.columns.map(([key, , cls]) => (
                      <td key={key} className={cls}>
                        {dash(r[key])}
                      </td>
                    ))}
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={config.columns.length} className="empty">
                      검색 결과가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}

const FILE_INPUTS = [
  ['trmFile', '표준용어', 'TB_용어.xlsx'],
  ['wordFile', '표준단어', 'TB_단어.xlsx'],
  ['dmnFile', '표준도메인', 'TB_도메인.xlsx'],
];

function ImportPanel() {
  const [files, setFiles] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setUploading(true);
    try {
      setResult(await importStdExcel(files));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <section>
      <p className="muted">선택한 파일 종류만 전체 교체합니다. 하나라도 실패하면 모두 되돌립니다.</p>
      <form onSubmit={handleSubmit} className="upload">
        {FILE_INPUTS.map(([key, label, hint]) => (
          <label key={key} className="upload-row">
            <span>
              {label} <small className="muted">({hint})</small>
            </span>
            <input
              type="file"
              accept=".xlsx"
              onChange={(e) => setFiles((f) => ({ ...f, [key]: e.target.files[0] }))}
            />
          </label>
        ))}
        <button type="submit" disabled={uploading || !Object.values(files).some(Boolean)}>
          {uploading ? '업로드 중…' : '업로드'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {result && (
        <p className="success">
          적재 완료:{' '}
          {[
            ['trmCnt', '용어'],
            ['wordCnt', '단어'],
            ['dmnCnt', '도메인'],
          ]
            .filter(([k]) => result[k] !== undefined)
            .map(([k, label]) => `${label} ${result[k].toLocaleString()}건`)
            .join(', ')}
        </p>
      )}
    </section>
  );
}
