export const numberDiff = (value: number, oldValue: number) => {
  const parsedValue = value;
  const parsedOldValue = oldValue;

  return parsedValue > parsedOldValue
    ? parsedValue - parsedOldValue
    : parsedOldValue - parsedValue;
};

export const diffPropertyCompare = (a, b) => {
  if (a.diff < b.diff) {
    return -1;
  }
  if (a.diff > b.diff) {
    return 1;
  }
  return 0;
};
