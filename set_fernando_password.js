const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qvrgtcukrtfjuigcltgh.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2cmd0Y3VrcnRmanVpZ2NsdGdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODUxNzY4OSwiZXhwIjoyMDg0MDkzNjg5fQ.aS4a0yfS7cguJR0jSWbyjl7dLMciG-BhYGUo4Yll6NM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setFernandoPassword() {
    const email = 'fernandocbrasil@gmail.com';
    const tempPassword = 'Fbra@2026';

    console.log(`Tentando definir senha para: ${email}...`);

    const { data, error } = await supabase.auth.admin.updateUserById(
        '74b34e09-faec-43c6-b7dc-4433876af21a', // ID do Fernando que vi no seu print
        {
            password: tempPassword,
            email_confirm: true
        }
    );

    if (error) {
        console.error('Erro ao definir senha:', error.message);
        return;
    }

    console.log('--- SENHA DO FERNANDO DEFINIDA COM SUCESSO ---');
    console.log(`E-mail: ${email}`);
    console.log(`Senha: ${tempPassword}`);
    console.log('----------------------------------------------');
}

setFernandoPassword();
