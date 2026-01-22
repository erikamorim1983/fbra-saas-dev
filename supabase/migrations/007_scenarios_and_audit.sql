-- =============================================
-- FBRA SaaS - MOTOR DE CENÁRIOS E INTELIGÊNCIA FISCAL
-- =============================================

-- 1. Tabela de Cenários Tributários (O Coração do Planejamento)
CREATE TABLE IF NOT EXISTS public.tax_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.company_groups(id) ON DELETE CASCADE,
    org_id UUID REFERENCES public.organizations(id),
    name TEXT NOT NULL,
    year INTEGER NOT NULL,
    is_main BOOLEAN DEFAULT false,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Configurações Específicas de cada Empresa por Cenário
-- Permite testar uma empresa como Simples no Cenário A e como Lucro Real no Cenário B
CREATE TABLE IF NOT EXISTS public.company_scenario_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scenario_id UUID NOT NULL REFERENCES public.tax_scenarios(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    tax_regime TEXT NOT NULL, -- 'simples', 'presumido', 'real'
    aliquot_adjustment NUMERIC(10,4) DEFAULT 0,
    is_active_in_scenario BOOLEAN DEFAULT true, -- Permite simular a exclusão de uma empresa do grupo
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(scenario_id, company_id)
);

-- 3. Vincular dados financeiros ao cenário
ALTER TABLE public.monthly_financials ADD COLUMN IF NOT EXISTS scenario_id UUID REFERENCES public.tax_scenarios(id) ON DELETE CASCADE;

-- 4. Tabela de Logs de Auditoria (Conformidade ISO 27001)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES public.organizations(id),
    user_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE', 'DUPLICATE'
    entity_type TEXT NOT NULL, -- 'scenario', 'company', 'financials'
    entity_id UUID NOT NULL,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Habilitar RLS nas novas tabelas
ALTER TABLE public.tax_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_scenario_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 6. Políticas de Segurança (Isolamento por Organização)
CREATE POLICY "Tenancy: Scenarios" ON public.tax_scenarios
    FOR ALL USING (org_id = (SELECT org_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Tenancy: Scenario Configs" ON public.company_scenario_configs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tax_scenarios s 
            WHERE s.id = scenario_id 
            AND s.org_id = (SELECT org_id FROM profiles WHERE id = auth.uid())
        )
    );

CREATE POLICY "Tenancy: Audit Logs" ON public.audit_logs
    FOR SELECT USING (org_id = (SELECT org_id FROM profiles WHERE id = auth.uid()));

-- 7. Trigger para Carimbo Automático de org_id nos Cenários
CREATE TRIGGER trigger_set_org_id_on_scenarios
    BEFORE INSERT ON public.tax_scenarios
    FOR EACH ROW EXECUTE FUNCTION public.set_org_id_from_profile();

-- 8. Migração: Criar cenário padrão para grupos existentes
DO $$
DECLARE
    group_record RECORD;
    new_scenario_id UUID;
BEGIN
    FOR group_record IN SELECT id, org_id, name FROM public.company_groups LOOP
        IF NOT EXISTS (SELECT 1 FROM public.tax_scenarios WHERE group_id = group_record.id) THEN
            INSERT INTO public.tax_scenarios (group_id, org_id, name, year, is_main)
            VALUES (group_record.id, group_record.org_id, 'Cenário Base - 2024', 2024, true)
            RETURNING id INTO new_scenario_id;

            -- Vincular financeiros existentes a este cenário
            UPDATE public.monthly_financials 
            SET scenario_id = new_scenario_id 
            WHERE company_id IN (SELECT id FROM companies WHERE group_id = group_record.id);
        END IF;
    END LOOP;
END $$;
