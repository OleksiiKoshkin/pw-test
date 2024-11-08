const removeSigns = (value: string) =>
  (value || '')
    .replaceAll('-', '')
    .replaceAll('+', '')
    .replaceAll('(', '')
    .replaceAll(')', '')
    .replaceAll('%', '')
    .replaceAll('$', '');

const getSignMultiplier = (maybeNumber: string) =>
  (maybeNumber.startsWith('(') && maybeNumber.endsWith(')')) ||
  maybeNumber.startsWith('-')
    ? -1
    : 1;

export const getNumberValue = (maybeNumber?: string) => {
  if (!maybeNumber) {
    return Number.NaN;
  }
  const signMultiplier = getSignMultiplier(maybeNumber);
  const cleanString = removeSigns(maybeNumber);

  const value = parseFloat(cleanString.replace(/[^\d.]/g, ''));
  if (Number.isNaN(value)) {
    return Number.NaN;
  }
  return value * signMultiplier;
};

export const getNumberValueOrZero = (maybeNumber?: string) => {
  const result = getNumberValue(maybeNumber);
  if (Number.isNaN(result)) {
    return 0;
  }
  return result;
};
