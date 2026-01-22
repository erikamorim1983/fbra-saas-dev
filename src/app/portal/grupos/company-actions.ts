'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function updateCompanyStatus(id: string, groupId: string, status: 'active' | 'archived' | 'deleted') {
    const supabase = createAdminClient();

    const { error } = await supabase
        .from('companies')
        .update({ status })
        .eq('id', id);

    if (error) throw error;

    revalidatePath(`/portal/grupos/${groupId}`);
    return { success: true };
}

export async function updateCompany(id: string, groupId: string, data: any) {
    const supabase = createAdminClient();

    const { error } = await supabase
        .from('companies')
        .update(data)
        .eq('id', id);

    if (error) throw error;

    revalidatePath(`/portal/grupos/${groupId}`);
    return { success: true };
}

export async function deleteCompanyPermanently(id: string, groupId: string) {
    const supabase = createAdminClient();

    const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

    if (error) throw error;

    revalidatePath(`/portal/grupos/${groupId}`);
    return { success: true };
}
