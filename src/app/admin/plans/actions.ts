'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function getPlans() {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('price', { ascending: true });

    if (error) throw error;
    return data;
}

export async function upsertPlan(plan: any) {
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from('plans')
        .upsert({
            id: plan.id || undefined,
            name: plan.name,
            max_users: parseInt(plan.max_users),
            max_organizations: parseInt(plan.max_organizations),
            max_companies: parseInt(plan.max_companies),
            has_parecer: plan.has_parecer,
            price: parseFloat(plan.price)
        })
        .select()
        .single();

    if (error) throw error;

    revalidatePath('/admin/plans');
    return data;
}

export async function deletePlan(id: string) {
    const supabase = createAdminClient();

    const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', id);

    if (error) throw error;

    revalidatePath('/admin/plans');
    return { success: true };
}
