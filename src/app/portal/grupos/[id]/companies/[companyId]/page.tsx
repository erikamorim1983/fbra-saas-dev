'use client';

import React, { useState, useEffect, Suspense } from 'react';
import {
    ArrowLeft,
    Building2,
    Settings,
    TrendingUp,
    FileCheck,
    History,
    Sparkles,
    ChevronRight,
    Plus,
    Calculator,
    RefreshCcw
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import FunctionalSimulator from '@/components/FunctionalSimulator';

function CompanyDetailsContent() {
    const supabase = createClient();
    const { id: groupId, companyId } = useParams();
    const searchParams = useSearchParams();
    const scenarioId = searchParams.get('scenarioId');
    const [activeTab, setActiveTab] = useState('dre');
    const [company, setCompany] = useState<any>(null);
    const [group, setGroup] = useState<any>(null);
    const [selectedScenario, setSelectedScenario] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);

                // Fetch Company
                const { data: companyData } = await supabase
                    .from('companies')
                    .select('*')
                    .eq('id', companyId as string)
                    .single();
                setCompany(companyData);

                // Fetch Group
                const { data: groupData } = await supabase
                    .from('company_groups')
                    .select('*')
                    .eq('id', groupId as string)
                    .single();
                setGroup(groupData);

                // Fetch Scenario
                if (scenarioId) {
                    const { data: scenarioData } = await supabase
                        .from('scenarios')
                        .select('*')
                        .eq('id', scenarioId)
                        .single();
                    setSelectedScenario(scenarioData);
                } else {
                    // Get main scenario if none provided
                    const { data: mainScenario } = await supabase
                        .from('scenarios')
                        .select('*')
                        .eq('group_id', groupId as string)
                        .eq('is_main', true)
                        .single();
                    setSelectedScenario(mainScenario);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }

        if (groupId && companyId) {
            fetchData();
        }
    }, [groupId, companyId, supabase]);

    if (loading && !company) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4 opacity-50">
                <RefreshCcw className="h-8 w-8 animate-spin text-accent" />
                <p className="font-bold text-sm text-primary uppercase tracking-widest leading-relaxed">Carregando Inteligência...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Breadcrumbs & Navigation */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href={`/portal/grupos/${groupId}`} className="p-2 glass rounded-lg hover:text-accent transition-colors text-primary">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary/30">
                            <Link href="/portal/grupos" className="hover:text-primary transition-colors">Meus Grupos</Link>
                            <ChevronRight className="h-3 w-3" />
                            <Link href={`/portal/grupos/${groupId}`} className="hover:text-primary transition-colors flex items-center gap-1">
                                <span className="text-accent/60">Grupo:</span> {group?.name || 'Carregando...'}
                            </Link>
                        </div>
                        <h1 className="text-4xl font-black flex items-center gap-4 text-primary italic">
                            {company?.name || 'Carregando...'}
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border shadow-sm not-italic ${(company?.status || 'active') === 'active'
                                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                    : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                                    }`}>
                                    {company?.status === 'active' ? 'Ativa' : 'Inativa'}
                                </span>
                                <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border border-accent/20 bg-accent/5 text-accent shadow-sm not-italic">
                                    Unidade Fiscal
                                </span>
                            </div>
                        </h1>
                    </div>
                </div>

                <div className="flex gap-3">
                    {selectedScenario && (
                        <div className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold flex items-center gap-3 shadow-sm min-w-[280px]">
                            <Sparkles className="h-4 w-4 text-accent" />
                            <div className="text-left flex-1">
                                <p className="text-[10px] uppercase tracking-widest text-primary/40 leading-none mb-1">Cenário Vinculado</p>
                                <p className="truncate max-w-[200px] text-primary">{selectedScenario.name}</p>
                            </div>
                        </div>
                    )}
                    <button className="px-6 py-3 glass hover:bg-white/10 rounded-xl text-sm font-bold flex items-center gap-2 transition-all">
                        <History className="h-4 w-4" />
                        Histórico
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 glass w-fit rounded-xl border-white/5">
                <button
                    onClick={() => setActiveTab('dre')}
                    className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'dre' ? 'bg-accent text-primary' : 'text-foreground/50 hover:text-foreground'}`}
                >
                    Estrutura DRE & Simulação
                </button>
                <button
                    onClick={() => setActiveTab('config')}
                    className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'config' ? 'bg-accent text-primary' : 'text-foreground/50 hover:text-foreground'}`}
                >
                    Parâmetros Fiscais
                </button>
            </div>

            {/* Content Area */}
            {activeTab === 'dre' ? (
                <FunctionalSimulator />
            ) : (
                <div className="glass p-20 rounded-3xl text-center">
                    <Settings className="h-12 w-12 text-accent mx-auto mb-4 opacity-20" />
                    <p className="text-foreground/40 font-medium">Configurações de Alíquotas por CNAE em breve.</p>
                </div>
            )}
        </div>
    );
}

export default function CompanyDetailsPage() {
    return (
        <Suspense fallback={
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4 opacity-50">
                <RefreshCcw className="h-8 w-8 animate-spin text-accent" />
                <p className="font-bold text-sm text-primary uppercase tracking-widest leading-relaxed">Carregando Inteligência...</p>
            </div>
        }>
            <CompanyDetailsContent />
        </Suspense>
    );
}
