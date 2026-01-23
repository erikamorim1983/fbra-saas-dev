const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qvrgtcukrtfjuigcltgh.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2cmd0Y3VrcnRmanVpZ2NsdGdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODUxNzY4OSwiZXhwIjoyMDg0MDkzNjg5fQ.aS4a0yfS7cguJR0jSWbyjl7dLMciG-BhYGUo4Yll6NM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkProfile() {
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', 'ad2639f5-cb09-4601-8818-7a77ced4d59c')
        .single();

    if (error) {
        console.log('Perfil não encontrado, tentando criar...');
        const { error: insertError } = await supabase
            .from('profiles')
            .upsert({
                id: 'ad2639f5-cb09-4601-8818-7a77ced4d59c',
                full_name: 'Erik EA',
                role: 'admin',
                status: 'active'
            });

        if (insertError) console.error('Erro ao criar perfil:', insertError.message);
        else console.log('Perfil criado com sucesso!');
    } else {
        console.log('Perfil encontrado:', profile.full_name);
    }
}

checkProfile();
