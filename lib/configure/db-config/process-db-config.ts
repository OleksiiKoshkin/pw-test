import { getDBConfig } from './get-db-config';
import { ConfigScenario, ConfigTarget } from '../../../types';
import { RawDbRow } from './types';

export async function getDbScenarios(): Promise<ConfigScenario[]> {
  // 1. Get config from DB
  const dbConfig = await getDBConfig();

// 2. Process config
  console.log(`Processing data (${dbConfig.length} rows)...`);
  let scenarios: ConfigScenario[] = [];

  try {
    scenarios = parseRawDbData(dbConfig);
  } catch (error) {
    console.log('');
    console.error('Failed with', error);
    console.log('');
    process.exit(-4);
  }
  return scenarios;
}

function getAllScenarioIds(rows: Array<RawDbRow>) {
  const result = new Set<string>();

  rows.forEach((row: RawDbRow) => {
    if (row.scenario_id) {
      result.add(row.scenario_id);
    }
  });

  return Array.from(result).map((id) => ([id, rows.find((r) => r.scenario_id === id)?.scenario_name || 'unknown scenario_name']));
}

function getAllVariantsByTargetId(rows: Array<RawDbRow>, targetId: string) {
  return rows.filter((r) => (r.target_id === targetId && Boolean(r.variant_id))) || [];
}

function getAllTargetsByScenarioId(rows: Array<RawDbRow>, scenarioId: string) {
  const result: Array<ConfigTarget> = [];

  rows.filter((r) => (r.scenario_id === scenarioId)).forEach((row) => {
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

function parseRawDbData(rows: Array<RawDbRow>) {
  const scenarios: ConfigScenario[] = [];

  getAllScenarioIds(rows).forEach(([scenarioId, scenarioName]) => {
    scenarios.push({
      scenarioId,
      name: scenarioName,
      targets: getAllTargetsByScenarioId(rows, scenarioId)
    });
  });

  return scenarios;
}