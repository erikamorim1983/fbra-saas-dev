/**
 * FBRA Tax Engine - Brazilian Taxation Logic
 * Performs calculations for:
 * - Lucro Presumido
 * - Lucro Real (Cumulativo e Não-Cumulativo)
 * - Simples Nacional (Basics)
 */

export interface TaxAnalisysInput {
    revenue_services: number;
    revenue_products: number;
    costs_inputs: number;
    costs_energy: number;
    costs_rent: number;
    ebitda: number;
    segment: 'servicos' | 'comercio' | 'industria';
    tax_regime_vigente?: string;
    iss_rate?: number;
}

export interface ScenarioResult {
    regime: string;
    pis_cofins: number;
    irpj_csll: number;
    iss: number;
    total: number;
    efficiency: number;
}

export class TaxEngine {
    /**
     * Cálculo de Lucro Presumido (Serviços)
     */
    static calculatePresumido(input: TaxAnalisysInput): ScenarioResult {
        const revenue = input.revenue_services + input.revenue_products;

        // PIS (0.65%) e COFINS (3%)
        const pis_cofins = revenue * 0.0365;

        // ISS (Média 5%)
        const iss = input.revenue_services * (input.iss_rate || 5) / 100;

        // IRPJ/CSLL baseados na presunção de 32% para serviços
        const base_presuncao = revenue * 0.32;
        const irpj = (base_presuncao * 0.15) + (base_presuncao > 20000 ? (base_presuncao - 20000) * 0.10 : 0);
        const csll = base_presuncao * 0.09;

        const total = pis_cofins + iss + irpj + csll;

        return {
            regime: 'Lucro Presumido',
            pis_cofins,
            irpj_csll: irpj + csll,
            iss,
            total,
            efficiency: 0 // Will be calculated relatively
        };
    }

    /**
     * Cálculo de Lucro Real Não-Cumulativo
     */
    static calculateRealNaoCumulativo(input: TaxAnalisysInput): ScenarioResult {
        const revenue = input.revenue_services + input.revenue_products;
        const credit_base = input.costs_inputs + input.costs_energy + input.costs_rent;

        // PIS (1.65%) e COFINS (7.60%) sobre receita
        const pis_cofins_debito = revenue * 0.0925;
        // Créditos sobre insumos
        const pis_cofins_credito = credit_base * 0.0925;

        const pis_cofins = Math.max(0, pis_cofins_debito - pis_cofins_credito);

        // ISS
        const iss = input.revenue_services * (input.iss_rate || 5) / 100;

        // IRPJ/CSLL (15% + 10% adicional e 9%) sobre o Lucro Líquido (estimado via EBITDA)
        const lucro_real = input.ebitda;
        const irpj = lucro_real > 0 ? (lucro_real * 0.15) + (lucro_real > 20000 ? (lucro_real - 20000) * 0.10 : 0) : 0;
        const csll = lucro_real > 0 ? lucro_real * 0.09 : 0;

        const total = pis_cofins + iss + irpj + csll;

        return {
            regime: 'Lucro Real (Não-Cumulativo)',
            pis_cofins,
            irpj_csll: irpj + csll,
            iss,
            total,
            efficiency: 0
        };
    }

    /**
     * Cálculo de Lucro Real Cumulativo
     */
    static calculateRealCumulativo(input: TaxAnalisysInput): ScenarioResult {
        const revenue = input.revenue_services + input.revenue_products;

        // PIS (0.65%) e COFINS (3%) - Sem créditos
        const pis_cofins = revenue * 0.0365;

        // ISS
        const iss = input.revenue_services * (input.iss_rate || 5) / 100;

        // IRPJ/CSLL sobre o Lucro Líquido Real (estimado via EBITDA)
        const lucro_real = input.ebitda;
        const irpj = lucro_real > 0 ? (lucro_real * 0.15) + (lucro_real > 20000 ? (lucro_real - 20000) * 0.10 : 0) : 0;
        const csll = lucro_real > 0 ? lucro_real * 0.09 : 0;

        const total = pis_cofins + iss + irpj + csll;

        return {
            regime: 'Lucro Real (Cumulativo)',
            pis_cofins,
            irpj_csll: irpj + csll,
            iss,
            total,
            efficiency: 0
        };
    }

    /**
     * Cálculo Simplificado de Simples Nacional
     */
    static calculateSimplesNacional(input: TaxAnalisysInput): ScenarioResult {
        const revenue = input.revenue_services + input.revenue_products;

        // Simulação baseada no Anexo III/V (Média estimada de 15% para serviços de tecnologia)
        const avg_rate = 0.15;
        const total = revenue * avg_rate;

        return {
            regime: 'Simples Nacional',
            pis_cofins: total * 0.20, // Estimativa da fatia do DAS
            irpj_csll: total * 0.30,
            iss: total * 0.50,
            total,
            efficiency: 0
        };
    }

    /**
     * Análise comparativa completa
     */
    static runFullAnalisys(input: TaxAnalisysInput) {
        const scenarios = [
            this.calculatePresumido(input),
            this.calculateRealNaoCumulativo(input),
            this.calculateRealCumulativo(input),
            this.calculateSimplesNacional(input),
        ];

        const min_tax = Math.min(...scenarios.map(s => s.total));

        return scenarios.map(s => ({
            ...s,
            efficiency: Math.round((min_tax / s.total) * 100)
        })).sort((a, b) => a.total - b.total);
    }
}
