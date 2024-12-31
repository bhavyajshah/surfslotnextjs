export function parseDate(dateString: string | Date): Date {
  if (dateString instanceof Date) {
    return dateString;
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }
  return date;
}

export function formatDate(date: Date | string): string {
  const parsedDate = parseDate(date);
  return parsedDate.toISOString();
}