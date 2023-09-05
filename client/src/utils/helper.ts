import dayjs from 'dayjs';

export const APIKeyGPT = `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`;

export const DateFormatDisplayMinute = 'MM/DD/YYYY hh:mm A';

export const formatDate = (value: string, format: string = 'MM/DD/YYYY') => {
  if (!value) return '';

  return dayjs(value).format(format);
};

export const formatYear = (value: string, format: string = 'YYYY') => {
  if (!value) return '';

  return dayjs(value).format(format);
};

export const formatDateTime = (value: string, format: string = DateFormatDisplayMinute) => {
  if (!value) return '';
  return dayjs(value).format(format);
};
