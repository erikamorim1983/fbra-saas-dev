'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function getUsers() {
    const supabase = createAdminClient();

    const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) throw authError;

    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*');

    if (profileError) throw profileError;

    // Return all auth users, merging profile data if it exists
    return authUsers.map(authUser => {
        const profile = profiles.find(p => p.id === authUser.id);

        // Status logic:
        // 1. Priority to profile.status (blocked/active/pending)
        // 2. If they have logged in or confirmed email, they are 'active' by default
        let calculatedStatus = profile?.status || 'pending';

        if (calculatedStatus === 'pending' && (authUser.last_sign_in_at || authUser.email_confirmed_at)) {
            calculatedStatus = 'active';
        }

        return {
            id: authUser.id,
            email: authUser.email,
            full_name: profile?.full_name || authUser.user_metadata?.full_name || 'Usuário Convidado',
            role: profile?.role || 'admin', // Default to admin for your current users for testing
            status: calculatedStatus,
            cpf: profile?.cpf || '',
            phone: profile?.phone || '',
            address: profile?.address || '',
            job_title: profile?.job_title || '',
            created_at: authUser.created_at
        };
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function inviteUser(email: string, fullName: string, role: string) {
    try {
        const supabase = createAdminClient();

        const { data: authData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
            data: { full_name: fullName },
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://fbra-saas-dev-cgjf.vercel.app'}/auth/callback?next=/auth/set-password`
        });

        if (inviteError) return { error: inviteError.message };
        if (!authData.user) return { error: 'Falha ao gerar usuário.' };

        // Force create/update profile using upsert
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
                id: authData.user.id,
                full_name: fullName,
                role: role,
                status: 'pending'
            });

        if (profileError) return { error: profileError.message };

        revalidatePath('/admin/settings/users');
        return { success: true };
    } catch (err: any) {
        console.error('Invite Error:', err);
        return { error: err.message || 'Erro inesperado ao convidar usuário.' };
    }
}

export async function updateUser(id: string, updates: any) {
    const supabase = createAdminClient();

    // Use upsert to ensure the profile exists and update the fields
    const { error, data } = await supabase
        .from('profiles')
        .upsert({
            id: id,
            ...updates,
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'id'
        });

    if (error) {
        console.error('Erro ao atualizar perfil:', error);
        throw new Error(error.message);
    }

    revalidatePath('/admin/settings/users');
    return { success: true };
}

export async function deleteUser(id: string) {
    const supabase = createAdminClient();

    const { error: authError } = await supabase.auth.admin.deleteUser(id);
    if (authError) throw authError;

    // Profiles usually CASCADE delete if set up, but let's be safe
    await supabase.from('profiles').delete().eq('id', id);

    revalidatePath('/admin/settings/users');
    return { success: true };
}

export async function generateInviteLink(email: string) {
    const supabase = createAdminClient();

    const { data, error } = await supabase.auth.admin.generateLink({
        type: 'invite',
        email: email,
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://fbra-saas-dev-cgjf.vercel.app'}/auth/callback?next=/auth/set-password`
        }
    });

    if (error) return { error: error.message };
    return { link: data.properties.action_link };
}
