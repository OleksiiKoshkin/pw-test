export type RawDbRow = {
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