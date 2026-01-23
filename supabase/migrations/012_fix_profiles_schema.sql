-- =============================================
-- FBRA SaaS - CORREÇÃO DO SCHEMA DE PERFIS
-- =============================================

-- 1. Criar Tipo para Status de Usuário se não existir
DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('active', 'pending', 'blocked');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Adicionar colunas faltantes na tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS status user_status DEFAULT 'active'::user_status,
ADD COLUMN IF NOT EXISTS cpf TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS job_title TEXT;

-- 3. Garantir que perfis existentes tenham status 'active' se já logam
UPDATE public.profiles 
SET status = 'active' 
WHERE status IS NULL;

-- 4. Criar índices para busca
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
