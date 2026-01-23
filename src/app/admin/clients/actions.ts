'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function getClients() {
    const supabase = createAdminClient();

    const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) throw authError;

    // Fetch profiles with organization and plan join
    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select(`
            *,
            organizations (
                id,
                name,
                plans (
                    id,
                    name,
                    max_users,
                    max_companies,
                    has_parecer
                )
            )
        `)
        .eq('role', 'client')
        .order('created_at', { ascending: false });

    if (profileError) throw profileError;

    return profiles.map(profile => {
        const authUser = authUsers.find(u => u.id === profile.id);
        const org = profile.organizations;
        const plan = org?.plans;

        return {
            ...profile,
            email: authUser?.email || 'N/A',
            organization_name: org?.name || 'Sem Org',
            plan: plan || null,
            status: (authUser?.email_confirmed_at || authUser?.last_sign_in_at) ? 'active' : 'pending'
        };
    });
}

export async function getPlans() {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('price', { ascending: true });

    if (error) throw error;
    return data;
}

export async function inviteClient(email: string, fullName: string, orgName: string, planId: string) {
    try {
        const supabase = createAdminClient();

        // 1. Invite user
        const { data: authData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
            data: { full_name: fullName },
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://fbra-saas-dev-cgjf.vercel.app'}/auth/callback?next=/auth/set-password`
        });

        if (inviteError) return { error: inviteError.message };
        if (!authData.user) return { error: 'Falha ao gerar usuário.' };

        // 2. Create Organization for this client with plan
        const { data: orgData, error: orgError } = await supabase
            .from('organizations')
            .insert({
                name: orgName,
                plan_id: planId
            })
            .select()
            .single();

        if (orgError) return { error: orgError.message };

        // 3. Create/Update profile linked to Organization
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
                id: authData.user.id,
                full_name: fullName,
                role: 'client',
                status: 'pending',
                org_id: orgData.id,
                is_org_admin: true // The client is use admin of their org
            });

        if (profileError) return { error: profileError.message };

        revalidatePath('/admin/clients');
        return { success: true };
    } catch (err: any) {
        console.error('Invite Client Error:', err);
        return { error: err.message || 'Erro inesperado ao convidar cliente.' };
    }
}

export async function updateClientGroups(clientId: string, groupIds: string[]) {
    const supabase = createAdminClient();

    // Reset current ownership for this user
    await supabase.from('company_groups').update({ owner_id: null }).eq('owner_id', clientId);

    // Set new ownership
    if (groupIds && groupIds.length > 0) {
        const { error } = await supabase.from('company_groups').update({ owner_id: clientId }).in('id', groupIds);
        if (error) throw error;
    }

    revalidatePath('/admin/clients');
    return { success: true };
}
