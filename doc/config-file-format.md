# Fintastic e2e: Config file format

[Run target file](./run-config.md) is a JSON which holds data structure:

```ts
export type ConfigTargetVariant = {
  id?: string
  name: string // Segmentation Month
  queryParams?: string // ?v=abcdef...dim.usX
} & Record<string, string>; // extra params, reserved

export type ConfigTarget = {
  id?: string
  tenant: TenantCode // "acme3"
  domain: DomainType // "production"
  url?: string // "board/abcd"
  name?: string // optional, "ARR accuracy test on e2e version on prod/acme"
  skipLogin?: boolean // skip logging in before test execution or not (default: no)
  targetWidgetId?: string // widget container identification
  variants?: ConfigTargetVariant[] // extra navigation parameters
}

export type ConfigScenario = {
  scenarioId: KnownScenario // "arr_net_top_accuracy"
  name: string // "Check Net-Top chains for ARR report"
  targets: ConfigTarget[] // acme, prod, year, month
}
```

Each scenario MUST include one or more targets, each target CAN have one or more variants 
(additional url query strings to switch period selection or versions, etc.)

JSON:

```json
{
  "scenarios": [
    {
      "scenarioId": "arr_net_top_accuracy",
      "name": "ARR Report Numbers",
      "targets": [
        {
          "id": 1,
          "name": "ARR Report Numbers on prod/acme",
          "tenant": "acme3",
          "domain": "production",
          "skipLogin": false,
          "url": "board/15486dd6-4bcf-4537-8556-48b33a125b4d",
          "targetWidgetId": "board-widget-arr",
          "variants": [
            {
              "id": 1,
              "name": "Segmentation Month",
              "queryParams": "v=%7Ef036f5c5-a1b7-4a69-bf4a-244c168a9c5a&wboard_date%5BaggregationDimensionId%5D=Dim.usX&wboard_date%5BdimensionId%5D=Dim.usX&wboard_date%5Bperiods%5D=%7EDim.usX.Qa%7EDim.usX.Ra%7EDim.usX.Sa%7EDim.usX.Ta%7EDim.usX.Ua%7EDim.usX.Va%7EDim.usX.Wa%7EDim.usX.Xa%7EDim.usX.Ya%7EDim.usX.Za%7EDim.usX._b%7EDim.usX.ab%7EDim.usX.bb%7EDim.usX.cb%7EDim.usX.db%7EDim.usX.eb%7EDim.usX.fb%7EDim.usX.gb%7EDim.usX.hb%7EDim.usX.ib%7EDim.usX.jb%7EDim.usX.kb%7EDim.usX.lb%7EDim.usX.mb"
            },
            {
              "id": 2,
              "name": "Segmentation Quarter",
              "queryParams": "v=~f036f5c5-a1b7-4a69-bf4a-244c168a9c5a&wboard_date%5BaggregationDimensionId%5D=Dim.Bi1&wboard_date%5BdimensionId%5D=Dim.usX&wboard_date%5Bperiods%5D=~Dim.usX.Qa~Dim.usX.Ra~Dim.usX.Sa~Dim.usX.Ta~Dim.usX.Ua~Dim.usX.Va~Dim.usX.Wa~Dim.usX.Xa~Dim.usX.Ya~Dim.usX.Za~Dim.usX._b~Dim.usX.ab~Dim.usX.bb~Dim.usX.cb~Dim.usX.db~Dim.usX.eb~Dim.usX.fb~Dim.usX.gb~Dim.usX.hb~Dim.usX.ib~Dim.usX.jb~Dim.usX.kb~Dim.usX.lb~Dim.usX.mb"
            },
            {
              "id": 4,
              "name": "Segmentation Half year",
              "queryParams": "v=%7Ef036f5c5-a1b7-4a69-bf4a-244c168a9c5a&wboard_date%5BaggregationDimensionId%5D=Dim.y08&wboard_date%5BdimensionId%5D=Dim.usX&wboard_date%5Bperiods%5D=%7EDim.usX.Qa%7EDim.usX.Ra%7EDim.usX.Sa%7EDim.usX.Ta%7EDim.usX.Ua%7EDim.usX.Va%7EDim.usX.Wa%7EDim.usX.Xa%7EDim.usX.Ya%7EDim.usX.Za%7EDim.usX._b%7EDim.usX.ab%7EDim.usX.bb%7EDim.usX.cb%7EDim.usX.db%7EDim.usX.eb%7EDim.usX.fb%7EDim.usX.gb%7EDim.usX.hb%7EDim.usX.ib%7EDim.usX.jb%7EDim.usX.kb%7EDim.usX.lb%7EDim.usX.mb"
            },
            {
              "id": 3,
              "name": "Segmentation Year",
              "queryParams": "v=%7Ef036f5c5-a1b7-4a69-bf4a-244c168a9c5a&wboard_date%5BaggregationDimensionId%5D=Dim.eOz&wboard_date%5BdimensionId%5D=Dim.usX&wboard_date%5Bperiods%5D=%7EDim.usX.Qa%7EDim.usX.Ra%7EDim.usX.Sa%7EDim.usX.Ta%7EDim.usX.Ua%7EDim.usX.Va%7EDim.usX.Wa%7EDim.usX.Xa%7EDim.usX.Ya%7EDim.usX.Za%7EDim.usX._b%7EDim.usX.ab%7EDim.usX.bb%7EDim.usX.cb%7EDim.usX.db%7EDim.usX.eb%7EDim.usX.fb%7EDim.usX.gb%7EDim.usX.hb%7EDim.usX.ib%7EDim.usX.jb%7EDim.usX.kb%7EDim.usX.lb%7EDim.usX.mb"
            }
          ]
        }
      ]
    },
    {
      "scenarioId": "performance-version-page",
      "name": "Version page performance",
      "targets": [
        {
          "id": 6,
          "name": "production:acme3",
          "tenant": "acme3",
          "domain": "production",
          "skipLogin": false,
          "url": "",
          "targetWidgetId": "",
          "variants": []
        }
      ]
    },
    {
      "scenarioId": "login-flow",
      "name": "Login and logout flow",
      "targets": [
        {
          "id": 7,
          "name": "production:acme3",
          "tenant": "acme3",
          "domain": "production",
          "skipLogin": true,
          "url": "",
          "targetWidgetId": "",
          "variants": []
        }
      ]
    }
  ]
}
```