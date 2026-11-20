import axios from 'axios';
import { msg } from '../constants/messages.js';
import { openAlert } from '../stores/uiStore.js';

// axios 공통 인스턴스 (웹 화면 표준 12장, 13.3). 업무 화면은 axios 를 직접 import 하지 않습니다.
// HTTP 오류는 여기서 한 번만 안내합니다. 화면은 같은 오류를 다시 띄우지 않습니다.
//  - 400 + fieldErrors : 화면이 입력칸 아래에 표시 (setServerErrors)
//  - 400·413 (그 외)    : 서버가 준 안내 문구
//  - 401 E002 / 403 E003 / 404 E004 / 5xx·네트워크 E001
const client = axios.create({ baseURL: '/api', timeout: 60000 });

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    if (status === 400 && data?.fieldErrors?.length) {
      error.fieldErrors = data.fieldErrors;
    } else if (status === 400 || status === 413) {
      openAlert(data?.message || msg('E001'));
    } else if (status === 401) {
      // TODO: 로그인 화면이 생기면 이동
      openAlert(msg('E002'));
    } else if (status === 403) {
      openAlert(msg('E003'));
    } else if (status === 404) {
      openAlert(msg('E004'));
    } else {
      openAlert(msg('E001'));
    }
    return Promise.reject(error);
  },
);

/** 서버 필드 오류(400 fieldErrors)를 React Hook Form 입력칸 오류로 옮깁니다. */
export function setServerErrors(error, setError) {
  error?.fieldErrors?.forEach(({ field, message }, i) => {
    setError(field, { type: 'server', message }, { shouldFocus: i === 0 });
  });
}

export default client;
