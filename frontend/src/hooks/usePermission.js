/**
 * 화면 버튼 권한 (웹 화면 표준 14.4). 권한 없는 버튼은 숨깁니다.
 * TODO: 로그인·권한 API 가 생기면 로그인 사용자의 화면별 권한으로 바꿉니다. 지금은 모두 허용입니다.
 * 실제 권한 검사는 반드시 서버 API 에서 합니다.
 */
export function usePermission(_screenId) {
  return { canCreate: true, canUpdate: true, canDelete: true, canExcel: true };
}
