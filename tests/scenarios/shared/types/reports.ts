import { AgGridReportModel, GridData, GridGroupRowHeaders, GridHeaders } from '../ag-grid';

export type CommonReportPayload = {
  reportGrid?: AgGridReportModel;
  gridData: GridData;
  gridHeaders: GridHeaders;
  groupRowHeaders: GridGroupRowHeaders;
}
