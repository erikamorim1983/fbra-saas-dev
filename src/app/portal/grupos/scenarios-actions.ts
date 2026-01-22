'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function getScenarios(groupId: string) {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('tax_scenarios')
        .select('*')
        .eq('group_id', groupId)
        .order('is_main', { ascending: false })
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function createScenario(groupId: string, name: string, year: number, description?: string) {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('tax_scenarios')
        .insert({
            group_id: groupId,
            name,
            year,
            description
        })
        .select()
        .single();

    if (error) throw error;
    revalidatePath(`/portal/grupos/${groupId}`);
    return data;
}

export async function duplicateScenario(scenarioId: string, newName: string) {
    const supabase = createAdminClient();

    // 1. Get original scenario
    const { data: original, error: getError } = await supabase
        .from('tax_scenarios')
        .select('*')
        .eq('id', scenarioId)
        .single();
    if (getError) throw getError;

    // 2. Create new scenario
    const { data: newScenario, error: createError } = await supabase
        .from('tax_scenarios')
        .insert({
            group_id: original.group_id,
            name: newName,
            year: original.year,
            description: `Cópia de ${original.name}`,
            org_id: original.org_id
        })
        .select()
        .single();
    if (createError) throw createError;

    // 3. Clone financial data
    const { data: financials, error: finError } = await supabase
        .from('monthly_financials')
        .select('*')
        .eq('scenario_id', scenarioId);
    if (finError) throw finError;

    if (financials && financials.length > 0) {
        const clonedFinancials = financials.map(({ id, created_at, updated_at, scenario_id, ...rest }) => ({
            ...rest,
            scenario_id: newScenario.id
        }));

        const { error: insertFinError } = await supabase
            .from('monthly_financials')
            .insert(clonedFinancials);
        if (insertFinError) throw insertFinError;
    }

    revalidatePath(`/portal/grupos/${original.group_id}`);
    return newScenario;
}
