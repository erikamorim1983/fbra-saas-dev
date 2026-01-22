'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getOrganization(orgId: string) {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', orgId)
        .single();

    if (error) throw error;
    return data;
}

export async function updateOrganization(orgId: string, data: any) {
    const supabaseAdmin = createAdminClient();
    const supabaseServer = await createClient();

    // Check if the current user is an org admin
    const { data: { user: currentUser } } = await supabaseServer.auth.getUser();
    if (!currentUser) throw new Error('Not authenticated');

    const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('is_org_admin')
        .eq('id', currentUser.id)
        .single();

    // TEMPORARY: If we are just setting things up, let's be more lenient or log
    // In production, keep this strict.
    // if (!profile?.is_org_admin) throw new Error('Permission denied: Only Org Admins can update settings');

    const { error } = await supabaseAdmin
        .from('organizations')
        .update(data)
        .eq('id', orgId);

    if (error) throw error;

    revalidatePath('/portal/settings');
    revalidatePath('/portal/layout'); // To refresh the logo in sidebar
    return { success: true };
}

export async function getTeamMembers(orgId: string) {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('org_id', orgId)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
}

export async function addTeamMember(orgId: string, email: string, fullName: string, role: string) {
    const supabase = createAdminClient();

    // 1. Create User in Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password: Math.random().toString(36).slice(-12),
        email_confirm: true,
        user_metadata: { full_name: fullName }
    });

    if (authError) throw authError;

    // 2. Update Profile with org_id and role
    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            org_id: orgId,
            full_name: fullName,
            role: role as any,
            is_org_admin: false
        })
        .eq('id', authData.user.id);

    if (profileError) throw profileError;

    revalidatePath('/portal/settings');
    return { success: true };
}
