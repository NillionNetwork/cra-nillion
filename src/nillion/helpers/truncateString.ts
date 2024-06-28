export const truncateString = (
  str: string,
  N: number = 10,
  M: number = 10,
  splitter: string | null = null
): string => {
  if (str.length <= N + M) {
    return str; // No truncation needed
  }

  if (splitter) {
    const parts = str.split(splitter);
    const truncatedParts = parts.map((part) => truncateString(part, N, M));
    return truncatedParts.join(splitter);
  } else {
    const start = str.slice(0, N);
    const end = M > 0 ? str.slice(-M) : '';
    return `${start}...${end}`;
  }
};
