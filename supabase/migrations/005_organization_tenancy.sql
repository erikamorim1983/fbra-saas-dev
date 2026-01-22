-- =============================================
-- FBRA SaaS - SISTEMA DE MULTI-TENANCY (SEGURANÇA MÁXIMA)
-- =============================================

-- 1. Tabela de Organizações
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Adicionar org_id em Perfis
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES public.organizations(id);

-- 3. Adicionar org_id em Grupos Econômicos
ALTER TABLE public.company_groups ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES public.organizations(id);

-- 4. Habilitar RLS em Organizations
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins podem ver todas as organizações" ON public.organizations
    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Usuários veem sua própria organização" ON public.organizations
    FOR SELECT USING (id = (SELECT org_id FROM profiles WHERE id = auth.uid()));

-- 5. Atualizar RLS de Company Groups para usar org_id (Segurança Blindada)
DROP POLICY IF EXISTS "Clientes acessam apenas seus grupos" ON company_groups;

CREATE POLICY "Clientes acessam apenas grupos de sua organização" ON company_groups
    FOR ALL TO authenticated
    USING (
        org_id = (SELECT org_id FROM profiles WHERE id = auth.uid())
    );

-- 6. Atualizar a lógica de criação de perfil para suportar convites vinculados
-- Vamos ajustar o handle_new_user para não tentar adivinhar a organização,
-- a organização será setada via Admin/Action no convite ou no primeiro acesso.

-- 8. Trigger para Setar org_id Automático (Segurança Máxima)
CREATE OR REPLACE FUNCTION public.set_org_id_from_profile()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.org_id IS NULL THEN
        NEW.org_id = (SELECT org_id FROM profiles WHERE id = auth.uid());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_set_org_id_on_company_groups ON company_groups;
CREATE TRIGGER trigger_set_org_id_on_company_groups
    BEFORE INSERT ON company_groups
    FOR EACH ROW EXECUTE FUNCTION public.set_org_id_from_profile();

-- 9. Migração de dados existentes (Garantir integridade)
DO $$
DECLARE
    client_record RECORD;
    new_org_id UUID;
BEGIN
    FOR client_record IN SELECT id, full_name FROM public.profiles WHERE role = 'client' AND org_id IS NULL LOOP
        INSERT INTO public.organizations (name) VALUES (COALESCE(client_record.full_name, 'Organização de ' || client_record.full_name)) RETURNING id INTO new_org_id;
        UPDATE public.profiles SET org_id = new_org_id WHERE id = client_record.id;
        UPDATE public.company_groups SET org_id = new_org_id WHERE owner_id = client_record.id;
    END LOOP;
END $$;
