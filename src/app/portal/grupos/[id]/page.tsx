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
    Sparkles,
    Calendar,
    ChevronDown,
    Copy,
    FileText,
    Archive,
    Trash2,
    RotateCcw,
    Pencil,
    XCircle,
    FileCheck,
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useParams } from 'next/navigation';
import NewCompanyModal from '@/components/NewCompanyModal';
import { getScenarios, duplicateScenario } from '@/app/portal/grupos/scenarios-actions';
import NewScenarioModal from '@/components/portal/NewScenarioModal';
import { updateCompanyStatus, deleteCompanyPermanently } from '../company-actions';
import EditCompanyModal from '@/components/portal/EditCompanyModal';

export default function GroupDetailsPage() {
    const supabase = createClient();
    const { id } = useParams();
    const [group, setGroup] = useState<any>(null);
    const [companies, setCompanies] = useState<any[]>([]);
    const [scenarios, setScenarios] = useState<any[]>([]);
    const [activeScenario, setActiveScenario] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
    const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
    const [showScenarioMenu, setShowScenarioMenu] = useState(false);
    const [activeCompanyTab, setActiveCompanyTab] = useState<'active' | 'archived' | 'deleted'>('active');
    const [companyMenuOpen, setCompanyMenuOpen] = useState<string | null>(null);
    const [editingCompany, setEditingCompany] = useState<any | null>(null);
    const [analyzedCount, setAnalyzedCount] = useState(0);
    const [analyzedCompaniesSet, setAnalyzedCompaniesSet] = useState<Set<string>>(new Set());

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
                .eq('group_id', id as string)
                .eq('status', activeCompanyTab);

            if (companiesError) throw companiesError;
            setCompanies(companiesData || []);

            // Check how many companies have financial data
            const { data: finData } = await supabase
                .from('monthly_financials')
                .select('company_id')
                .in('company_id', (companiesData || []).map(c => c.id))
                .limit(1000); // Reasonable limit

            const uniqueAnalyzed = new Set(finData?.map(f => f.company_id));
            setAnalyzedCount(uniqueAnalyzed.size);
            setAnalyzedCompaniesSet(uniqueAnalyzed);

            // Fetch Scenarios
            const scenarioData = await getScenarios(id as string);
            setScenarios(scenarioData || []);
            if (scenarioData && scenarioData.length > 0 && !activeScenario) {
                setActiveScenario(scenarioData.find((s: any) => s.is_main) || scenarioData[0]);
            }
        } catch (error) {
            console.error('Error fetching group details:', error);
        } finally {
            setLoading(false);
        }
    }, [id, activeScenario, activeCompanyTab]);

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
            {isCompanyModalOpen && (
                <NewCompanyModal
                    groupId={id as string}
                    onClose={() => setIsCompanyModalOpen(false)}
                    onSuccess={() => {
                        setIsCompanyModalOpen(false);
                        fetchData();
                    }}
                />
            )}

            {isScenarioModalOpen && (
                <NewScenarioModal
                    groupId={id as string}
                    onClose={() => setIsScenarioModalOpen(false)}
                    onSuccess={() => {
                        setIsScenarioModalOpen(false);
                        fetchData();
                    }}
                />
            )}

            {editingCompany && (
                <EditCompanyModal
                    groupId={id as string}
                    company={editingCompany}
                    onClose={() => setEditingCompany(null)}
                    onSuccess={() => {
                        setEditingCompany(null);
                        fetchData();
                    }}
                />
            )}

            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="space-y-4">
                    <Link href="/portal/grupos" className="inline-flex items-center gap-2 text-primary/50 hover:text-accent font-medium transition-colors group">
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
                    <div className="relative">
                        <button
                            onClick={() => setShowScenarioMenu(!showScenarioMenu)}
                            className="px-6 py-3 bg-white border border-slate-200 hover:border-accent hover:bg-slate-50 rounded-xl text-sm font-bold transition-all text-primary flex items-center gap-3 shadow-sm min-w-[280px]"
                        >
                            <Sparkles className="h-4 w-4 text-accent" />
                            <div className="text-left flex-1">
                                <p className="text-[10px] uppercase tracking-widest text-primary/40 leading-none mb-1">Cenário Ativo</p>
                                <p className="truncate max-w-[200px]">{activeScenario?.name || 'Carregando...'}</p>
                            </div>
                            <ChevronDown className={`h-4 w-4 transition-transform ${showScenarioMenu ? 'rotate-180' : ''}`} />
                        </button>

                        {showScenarioMenu && (
                            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 py-3 animate-in fade-in zoom-in-95 duration-200">
                                <div className="px-4 py-2 border-b border-slate-50 mb-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">Cenários de Planejamento</p>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto">
                                    {scenarios.map((s) => (
                                        <button
                                            key={s.id}
                                            onClick={() => {
                                                setActiveScenario(s);
                                                setShowScenarioMenu(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 text-xs font-bold transition-colors flex items-center justify-between group ${activeScenario?.id === s.id ? 'bg-primary text-white' : 'text-primary hover:bg-slate-50'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${s.is_main ? 'bg-accent' : 'bg-slate-300'}`} />
                                                <span>{s.name}</span>
                                            </div>
                                            {activeScenario?.id === s.id && <Sparkles className="h-3 w-3 text-accent" />}
                                        </button>
                                    ))}
                                </div>
                                <div className="p-2 mt-2 border-t border-slate-50">
                                    <button
                                        onClick={() => {
                                            setIsScenarioModalOpen(true);
                                            setShowScenarioMenu(false);
                                        }}
                                        className="w-full py-3 bg-slate-50 hover:bg-accent hover:text-primary rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-primary/60 flex items-center justify-center gap-2"
                                    >
                                        <Plus className="h-3 w-3" />
                                        Novo Cenário
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <button className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-sm font-bold transition-all text-primary flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        Relatório Consolidado
                    </button>
                    <button
                        onClick={() => setIsCompanyModalOpen(true)}
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
                    <p className="text-2xl font-bold text-primary">{analyzedCount} / {companies.length}</p>
                    <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                            className="bg-accent h-full transition-all duration-1000"
                            style={{ width: `${companies.length > 0 ? (analyzedCount / companies.length) * 100 : 0}%` }}
                        />
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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h2 className="text-2xl font-bold text-primary">Empresas do Grupo</h2>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        {[
                            { id: 'active', label: 'Ativas', icon: FileCheck },
                            { id: 'archived', label: 'Arquivadas', icon: Archive },
                            { id: 'deleted', label: 'Lixeira', icon: Trash2 },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveCompanyTab(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeCompanyTab === tab.id
                                    ? 'bg-white text-primary shadow-sm'
                                    : 'text-primary/40 hover:text-primary'
                                    }`}
                            >
                                <tab.icon className={`h-3 w-3 ${activeCompanyTab === tab.id ? 'text-accent' : ''}`} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-4 flex-1 w-full md:w-auto md:max-w-xs">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                            <input
                                type="text"
                                placeholder="Buscar empresa..."
                                className="bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent w-full text-primary transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companies.map((company) => (
                        <div key={company.id} className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-accent/20 transition-all group shadow-sm flex flex-col justify-between relative">
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-primary transition-all">
                                        <Building2 className="h-6 w-6" />
                                    </div>
                                    <div className="relative">
                                        <button
                                            onClick={() => setCompanyMenuOpen(companyMenuOpen === company.id ? null : company.id)}
                                            className="p-2 hover:bg-slate-50 rounded-lg transition-colors"
                                        >
                                            <MoreVertical className="h-5 w-5 text-primary/10 group-hover:text-primary/30" />
                                        </button>

                                        {companyMenuOpen === company.id && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[60] py-2 animate-in fade-in zoom-in-95 duration-200">
                                                {activeCompanyTab === 'active' && (
                                                    <>
                                                        <button
                                                            onClick={() => { setEditingCompany(company); setCompanyMenuOpen(null); }}
                                                            className="w-full text-left px-4 py-3 text-xs font-bold text-primary hover:bg-slate-50 flex items-center gap-2 transition-colors"
                                                        >
                                                            <Pencil className="h-4 w-4 text-accent" /> Editar unidade
                                                        </button>
                                                        <button
                                                            onClick={async () => { await updateCompanyStatus(company.id, id as string, 'archived'); fetchData(); setCompanyMenuOpen(null); }}
                                                            className="w-full text-left px-4 py-3 text-xs font-bold text-primary hover:bg-slate-50 flex items-center gap-2 transition-colors"
                                                        >
                                                            <Archive className="h-4 w-4 text-blue-500" /> Arquivar unidade
                                                        </button>
                                                        <button
                                                            onClick={async () => { await updateCompanyStatus(company.id, id as string, 'deleted'); fetchData(); setCompanyMenuOpen(null); }}
                                                            className="w-full text-left px-4 py-3 text-xs font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                                                        >
                                                            <Trash2 className="h-4 w-4" /> Mover para lixeira
                                                        </button>
                                                    </>
                                                )}
                                                {activeCompanyTab === 'archived' && (
                                                    <>
                                                        <button
                                                            onClick={async () => { await updateCompanyStatus(company.id, id as string, 'active'); fetchData(); setCompanyMenuOpen(null); }}
                                                            className="w-full text-left px-4 py-3 text-xs font-bold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 transition-colors"
                                                        >
                                                            <RotateCcw className="h-4 w-4" /> Restaurar para ativas
                                                        </button>
                                                        <button
                                                            onClick={async () => { await updateCompanyStatus(company.id, id as string, 'deleted'); fetchData(); setCompanyMenuOpen(null); }}
                                                            className="w-full text-left px-4 py-3 text-xs font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                                                        >
                                                            <Trash2 className="h-4 w-4" /> Mover para lixeira
                                                        </button>
                                                    </>
                                                )}
                                                {activeCompanyTab === 'deleted' && (
                                                    <>
                                                        <button
                                                            onClick={async () => { await updateCompanyStatus(company.id, id as string, 'active'); fetchData(); setCompanyMenuOpen(null); }}
                                                            className="w-full text-left px-4 py-3 text-xs font-bold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 transition-colors"
                                                        >
                                                            <RotateCcw className="h-4 w-4" /> Restaurar unidade
                                                        </button>
                                                        <button
                                                            onClick={async () => { if (confirm('Excluir permanentemente?')) { await deleteCompanyPermanently(company.id, id as string); fetchData(); setCompanyMenuOpen(null); } }}
                                                            className="w-full text-left px-4 py-3 text-xs font-bold text-rose-600 hover:bg-rose-100 flex items-center gap-2 transition-colors"
                                                        >
                                                            <XCircle className="h-4 w-4" /> Excluir permanentemente
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
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
                                        <span className={`flex items-center gap-1 uppercase tracking-tighter text-[10px] font-bold ${activeCompanyTab === 'active'
                                            ? (analyzedCompaniesSet.has(company.id) ? 'text-emerald-600' : 'text-yellow-600')
                                            : activeCompanyTab === 'archived' ? 'text-blue-500' : 'text-rose-500'
                                            }`}>
                                            {activeCompanyTab === 'active' ? (
                                                analyzedCompaniesSet.has(company.id) ? (
                                                    <>
                                                        <FileCheck className="h-3 w-3" />
                                                        DRE Carregado
                                                    </>
                                                ) : (
                                                    <>
                                                        <AlertTriangle className="h-3 w-3" />
                                                        Aguardando DRE
                                                    </>
                                                )
                                            ) : activeCompanyTab === 'archived' ? (
                                                <>
                                                    <Archive className="h-3 w-3" />
                                                    Arquivada
                                                </>
                                            ) : (
                                                <>
                                                    <Trash2 className="h-3 w-3" />
                                                    Na Lixeira
                                                </>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href={activeCompanyTab === 'deleted' ? '#' : `/portal/grupos/${id}/companies/${company.id}${activeScenario ? `?scenarioId=${activeScenario.id}` : ''}`}
                                onClick={(e) => activeCompanyTab === 'deleted' && e.preventDefault()}
                                className={`w-full py-4 text-center rounded-xl text-sm font-bold transition-all ${activeCompanyTab === 'deleted'
                                    ? 'bg-slate-100 text-primary/20 cursor-not-allowed'
                                    : 'bg-slate-50 hover:bg-primary hover:text-white text-primary'
                                    }`}
                            >
                                Abrir Inteligência Fiscal
                            </Link>
                        </div>
                    ))}

                    {companies.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                            <Plus className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-slate-400 font-medium">
                                {activeCompanyTab === 'active' ? 'Nenhuma empresa ativa neste grupo.' :
                                    activeCompanyTab === 'archived' ? 'Nenhuma empresa arquivada.' : 'Lixeira de empresas vazia.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
