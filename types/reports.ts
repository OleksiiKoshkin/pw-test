import { AgGridReportModel, GridData, GridGroupRowHeaders, GridHeaders } from '../scenarios-player';

export type CommonReportPayload = {
  reportGrid?: AgGridReportModel;
  gridData: GridData;
  gridHeaders: GridHeaders;
  groupRowHeaders: GridGroupRowHeaders;
}
