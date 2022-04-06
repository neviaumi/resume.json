export function formatDate(dateStr) {
  const dateObj = new Date(dateStr);
  return `${String(dateObj.getMonth() + 1).padStart(2, '0')}/${String(
    dateObj.getFullYear(),
  ).substring(2)}`;
}
