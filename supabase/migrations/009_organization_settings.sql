-- =============================================
-- FBRA SaaS - CONFIGURAÇÕES DA ORGANIZAÇÃO
-- =============================================

-- 1. Adicionar colunas de branding e contato em organizations
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS cnpj TEXT;
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS plan_type TEXT DEFAULT 'Basic'; -- Basic, Pro, Enterprise

-- 2. Permitir que usuários atualizem sua própria organização (RLS)
CREATE POLICY "Usuários podem atualizar sua própria organização" 
    ON public.organizations
    FOR UPDATE 
    USING (id = (SELECT org_id FROM profiles WHERE id = auth.uid()))
    WITH CHECK (id = (SELECT org_id FROM profiles WHERE id = auth.uid()));
