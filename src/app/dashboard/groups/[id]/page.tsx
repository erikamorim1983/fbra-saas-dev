'use client';

import { useEffect, useState, useCallback } from 'react';
import {
    Building2,
    ArrowLeft,
    Plus,
    Search,
    MoreVertical,
    AlertTriangle,
    RefreshCcw,
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';
import NewCompanyModal from '@/components/NewCompanyModal';

export default function GroupDetailsPage() {
    const { id } = useParams();
    const [group, setGroup] = useState<any>(null);
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const { data: groupData, error: groupError } = await supabase
                .from('company_groups')
                .select('*')
                .eq('id', id as string)
                .single();

            if (groupError) throw groupError;
            setGroup(groupData);

            const { data: companiesData, error: companiesError } = await supabase
                .from('companies')
                .select('*')
                .eq('group_id', id as string);

            if (companiesError) throw companiesError;
            setCompanies(companiesData || []);
        } catch (error) {
            console.error('Error fetching group details:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchData();
    }, [id, fetchData]);

    if (loading && !group) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4 opacity-50">
                <RefreshCcw className="h-8 w-8 animate-spin text-accent" />
                <p className="font-bold text-sm text-primary uppercase tracking-widest leading-relaxed">Carregando estrutura...</p>
            </div>
        );
    }

    if (!group) return <div>Grupo não encontrado.</div>;

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {isModalOpen && (
                <NewCompanyModal
                    groupId={id as string}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        fetchData();
                    }}
                />
            )}

            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="space-y-4">
                    <Link href="/dashboard/groups" className="inline-flex items-center gap-2 text-primary/50 hover:text-accent font-medium transition-colors group">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Voltar para Grupos
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-accent shadow-sm">
                            <Building2 className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-primary">{group.name}</h1>
                            <p className="text-primary/40 font-medium">
                                {group.cnpj_raiz ? `CNPJ Raiz: ${group.cnpj_raiz} | ` : ''}
                                {companies.length} Empresas Vinculadas
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-sm font-bold transition-all text-primary">
                        Relatório Consolidado
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-3 bg-accent text-primary rounded-xl text-sm font-bold hover:scale-105 transition-all shadow-xl shadow-accent/20 flex items-center gap-2"
                    >
                        <Plus className="h-5 w-5" />
                        Adicionar Empresa
                    </button>
                </div>
            </div>

            {/* Grid Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-2 font-bold">Empresas Analisadas</p>
                    <p className="text-2xl font-bold text-primary">0 / {companies.length}</p>
                    <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-accent h-full w-[0%]" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-2 font-bold">Economia Potencial Total</p>
                    <p className="text-2xl font-bold text-green-600">R$ 0,00</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-accent">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-2 font-bold">Regime Predominante</p>
                    <p className="text-2xl font-bold text-primary">A definir</p>
                </div>
            </div>

            {/* Company List Area */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-primary">Empresas do Grupo</h2>
                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                            <input
                                type="text"
                                placeholder="Buscar empresa..."
                                className="bg-white border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent w-64 text-primary transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companies.map((company) => (
                        <div key={company.id} className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-accent/20 transition-all group shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-primary transition-all">
                                        <Building2 className="h-6 w-6" />
                                    </div>
                                    <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                                        <MoreVertical className="h-5 w-5 text-primary/20" />
                                    </button>
                                </div>

                                <h3 className="text-xl font-bold text-primary mb-1">{company.name}</h3>
                                <p className="text-xs font-mono text-primary/40 mb-4">{company.cnpj}</p>

                                <div className="space-y-3 mb-8">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span className="text-primary/40">Regime Vigente</span>
                                        <span className="text-primary">{company.current_regime}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-medium">
                                        <span className="text-primary/40">Status</span>
                                        <span className="text-yellow-600 flex items-center gap-1 uppercase tracking-tighter text-[10px] font-bold">
                                            <AlertTriangle className="h-3 w-3" />
                                            Aguardando DRE
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href={`/dashboard/groups/${id}/companies/${company.id}`}
                                className="w-full py-4 bg-slate-50 hover:bg-primary hover:text-white text-center rounded-xl text-sm font-bold transition-all text-primary"
                            >
                                Abrir Inteligência Fiscal
                            </Link>
                        </div>
                    ))}

                    {companies.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                            <Plus className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-slate-400 font-medium">Nenhuma empresa neste grupo.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
