export function formatDate(dateStr) {
  const locale = 'en-GB';
  const dateObj = new Date(dateStr);
  return dateObj.toLocaleDateString(locale, {
    month: 'short',
    year: 'numeric',
  });
}
