import pg from 'pg';
import { RawDbRow } from './types';

const query: string = `select 
	scenarios.id as scenario_id,
	scenarios.name as scenario_name,
	scenarios_environment.id as target_id,
	scenarios_environment.description as target_name,
	scenarios_environment.tenant_id,
	scenarios_environment.environment,
	scenarios_environment.initial_url,
	scenarios_environment.widget_id,
	scenarios_environment.skip_login,
	variants.id as variant_id,
	variants.name as variant_name,
	variants.url_params as variant_url_params
from scenarios
left join scenarios_environment on scenarios_environment.scenario_id=scenarios.id
left join variants on variants.scenarios_environment_id=scenarios_environment.id
where 
	scenarios.is_enabled=true 
	and scenarios_environment.is_enabled=true 
	and	(variants.is_enabled=true OR variants.is_enabled is null)`;

export async function getDBConfig() {
  if (!process.env.DB_NAME) {
    throw new Error('Missing DB_NAME!');
  }

  if (!process.env.DB_USER) {
    throw new Error('Missing DB_USER!');
  }

  const client = new pg.Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    database: process.env.DB_NAME
  });
  console.log(`Connecting to "${process.env.DB_HOST || 'localhost'}"...`);

  if (process.env.DB_HOST || 'localhost' === 'localhost') {
    console.warn('Please pay attention: connected to the local database');
  }

  try {
    await client.connect();
  } catch (error) {
    console.error('Connection Failed with', error);
    process.exit(-1);
  }

  console.log(`Connected to PostgreSQL DB "${process.env.DB_NAME}" as "${process.env.DB_USER}"`);
  if (process.env.DB_SCHEMA) {
    console.log(`Setting db schema "${process.env.DB_SCHEMA}"...`);
    try {
      await client.query(`SET search_path TO ${process.env.DB_SCHEMA};`);
    } catch (error) {
      console.error('Failed with', error);
      process.exit(-2);
    }
  }
  console.log('Requesting test scenarios...\n');

  let result: RawDbRow[] = [];

  try {
    const response = await client.query(query);

    result = response.rows || [];
  } catch (error) {
    console.error('Failed with', error);
    process.exit(-3);
  }

  await client.end();

  return result;
}