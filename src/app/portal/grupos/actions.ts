'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function updateGroupStatus(id: string, status: 'active' | 'archived' | 'deleted') {
    const supabase = createAdminClient();

    const { error } = await supabase
        .from('company_groups')
        .update({ status })
        .eq('id', id);

    if (error) throw error;

    revalidatePath('/portal/grupos');
    return { success: true };
}

export async function updateGroup(id: string, data: { name: string, cnpj_raiz?: string }) {
    const supabase = createAdminClient();

    const { error } = await supabase
        .from('company_groups')
        .update(data)
        .eq('id', id);

    if (error) throw error;

    revalidatePath('/portal/grupos');
    return { success: true };
}

export async function deleteGroupPermanently(id: string) {
    const supabase = createAdminClient();

    const { error } = await supabase
        .from('company_groups')
        .delete()
        .eq('id', id);

    if (error) throw error;

    revalidatePath('/portal/grupos');
    return { success: true };
}
