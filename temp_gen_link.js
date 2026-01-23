const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://qvrgtcukrtfjuigcltgh.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2cmd0Y3VrcnRmanVpZ2NsdGdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODUxNzY4OSwiZXhwIjoyMDg0MDkzNjg5fQ.aS4a0yfS7cguJR0jSWbyjl7dLMciG-BhYGUo4Yll6NM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function generateLink() {
    const email = 'erik.amorim@eafinancialadvisory.com';
    const { data, error } = await supabase.auth.admin.generateLink({
        type: 'invite',
        email: email,
        options: {
            redirectTo: 'https://fbra-saas-dev-cgjf.vercel.app/auth/callback?next=/auth/set-password'
        }
    });

    if (error) {
        fs.writeFileSync('invite_link.txt', 'Erro: ' + error.message);
        return;
    }

    fs.writeFileSync('invite_link.txt', data.properties.action_link);
}

generateLink();
