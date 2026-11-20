import Checkbox from '../../../../components/common/Checkbox.jsx';
import FormField from '../../../../components/common/FormField.jsx';
import Input from '../../../../components/common/Input.jsx';
import SearchPanel from '../../../../components/common/SearchPanel.jsx';
import { STD_KEYWORD_MAX, STD_SEARCH_DEFAULTS, searchValues } from '../stdSearch.js';

/** 표준 사전 목록 검색 영역: 검색어 + 폐기 포함 */
export default function StdSearchPanel({ label, params, setParams }) {
  return (
    <SearchPanel
      defaultValues={searchValues(params)}
      resetValues={STD_SEARCH_DEFAULTS}
      onSearch={(v) => setParams({ ...params, ...v, page: 1 })}
    >
      <FormField label={label} name="keyword">
        <Input name="keyword" maxLength={STD_KEYWORD_MAX} width="full" />
      </FormField>
      <FormField label="폐기 항목" name="includeDiscarded">
        <Checkbox name="includeDiscarded" label="포함" />
      </FormField>
    </SearchPanel>
  );
}
