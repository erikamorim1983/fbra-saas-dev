-- =============================================
-- FBRA SaaS - GESTÃO DE STATUS DE EMPRESAS
-- =============================================

-- 1. Adicionar coluna status em companies se não existir
-- Reutilizando o tipo group_status que já criamos para company_groups
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS status group_status DEFAULT 'active'::group_status;

-- 2. Índice para performance
CREATE INDEX IF NOT EXISTS idx_companies_status ON public.companies(status);

-- 3. Garantir que empresas antigas sejam 'active'
UPDATE public.companies SET status = 'active' WHERE status IS NULL;
