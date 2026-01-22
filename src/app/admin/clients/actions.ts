'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function getClients() {
    const supabase = createAdminClient();

    const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) throw authError;

    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'client')
        .order('created_at', { ascending: false });

    if (profileError) throw profileError;

    const { data: groups, error: groupsError } = await supabase
        .from('company_groups')
        .select('id, name, owner_id');

    if (groupsError) throw groupsError;

    return profiles.map(profile => {
        const authUser = authUsers.find(u => u.id === profile.id);
        const ownedGroups = groups.filter(g => g.owner_id === profile.id);

        return {
            ...profile,
            email: authUser?.email || 'N/A',
            groups: ownedGroups,
            status: (authUser?.email_confirmed_at || authUser?.last_sign_in_at) ? 'active' : 'pending'
        };
    });
}

export async function getCompanyGroups() {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('company_groups')
        .select('id, name, owner_id')
        .order('name');

    if (error) throw error;
    return data;
}

export async function inviteClient(email: string, fullName: string, groupIds: string[]) {
    const supabase = createAdminClient();

    // 1. Invite user
    const { data: authData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
        data: { full_name: fullName }
    });

    if (inviteError) throw inviteError;

    // 2. Create/Update profile
    const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
            id: authData.user.id,
            full_name: fullName,
            role: 'client',
            status: 'pending'
        });

    if (profileError) throw profileError;

    // 3. Link to groups by updating the owner_id in company_groups
    if (groupIds && groupIds.length > 0) {
        const { error: linkError } = await supabase
            .from('company_groups')
            .update({ owner_id: authData.user.id })
            .in('id', groupIds);

        if (linkError) throw linkError;
    }

    revalidatePath('/admin/clients');
    return { success: true };
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
