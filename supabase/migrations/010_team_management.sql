-- =============================================
-- FBRA SaaS - GESTÃO DE EQUIPE E PERMISSÕES ORGANIZACIONAIS
-- =============================================

-- 1. Adicionar flag de administrador da organização no perfil
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_org_admin BOOLEAN DEFAULT false;

-- 2. Garantir que o primeiro usuário de uma organização seja o admin
-- (Isso geralmente é feito na criação da org, mas vamos garantir via política ou trigger se necessário)

-- 3. Política para membros verem outros membros da mesma organização
DROP POLICY IF EXISTS "Membros veem outros membros da mesma org" ON public.profiles;
CREATE POLICY "Membros veem outros membros da mesma org" ON public.profiles
    FOR SELECT USING (
        org_id = (SELECT org_id FROM public.profiles WHERE id = auth.uid())
    );

-- 4. Somente admins da org podem atualizar dados da org (atualizando a política anterior)
DROP POLICY IF EXISTS "Usuários podem atualizar sua própria organização" ON public.organizations;
CREATE POLICY "Admins da org podem atualizar sua organização" 
    ON public.organizations
    FOR UPDATE 
    USING (
        id = (SELECT org_id FROM profiles WHERE id = auth.uid())
        AND (SELECT is_org_admin FROM profiles WHERE id = auth.uid()) = true
    );
