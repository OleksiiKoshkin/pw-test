import { ScenarioTarget } from '../../../shared/types';

export const scenarioTarget: ScenarioTarget = {
  tenant: 'acme3',
  domain: 'production',
  targets: [
    {
      name: 'Segmentation Month',
      url: 'board/ea916af3-4221-4e73-b398-d4ae6602d757?v=%7Ef036f5c5-a1b7-4a69-bf4a-244c168a9c5a&wboard_date%5BaggregationDimensionId%5D=Dim.usX&wboard_date%5BdimensionId%5D=Dim.usX&wboard_date%5Bperiods%5D=%7EDim.usX.Qa%7EDim.usX.Ra%7EDim.usX.Sa%7EDim.usX.Ta%7EDim.usX.Ua%7EDim.usX.Va%7EDim.usX.Wa%7EDim.usX.Xa%7EDim.usX.Ya%7EDim.usX.Za%7EDim.usX._b%7EDim.usX.ab%7EDim.usX.bb%7EDim.usX.cb%7EDim.usX.db%7EDim.usX.eb%7EDim.usX.fb%7EDim.usX.gb%7EDim.usX.hb%7EDim.usX.ib%7EDim.usX.jb%7EDim.usX.kb%7EDim.usX.lb%7EDim.usX.mb'
    }
  ],
  specific: {
    boardTitle: '08. P&L By Vendor'
  }
};
