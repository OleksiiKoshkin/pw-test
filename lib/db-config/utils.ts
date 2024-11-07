import { domainTypes, knownScenarios, tenants } from '../../tests/shared/types';
import { ConfigScenario, ConfigTarget } from '../../types';

export type RawRow = {
  scenario_id: string
  scenario_name: string | null
  target_id: string
  target_name: string | null
  tenant_id: string
  environment: string // ?
  initial_url: string | null
  widget_id: string | null
  variant_id: string | null
  variant_name: string | null
  variant_url_params: string | null
}

function getAllScenarioIds(rows: Array<RawRow>) {
  const result = new Set<string>();

  rows.forEach((row: RawRow) => {
    if (row.scenario_id) {
      result.add(row.scenario_id);
    }
  });

  return Array.from(result).map((id) => ([id, rows.find((r) => r.scenario_id === id)?.scenario_name || 'unknown scenario_name']));
}

function getAllVariantsByTargetId(rows: Array<RawRow>, targetId: string) {
  return rows.filter((r) => (r.target_id === targetId && Boolean(r.variant_id))) || [];
}

function getAllTargetsByScenarioId(rows: Array<RawRow>, scenarioId: string) {
  const result: Array<ConfigTarget> = []

  rows.filter((r) => (r.scenario_id === scenarioId)).forEach((row) => {
    if (!domainTypes[row.environment]) {
      throw new Error(`No environment (from ${Object.keys(domainTypes).join(', ')}) found for ${JSON.stringify(row, null, 2)}`);
    }

    if (!tenants[row.tenant_id]) {
      throw new Error(`No tenant (from ${Object.keys(tenants).join(', ')}) found for  ${JSON.stringify(row, null, 2)}`);
    }

    if (result.find((r) => r.id === row.target_id)) {
      return;
    }

    result.push({
      id: row.target_id,
      name: row.target_name || ((row.environment || '') + ':' + (row.tenant_id || '')),
      tenant: row.tenant_id, // code!
      domain: row.environment, // code!
      url: row.initial_url || '',
      targetWidgetId: row.widget_id || '',

      variants: getAllVariantsByTargetId(rows, row.target_id).map((row) => ({
        id: row.variant_id,
        name: row.variant_name,
        queryParams: row.variant_url_params
      }))
    } as ConfigTarget);
  });

  return result;
}

export function parseRawData(rows: Array<RawRow>) {
  const scenarios: ConfigScenario[] = [];

  getAllScenarioIds(rows).forEach(([scenarioId, scenarioName]) => {
    if (!knownScenarios.includes(scenarioId)) {
      throw new Error(`Unknown scenario "${scenarioId}": not listed in ${knownScenarios.join(', ')}`);
    }
    scenarios.push({
      scenarioId,
      name: scenarioName,
      targets: getAllTargetsByScenarioId(rows, scenarioId)
    });
  });

  return scenarios;
}