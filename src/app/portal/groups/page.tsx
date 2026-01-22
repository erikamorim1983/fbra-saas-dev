'use client';

import { useEffect, useState } from 'react';
import {
    Building2,
    Plus,
    Search,
    MoreVertical,
    LayoutGrid,
    List,
    AlertTriangle,
    FileCheck,
    RefreshCcw
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function GroupsPage() {
    const supabase = createClient();
    const [groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchGroups() {
            try {
                const { data, error } = await supabase
                    .from('company_groups')
                    .select(`
            id,
            name,
            cnpj_raiz,
            companies (
              id,
              name,
              cnpj,
              current_regime
            )
          `);

                if (error) throw error;
                setGroups(data || []);
            } catch (error) {
                console.error('Error fetching groups:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchGroups();
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Meus Grupos de Empresas</h1>
                    <p className="text-primary/50">Gerencie e analise holdings de forma consolidada.</p>
                </div>
                <Link
                    href="/portal/groups/new"
                    className="px-6 py-3 bg-accent text-primary rounded-xl text-sm font-bold hover:scale-105 transition-all shadow-xl shadow-accent/20 flex items-center gap-2"
                >
                    <Plus className="h-5 w-5" />
                    Novo Grupo
                </Link>
            </div>

            <div className="flex gap-4 items-center bg-white p-4 rounded-2xl border border-slate-200">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                    <input
                        type="text"
                        placeholder="Buscar grupo ou CNPJ..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent transition-all"
                    />
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button className="p-2 bg-white rounded-md shadow-sm"><LayoutGrid className="h-4 w-4 text-primary" /></button>
                    <button className="p-2 text-primary/40 hover:text-primary transition-colors"><List className="h-4 w-4" /></button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                    <RefreshCcw className="h-8 w-8 animate-spin text-accent" />
                    <p className="font-bold text-sm text-primary uppercase tracking-widest">Sincronizando com Supabase...</p>
                </div>
            ) : groups.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                    <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-400">Nenhum grupo encontrado. Comece criando um novo!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map((group) => (
                        <div key={group.id} className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-accent/30 transition-all group flex flex-col shadow-sm">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-primary transition-all">
                                    <Building2 className="h-6 w-6" />
                                </div>
                                <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                                    <MoreVertical className="h-5 w-5 text-primary/20" />
                                </button>
                            </div>

                            <h3 className="text-xl font-bold text-primary mb-1">{group.name}</h3>
                            <p className="text-xs font-mono text-primary/40 mb-6 tracking-tight">CNPJ RAIZ: {group.cnpj_raiz || 'Não informado'}</p>

                            <div className="space-y-3 mb-8">
                                <div className="flex justify-between text-xs">
                                    <span className="text-primary/40 font-medium">Empresas</span>
                                    <span className="font-bold text-primary">{group.companies?.length || 0} Unidades</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-primary/40 font-medium">Status</span>
                                    <span className="font-bold text-green-600 flex items-center gap-1">
                                        <FileCheck className="h-3 w-3" />
                                        Ativo
                                    </span>
                                </div>
                            </div>

                            <Link
                                href={`/portal/groups/${group.id}`}
                                className="w-full py-4 bg-slate-50 hover:bg-primary hover:text-white text-center rounded-xl text-sm font-bold transition-all text-primary"
                            >
                                Detalhes do Grupo
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
