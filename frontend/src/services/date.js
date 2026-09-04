const ISO_TIMEZONE_SUFFIX = /(Z|[+-]\d{2}:\d{2})$/i;

export function formatDateTimeIST(dateString) {
  if (!dateString) return '-';

  const value = String(dateString);
  const utcValue = ISO_TIMEZONE_SUFFIX.test(value) ? value : `${value}Z`;
  const date = new Date(utcValue);

  if (Number.isNaN(date.getTime())) return '-';

  const formatted = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);

  return formatted.replace(/\b(am|pm)\b/i, (meridiem) => meridiem.toUpperCase());
}