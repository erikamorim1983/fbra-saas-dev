export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            company_groups: {
                Row: {
                    id: string
                    name: string
                    cnpj_raiz: string | null
                    owner_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    cnpj_raiz?: string | null
                    owner_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    cnpj_raiz?: string | null
                    owner_id?: string | null
                    created_at?: string
                }
            }
            companies: {
                Row: {
                    id: string
                    group_id: string | null
                    name: string
                    cnpj: string
                    segment: string
                    current_regime: string
                    iss_rate: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    group_id?: string | null
                    name: string
                    cnpj: string
                    segment: string
                    current_regime: string
                    iss_rate?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    group_id?: string | null
                    name?: string
                    cnpj?: string
                    segment?: string
                    current_regime?: string
                    iss_rate?: number | null
                    created_at?: string
                }
            }
            monthly_financials: {
                Row: {
                    id: string
                    company_id: string | null
                    month: number
                    year: number
                    revenue_services: number | null
                    revenue_products: number | null
                    revenue_other: number | null
                    costs_personnel: number | null
                    costs_inputs: number | null
                    costs_energy: number | null
                    costs_rent: number | null
                    opex_personnel: number | null
                    opex_marketing: number | null
                    opex_admin: number | null
                }
                Insert: {
                    id?: string
                    company_id?: string | null
                    month: number
                    year: number
                    revenue_services?: number | null
                    revenue_products?: number | null
                    revenue_other?: number | null
                    costs_personnel?: number | null
                    costs_inputs?: number | null
                    costs_energy?: number | null
                    costs_rent?: number | null
                    opex_personnel?: number | null
                    opex_marketing?: number | null
                    opex_admin?: number | null
                }
                Update: {
                    id?: string
                    company_id?: string | null
                    month?: number
                    year?: number
                    revenue_services?: number | null
                    revenue_products?: number | null
                    revenue_other?: number | null
                    costs_personnel?: number | null
                    costs_inputs?: number | null
                    costs_energy?: number | null
                    costs_rent?: number | null
                    opex_personnel?: number | null
                    opex_marketing?: number | null
                    opex_admin?: number | null
                }
            }
            tax_analyses: {
                Row: {
                    id: string
                    company_id: string | null
                    analysis_date: string
                    presumido_tax_annual: number | null
                    real_cumulativo_tax_annual: number | null
                    real_nao_cumulativo_tax_annual: number | null
                    simples_tax_annual: number | null
                    optimized_regime: string | null
                    projected_annual_savings: number | null
                    ai_technical_opinion: string | null
                }
                Insert: {
                    id?: string
                    company_id?: string | null
                    analysis_date?: string
                    presumido_tax_annual?: number | null
                    real_cumulativo_tax_annual?: number | null
                    real_nao_cumulativo_tax_annual?: number | null
                    simples_tax_annual?: number | null
                    optimized_regime?: string | null
                    projected_annual_savings?: number | null
                    ai_technical_opinion?: string | null
                }
                Update: {
                    id?: string
                    company_id?: string | null
                    analysis_date?: string
                    presumido_tax_annual?: number | null
                    real_cumulativo_tax_annual?: number | null
                    real_nao_cumulativo_tax_annual?: number | null
                    simples_tax_annual?: number | null
                    optimized_regime?: string | null
                    projected_annual_savings?: number | null
                    ai_technical_opinion?: string | null
                }
            }
        }
    }
}
