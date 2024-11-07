# Fintastic e2e: Local database setup

TBD
https://postgresapp.com/
https://eggerapps.at/postico2/


CREATE ROLE e2e_user2 WITH
LOGIN
NOSUPERUSER
NOCREATEDB
NOCREATEROLE
INHERIT
NOREPLICATION
NOBYPASSRLS
CONNECTION LIMIT -1;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO e2e_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO e2e_user;

---- scenarios

CREATE TABLE e2e_scenarios (
scenario_id character varying(48) PRIMARY KEY,
scenario_name text NOT NULL,
scenario_enabled boolean DEFAULT true
);

CREATE UNIQUE INDEX e2e_scenarios_pkey ON e2e_scenarios(scenario_id text_ops);

---- targets

CREATE TABLE e2e_targets (
target_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
scenario_id character varying(48) REFERENCES e2e_scenarios(scenario_id) ON DELETE CASCADE ON UPDATE CASCADE,
target_enabled boolean DEFAULT true,
tenant character varying(16) NOT NULL,
environment character varying(48) NOT NULL,
target_url text,
widget_id text,
target_name text
);

CREATE UNIQUE INDEX e2e_targets_pkey ON e2e_targets(target_id int4_ops);

---- variants

CREATE TABLE e2e_variants (
variant_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
target_id integer REFERENCES e2e_targets(target_id) ON DELETE CASCADE ON UPDATE CASCADE,
variant_enabled boolean DEFAULT true,
variant_name text NOT NULL,
variant_url_params text
);

CREATE UNIQUE INDEX e2e_variants_pkey ON e2e_variants(variant_id int4_ops);

---- select
select
e2e_scenarios.scenario_id,
e2e_scenarios.scenario_name,
e2e_targets.target_id,
e2e_targets.target_name,
e2e_targets.tenant,
e2e_targets.environment,
e2e_targets.target_url,
e2e_targets.widget_id,
e2e_variants.variant_id,
e2e_variants.variant_name,
e2e_variants.variant_url_params
from e2e_scenarios
left join e2e_targets on e2e_targets.scenario_id=e2e_scenarios.scenario_id
left join e2e_variants on e2e_variants.target_id=e2e_targets.target_id
where
scenario_enabled=true
and target_enabled=true
and	(variant_enabled=true OR variant_enabled is null);
