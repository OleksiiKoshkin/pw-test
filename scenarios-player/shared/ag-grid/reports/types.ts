
export type GridDataCol = {
  colId: string
  colIndex: number
  value: string
}

export type GridDataRow = {
  rowId: string
  rowIndex: number
  cols: GridDataCol[]
}

// only data, without header rows and group headers column
export type GridData = GridDataRow[]

export type GridHeaderCol = {
  headerColId: string
  headerColIndex: number
  value: string
}

// header rows (column headers)
export type GridHeaderRow = {
  rowIndex: number
  cols: GridHeaderCol[]
}

export type GridHeaders = GridHeaderRow[]

// row headers (1st column)
export type GridGroupRowHeader = {
  rowIndex: number
  rowId: string
  value: string
}

export type GridGroupRowHeaders = GridGroupRowHeader[]