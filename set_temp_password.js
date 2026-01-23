const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qvrgtcukrtfjuigcltgh.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2cmd0Y3VrcnRmanVpZ2NsdGdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODUxNzY4OSwiZXhwIjoyMDg0MDkzNjg5fQ.aS4a0yfS7cguJR0jSWbyjl7dLMciG-BhYGUo4Yll6NM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setUserPassword() {
    const email = 'erik.amorim@eafinancialadvisory.com';
    const tempPassword = 'Fbra@2026';

    console.log(`Tentando definir senha para: ${email}...`);

    const { data, error } = await supabase.auth.admin.updateUserById(
        'ad2639f5-cb09-4601-8818-7a77ced4d59c', // ID do Erik EA que vi no seu print
        {
            password: tempPassword,
            email_confirm: true
        }
    );

    if (error) {
        console.error('Erro ao definir senha:', error.message);
        return;
    }

    console.log('--- SENHA DEFINIDA COM SUCESSO ---');
    console.log(`E-mail: ${email}`);
    console.log(`Senha Temporária: ${tempPassword}`);
    console.log('Agora você pode logar direto na tela de login.');
    console.log('-----------------------------------');
}

setUserPassword();
