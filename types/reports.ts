import { AgGridReportModel, GridData, GridGroupRowHeaders, GridHeaders } from '../scenarios/shared';

export type CommonReportPayload = {
  reportGrid?: AgGridReportModel;
  gridData: GridData;
  gridHeaders: GridHeaders;
  groupRowHeaders: GridGroupRowHeaders;
}
