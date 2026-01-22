-- =============================================
-- FBRA SaaS - GESTÃO DE STATUS DE GRUPOS
-- =============================================

-- 1. Criar Tipo para Status de Grupo se não existir
DO $$ BEGIN
    CREATE TYPE group_status AS ENUM ('active', 'archived', 'deleted');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Adicionar coluna status em company_groups
ALTER TABLE public.company_groups ADD COLUMN IF NOT EXISTS status group_status DEFAULT 'active'::group_status;

-- 3. Índice para performance em filtros de status
CREATE INDEX IF NOT EXISTS idx_company_groups_status ON public.company_groups(status);

-- 4. Atualizar RLS para considerar o status (opcional, mas bom para garantir q 'deleted' suma rápido)
-- Por enquanto manteremos apenas o filtro no código para facilitar.
