-- =============================================
-- FBRA SaaS - Estrutura de Banco de Dados
-- Execute este script no SQL Editor do Supabase
-- =============================================

-- 1. Tabela de Grupos Econômicos
CREATE TABLE IF NOT EXISTS company_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    cnpj_raiz TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de Empresas
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES company_groups(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    cnpj TEXT,
    segment TEXT DEFAULT 'Serviços',
    current_regime TEXT DEFAULT 'Lucro Presumido',
    iss_rate NUMERIC(5,2) DEFAULT 5.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Dados Financeiros Mensais (DRE)
CREATE TABLE IF NOT EXISTS monthly_financials (
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
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraint para evitar duplicatas
    UNIQUE(company_id, month, year)
);

-- 4. Índices para Performance
CREATE INDEX IF NOT EXISTS idx_companies_group ON companies(group_id);
CREATE INDEX IF NOT EXISTS idx_financials_company ON monthly_financials(company_id);
CREATE INDEX IF NOT EXISTS idx_financials_period ON monthly_financials(year, month);

-- 5. Políticas de Segurança (RLS)
-- Habilitar RLS nas tabelas
ALTER TABLE company_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_financials ENABLE ROW LEVEL SECURITY;

-- Política: Usuários autenticados podem ver e modificar todos os dados
-- (Em produção, você vai querer restringir por user_id)
CREATE POLICY "Acesso público para usuários autenticados" ON company_groups
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Acesso público para usuários autenticados" ON companies
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Acesso público para usuários autenticados" ON monthly_financials
    FOR ALL USING (auth.role() = 'authenticated');

-- 6. Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. Triggers para atualizar updated_at
DROP TRIGGER IF EXISTS update_company_groups_updated_at ON company_groups;
CREATE TRIGGER update_company_groups_updated_at
    BEFORE UPDATE ON company_groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_monthly_financials_updated_at ON monthly_financials;
CREATE TRIGGER update_monthly_financials_updated_at
    BEFORE UPDATE ON monthly_financials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SCRIPT CONCLUÍDO!
-- Agora você pode salvar dados da DRE no simulador.
-- =============================================
