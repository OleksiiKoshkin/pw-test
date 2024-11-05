import { GridHeaders } from './ag-grid-helpers';

export const hasDifferentVersions = (gridHeaders: GridHeaders) => {
  if (!gridHeaders || gridHeaders.length === 0) {
    return false;
  }
  if (!gridHeaders[1].cols || gridHeaders[1].cols.length === 0) {
    return false;
  }

  const firstVersionName = gridHeaders[1].cols[0].value;
  return gridHeaders[1].cols.some((col) => col.value !== firstVersionName);
};

export const getHeaderText = (gridHeaders: GridHeaders, colIdx: number, hasDifferentVersions: boolean) => {
  if (colIdx < 0
    || !gridHeaders
    || !gridHeaders.length
    || !gridHeaders[0].cols
    || gridHeaders[0].cols.length === 0
    || colIdx >= gridHeaders[0].cols.length) {
    return 'No header';
  }

  if (hasDifferentVersions) {
    return gridHeaders.map((row) => (row.cols[colIdx].value)).join(', ');
  }
  return gridHeaders[0].cols[colIdx].value;
};
