-- =============================================
-- FBRA SaaS - STORAGE PARA LOGOTIPOS
-- =============================================

-- 1. Criar Bucket para Logos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Políticas de Acesso ao Storage
-- Permitir que qualquer um leia (público)
CREATE POLICY "Logos são públicas" ON storage.objects
    FOR SELECT USING (bucket_id = 'logos');

-- Permitir que usuários autenticados façam upload para sua própria pasta org
CREATE POLICY "Usuários fazem upload para sua org" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'logos' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Usuários atualizam suas próprias logos" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'logos' 
        AND auth.role() = 'authenticated'
    );
