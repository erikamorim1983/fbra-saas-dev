-- =============================================
-- FBRA SaaS - CORREÇÃO DO BANCO DE DADOS
-- Execute este script no SQL Editor do Supabase
-- =============================================

-- 1. Remover triggers problemáticos
DROP TRIGGER IF EXISTS update_monthly_financials_updated_at ON monthly_financials;
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
DROP TRIGGER IF EXISTS update_company_groups_updated_at ON company_groups;

-- 2. Dropar a tabela monthly_financials e recriar corretamente
DROP TABLE IF EXISTS monthly_financials;

-- 3. Recriar a tabela monthly_financials COM a coluna updated_at
CREATE TABLE monthly_financials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    year INTEGER NOT NULL DEFAULT 2024,
    
    -- Receitas
    revenue_services NUMERIC(15,2) DEFAULT 0,
    revenue_products NUMERIC(15,2) DEFAULT 0,
    
    -- Custos
    costs_personnel NUMERIC(15,2) DEFAULT 0,
    costs_inputs NUMERIC(15,2) DEFAULT 0,
    costs_energy NUMERIC(15,2) DEFAULT 0,
    costs_rent NUMERIC(15,2) DEFAULT 0,
    
    -- Despesas Operacionais
    opex_marketing NUMERIC(15,2) DEFAULT 0,
    opex_admin NUMERIC(15,2) DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraint para evitar duplicatas
    UNIQUE(company_id, month, year)
);

-- 4. Índice para performance
CREATE INDEX IF NOT EXISTS idx_financials_company ON monthly_financials(company_id);
CREATE INDEX IF NOT EXISTS idx_financials_period ON monthly_financials(year, month);

-- 5. Habilitar RLS
ALTER TABLE monthly_financials ENABLE ROW LEVEL SECURITY;

-- 6. Política de acesso
DROP POLICY IF EXISTS "Acesso público para usuários autenticados" ON monthly_financials;
CREATE POLICY "Acesso público para usuários autenticados" ON monthly_financials
    FOR ALL USING (auth.role() = 'authenticated');

-- =============================================
-- CORREÇÃO CONCLUÍDA!
-- Agora tente salvar novamente.
-- =============================================
