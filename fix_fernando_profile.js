const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qvrgtcukrtfjuigcltgh.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2cmd0Y3VrcnRmanVpZ2NsdGdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODUxNzY4OSwiZXhwIjoyMDg0MDkzNjg5fQ.aS4a0yfS7cguJR0jSWbyjl7dLMciG-BhYGUo4Yll6NM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixFernandoProfile() {
    const userId = '74b34e09-faec-43c6-b7dc-4433876af21a'; // ID do Fernando

    console.log(`Verificando perfil para: ${userId}...`);

    const { data: profile, error: selectError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (selectError || !profile) {
        console.log('Perfil não encontrado. Criando agora...');

        // Tenta criar o perfil. Se falhar, talvez seja falta da migração de colunas.
        const { error: insertError } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                full_name: 'Fernando Brasil',
                role: 'admin',
                status: 'active'
            });

        if (insertError) {
            console.error('Erro ao criar perfil:', insertError.message);
            if (insertError.message.includes('column "status" does not exist')) {
                console.log('--- AVISO: Você ainda não rodou a migração 012 no SQL Editor do Supabase! ---');
            }
        } else {
            console.log('--- PERFIL DO FERNANDO CRIADO COM SUCESSO ---');
        }
    } else {
        console.log('Perfil já existe:', profile.full_name);
    }
}

fixFernandoProfile();
