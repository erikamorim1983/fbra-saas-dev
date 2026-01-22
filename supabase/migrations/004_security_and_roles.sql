-- =============================================
-- FBRA SaaS - SISTEMA DE SEGURANÇA E PERFIS (ISO-READY)
-- Execute este script no SQL Editor do Supabase
-- =============================================

-- 1. Criar Tipo Customizado para Funções/Roles
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'consultant', 'client');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Tabela de Perfis de Usuários
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    role user_role DEFAULT 'client'::user_role,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS em Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de Profiles
CREATE POLICY "Profiles são visíveis pelos próprios usuários" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins podem ver todos os profiles" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Usuários podem atualizar seus próprios profiles" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 3. Função para Inserção Automática de Perfil no Registro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'client');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para Novos Usuários
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Atualizar Company Groups para Tenancy
ALTER TABLE IF EXISTS public.company_groups 
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES public.profiles(id);

-- 5. Atualizar RLS (Segurança de Informação Estrita)
-- Primeiro, removemos as políticas abertas antigas
DROP POLICY IF EXISTS "Permitir tudo para autenticados" ON company_groups;
DROP POLICY IF EXISTS "Permitir tudo para autenticados" ON companies;
DROP POLICY IF EXISTS "Permitir tudo para autenticados" ON monthly_financials;

-- Políticas Estritas de Company Groups
CREATE POLICY "Admins acessam todos os grupos" ON company_groups
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Clientes acessam apenas seus grupos" ON company_groups
    FOR ALL TO authenticated
    USING (owner_id = auth.uid());

CREATE POLICY "Consultores acessam grupos atribuídos" ON company_groups
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'consultant'));

-- Políticas Estritas de Companies (Cascateia do Company Group)
CREATE POLICY "Admins acessam todas as empresas" ON companies
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Clientes acessam apenas suas empresas" ON companies
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM company_groups 
            WHERE company_groups.id = companies.group_id 
            AND company_groups.owner_id = auth.uid()
        )
    );

-- Políticas Estritas de Monthly Financials
CREATE POLICY "Admins acessam todos os dados financeiros" ON monthly_financials
    FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Clientes acessam apenas seus dados financeiros" ON monthly_financials
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM companies
            JOIN company_groups ON companies.group_id = company_groups.id
            WHERE companies.id = monthly_financials.company_id
            AND company_groups.owner_id = auth.uid()
        )
    );

-- 6. Auditoria Básica (Opcional, mas bom para ISO)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    table_name TEXT,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins veem todos os audit logs" ON audit_logs
    FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- =============================================
-- SEGURANÇA CONFIGURADA!
-- A plataforma agora isola dados por cliente (Tenancy)
-- e permite controle centralizado pelo Portal Adm.
-- =============================================
