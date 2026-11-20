// "2026-11-19T09:14:03.160443" → "2026-11-19 09:14:03"
export const formatDateTime = (value) => value?.replace('T', ' ').slice(0, 19) ?? '';
