-- =============================================
-- FBRA SaaS - SISTEMA DE PLANOS E PRECIFICAÇÃO
-- =============================================

-- 1. Tabela de Planos
CREATE TABLE IF NOT EXISTS public.plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    max_users INTEGER DEFAULT 1,
    max_organizations INTEGER DEFAULT 1,
    max_companies INTEGER DEFAULT 5,
    has_parecer BOOLEAN DEFAULT false,
    price NUMERIC(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Adicionar plan_id em Organizations
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS plan_id UUID REFERENCES public.plans(id);

-- 3. Inserir Planos Padrão para Teste
INSERT INTO public.plans (name, max_users, max_organizations, max_companies, has_parecer, price)
VALUES 
('BRONZE', 2, 1, 5, false, 499.00),
('SILVER', 5, 2, 15, true, 999.00),
('GOLD', 15, 5, 50, true, 2499.00)
ON CONFLICT DO NOTHING;

-- 4. Habilitar RLS em Plans
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Qualquer usuário autenticado pode ver os planos" ON public.plans
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Apenas admins podem modificar planos" ON public.plans
    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
