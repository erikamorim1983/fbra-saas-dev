-- =============================================
-- FBRA SaaS - CORREÇÃO DE POLÍTICAS RLS
-- Execute este script no SQL Editor do Supabase
-- =============================================

-- 1. Verificar e recriar políticas para company_groups
DROP POLICY IF EXISTS "Acesso público para usuários autenticados" ON company_groups;
CREATE POLICY "Permitir tudo para autenticados" ON company_groups
    FOR ALL 
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 2. Verificar e recriar políticas para companies
DROP POLICY IF EXISTS "Acesso público para usuários autenticados" ON companies;
CREATE POLICY "Permitir tudo para autenticados" ON companies
    FOR ALL 
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 3. Verificar e recriar políticas para monthly_financials
DROP POLICY IF EXISTS "Acesso público para usuários autenticados" ON monthly_financials;
CREATE POLICY "Permitir tudo para autenticados" ON monthly_financials
    FOR ALL 
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- =============================================
-- POLÍTICAS CORRIGIDAS!
-- Agora tente cadastrar a empresa novamente.
-- =============================================
