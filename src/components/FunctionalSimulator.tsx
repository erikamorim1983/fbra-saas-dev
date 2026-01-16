'use client';

import React, { useState, useMemo, useRef } from 'react';
import { HelpCircle, Info, Calculator, Sparkles, FileText, Download, RefreshCcw, Plus, Trash2, Upload, FileDown } from 'lucide-react';
import { TaxEngine, TaxAnalisysInput } from '@/lib/taxEngine';
import * as XLSX from 'xlsx';

interface DREField {
    id: string;
    label: string;
    isHeader?: boolean;
    isSubtotal?: boolean;
    indent?: boolean;
}

import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export default function FunctionalSimulator() {
    const { companyId } = useParams();
    const [structure, setStructure] = useState<DREField[]>([
        { id: 'revenue', label: '01 - (+) Receita Bruta (Sales)', isHeader: true },
        { id: 'services', label: '01.01 - Prestação de Serviços', indent: true },
        { id: 'rev_breach', label: '01.02 - Multas Quebra de Contrato Antecipado', indent: true },
        { id: 'rev_punctual', label: '01.03 - Pontual', indent: true },
        { id: 'partners', label: '01.04 - Comissões de Parceiros', indent: true },
        { id: 'rev_events', label: '01.05 - Eventos', indent: true },

        { id: 'deductions', label: '02 - (-) Deduções - Impostos e Repasses', isHeader: true },
        { id: 'iss', label: '02.01 - ISS', indent: true },
        { id: 'ded_pis', label: '02.02 - PIS', indent: true },
        { id: 'ded_cofins', label: '02.03 - Cofins', indent: true },
        { id: 'ded_simples', label: '02.04 - Simples Nacional', indent: true },
        { id: 'rl', label: '(=) Receita Líquida', isSubtotal: true },

        { id: 'cogs', label: '03 - (-) Custos do Serviço Vendido (COGS)', isHeader: true },
        { id: 'personnel_cogs', label: '03.01 - Custos com Pessoal', indent: true },
        { id: 'costs_hosting', label: '03.02 - Custos de Infraestrutura e hospedagem (Hosting)', indent: true },
        { id: 'costs_third_party', label: '03.03 - Custos com Serviços de Terceiros', indent: true },
        { id: 'costs_marketing_clients', label: '03.04 - Custos Marketing Clientes', indent: true },
        { id: 'costs_payments', label: '03.05 - Custos com Meios de Pagamento (Payments)', indent: true },
        { id: 'costs_travel', label: '03.06 - Custo com Viagem e Deslocamento', indent: true },
        { id: 'mb', label: '(=) Margem Bruta', isSubtotal: true },

        { id: 'opex', label: '04 - (-) Despesas Operacionais (Operating Expenses)', isHeader: true },
        { id: 'personnel_opex', label: '04.01 - Despesas com Pessoal (Personnel)', indent: true },
        { id: 'marketing', label: '04.04 - Marketing & Sales', indent: true },
        { id: 'installations', label: '04.05 - Instalações (Facilities)', indent: true },
        { id: 'admin', label: '04.06 - Despesas Administrativas (General & Administrative)', indent: true },
        { id: 'infra_tech', label: '04.07 - Despesas com Infra e Tecnologia', indent: true },
        { id: 'ebitda', label: '(=) EBITDA', isSubtotal: true },

        { id: 'depreciation_header', label: '05 - (-) Depreciações e Amortizações', isHeader: true },
        { id: 'ebit', label: '(=) EBIT', isSubtotal: true },

        { id: 'financial_header', label: '06 - (=) Resultado Financeiro (Financial costs)', isHeader: true },
        { id: 'fin_revenue', label: '06.01 - Receitas Financeiras', indent: true },
        { id: 'fin_expenses', label: '06.02 - Despesas Financeiras', indent: true },

        { id: 'non_op_header', label: '07 - (-) Resultado não operacional', isHeader: true },
        { id: 'lair', label: '(=) LAIR', isSubtotal: true },

        { id: 'taxes', label: '08 - (-) IR & CSLL (Taxes)', isHeader: true },
        { id: 'irpj', label: '08.01 - IRPJ', indent: true },
        { id: 'csll', label: '08.02 - CSLL', indent: true },
        { id: 'll', label: '(=) Lucro Líquido', isSubtotal: true },

        { id: 'cash_flow_header', label: 'Outras Movimentações de Caixa', isHeader: true },
        { id: 'partners_draw', label: '09 - (-) Retirada de Sócios', indent: true },
        { id: 'capex', label: '10 - (-) Investimento em Imobilizado e Intangível', indent: true },
        { id: 'loan_in', label: '11 - (+) Entrada de empréstimos', indent: true },
        { id: 'loan_out', label: '12 - (-) Saída de empréstimos', indent: true },
        { id: 'capital_in', label: '13 - (+) Aportes de capital', indent: true },
        { id: 'other_cash', label: '14 - (-) Outras movimentações de caixa', indent: true },
    ]);
    const [values, setValues] = useState<Record<string, number[]>>({
        services: Array(12).fill(0),
        partners: Array(12).fill(0),
        iss: Array(12).fill(0),
        costs_inputs: Array(12).fill(0),
        costs_energy: Array(12).fill(0),
        costs_rent: Array(12).fill(0),
        personnel_cogs: Array(12).fill(0),
        infra_cogs: Array(12).fill(0),
        personnel_opex: Array(12).fill(0),
        marketing: Array(12).fill(0),
        admin: Array(12).fill(0),
    });

    const [analyzing, setAnalyzing] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [isAddingTo, setIsAddingTo] = useState<string | null>(null);
    const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
    const [isClearing, setIsClearing] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [newAccountName, setNewAccountName] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const showNotify = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 5000);
    };

    const calcs = useMemo(() => {
        // Obter médias para análise rápida
        const getAvg = (id: string) => {
            const arr = values[id] || Array(12).fill(0);
            return arr.reduce((a, b) => a + b, 0) / 12;
        };

        const avg_services = getAvg('services');
        const avg_products = getAvg('revenue_products');
        const avg_iss = getAvg('iss');
        const avg_personnel_cogs = getAvg('personnel_cogs');
        const avg_inputs = getAvg('costs_inputs');
        const avg_energy = getAvg('costs_energy');
        const avg_rent = getAvg('costs_rent');
        const avg_personnel_opex = getAvg('personnel_opex');
        const avg_marketing = getAvg('marketing');
        const avg_admin = getAvg('admin');

        const rb = avg_services + (getAvg('rev_breach') + getAvg('rev_punctual') + getAvg('partners') + getAvg('rev_events'));
        const rl = rb - (avg_iss + getAvg('ded_pis') + getAvg('ded_cofins') + getAvg('ded_simples'));
        const cogs = avg_personnel_cogs + getAvg('costs_hosting') + getAvg('costs_third_party') + getAvg('costs_marketing_clients') + getAvg('costs_payments') + getAvg('costs_travel');
        const mb = rl - cogs;
        const opex = avg_personnel_opex + avg_marketing + getAvg('installations') + avg_admin + getAvg('infra_tech');
        const ebitda = mb - opex;

        const input: TaxAnalisysInput = {
            revenue_services: avg_services,
            revenue_products: avg_products,
            costs_inputs: avg_inputs,
            costs_energy: avg_energy,
            costs_rent: avg_rent,
            ebitda: ebitda,
            segment: 'servicos',
            iss_rate: 5
        };

        const analysis = TaxEngine.runFullAnalisys(input);
        const best = analysis[0];

        return {
            ebitda, rb, rl,
            best: best.regime,
            savings: analysis.length > 1 ? Math.abs(analysis[0].total - analysis[analysis.length - 1].total) : 0,
            efficiency: best.efficiency,
            analysis
        };
    }, [values]);

    const handleInputChange = (id: string, monthIdx: number, val: string) => {
        const num = parseFloat(val.replace(/[^\d]/g, '')) / 100 || 0;
        setValues(prev => {
            const current = [...(prev[id] || Array(12).fill(0))];
            current[monthIdx] = num;
            return { ...prev, [id]: current };
        });
    };

    const runAnalysis = () => {
        setAnalyzing(true);
        setTimeout(() => {
            setAnalyzing(false);
            setShowResults(true);
        }, 1500);
    };

    const confirmAddAccount = () => {
        if (!newAccountName || !isAddingTo) return;
        const index = structure.findIndex(f => f.id === isAddingTo);
        const newId = `custom_${Math.random().toString(36).substr(2, 9)}`;
        const newField: DREField = { id: newId, label: `↳ ${newAccountName}`, indent: true };
        setStructure(prev => {
            const next = [...prev];
            next.splice(index + 1, 0, newField);
            return next;
        });
        setValues(prev => ({ ...prev, [newId]: Array(12).fill(0) }));
        setNewAccountName('');
        setIsAddingTo(null);
    };

    const removeAccount = (id: string) => {
        setIsDeletingId(id);
    };

    const confirmRemoveAccount = () => {
        if (!isDeletingId) return;
        setStructure(prev => prev.filter(f => f.id !== isDeletingId));
        setValues(prev => {
            const next = { ...prev };
            delete next[isDeletingId];
            return next;
        });
        setIsDeletingId(null);
    };

    const clearAllData = () => {
        const resetValues: Record<string, number[]> = {};
        structure.forEach(field => {
            resetValues[field.id] = Array(12).fill(0);
        });
        setValues(resetValues);
        setIsClearing(false);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];

                const newValues = { ...values };

                data.forEach(row => {
                    const rowCode = String(row[0] || '').trim();
                    const rowLabel = String(row[1] || '').toLowerCase().trim();

                    if (!rowLabel && !rowCode) return;

                    const field = structure.find(f => {
                        const fLabel = f.label.toLowerCase();
                        if (rowCode && rowCode.length >= 4 && fLabel.includes(rowCode)) return true;
                        return rowLabel.length > 3 && (fLabel.includes(rowLabel) || rowLabel.includes(fLabel));
                    });

                    const isCalculated = ['revenue', 'deductions', 'cogs', 'opex', 'depreciation_header', 'financial_header', 'non_op_header', 'taxes', 'cash_flow_header', 'rl', 'mb', 'ebitda', 'ebit', 'll', 'lair'].includes(field?.id || '');

                    if (field && !isCalculated) {
                        const monthlyVals = row.slice(2, 14).map(v => {
                            if (typeof v === 'number') return v;
                            const cleaned = String(v || '').replace(/[^\d,-]/g, '').replace(',', '.');
                            return parseFloat(cleaned) || 0;
                        });

                        if (monthlyVals.some(v => v !== 0)) {
                            newValues[field.id] = Array(12).fill(0).map((_, i) => monthlyVals[i] || 0);
                        }
                    }
                });

                setValues(newValues);
                showNotify('Planilha importada com sucesso! Verifique os dados mapeados.', 'success');
            } catch (err) {
                console.error('Erro ao ler planilha:', err);
                showNotify('Erro ao processar arquivo. Certifique-se de que é um Excel ou CSV válido.', 'error');
            }
        };
        reader.readAsBinaryString(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const saveToSupabase = async () => {
        if (!companyId) return;

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(companyId as string)) {
            showNotify('ID da empresa inválido para salvamento (use uma empresa real do dashboard).', 'info');
            return;
        }

        try {
            setAnalyzing(true);

            // Gerar registros para cada um dos 12 meses
            const monthRecords = months.map((_, idx) => {
                const v = (id: string) => (values[id] || Array(12).fill(0))[idx];
                return {
                    company_id: companyId as string,
                    month: idx + 1, // 1 a 12 para satisfazer a constraint do banco
                    year: 2024,
                    revenue_services: v('services') + v('partners') + v('rev_events'),
                    revenue_products: v('rev_breach') + v('rev_punctual'),
                    costs_personnel: v('personnel_cogs') + v('personnel_opex'),
                    costs_inputs: v('costs_hosting') + v('costs_payments'),
                    costs_energy: v('costs_third_party'),
                    costs_rent: v('costs_marketing_clients') + v('costs_travel'),
                    opex_marketing: v('marketing'),
                    opex_admin: v('admin') + v('infra_tech') + v('installations'), // admin consolidado
                };
            });

            const { error: dbError } = await supabase
                .from('monthly_financials')
                .upsert(monthRecords as any, {
                    onConflict: 'company_id,month,year'
                });

            if (dbError) {
                console.error('Erro Detalhado Supabase:', dbError);
                throw new Error(dbError.message || 'Falha na comunicação com o banco');
            }

            showNotify('Os 12 meses foram salvos com sucesso no banco de dados!', 'success');
        } catch (error: any) {
            console.error('Exceção ao salvar:', error);
            showNotify(`Erro ao salvar: ${error.message || 'Tente novamente.'}`, 'error');
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            {/* Modal de Nova Conta */}
            {isAddingTo && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-200 p-8 space-y-6 animate-in zoom-in-95 duration-300">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-primary">Nova Sub-conta</h3>
                            <p className="text-xs text-primary/40 font-bold uppercase tracking-widest">Personalização do Plano de Contas</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Nome da Conta</label>
                            <input
                                autoFocus
                                type="text"
                                placeholder="Ex: Despesas com Softwares"
                                value={newAccountName}
                                onChange={(e) => setNewAccountName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && confirmAddAccount()}
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-6 text-primary focus:outline-none focus:border-accent transition-all font-medium"
                            />
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button onClick={() => setIsAddingTo(null)} className="flex-1 py-4 border border-slate-200 text-primary/60 font-bold rounded-2xl hover:bg-slate-50 transition-all">Cancelar</button>
                            <button onClick={confirmAddAccount} className="flex-1 py-4 bg-accent text-primary font-bold rounded-2xl hover:scale-105 transition-all shadow-xl shadow-accent/20">Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Confirmação de Exclusão */}
            {isDeletingId && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-slate-200 p-8 space-y-6 animate-in zoom-in-95 duration-300 text-center">
                        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto">
                            <Plus className="h-8 w-8 rotate-45" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-primary">Excluir Conta?</h3>
                            <p className="text-sm text-primary/40 leading-relaxed">Você tem certeza que deseja remover esta conta da simulação? Os valores inseridos serão perdidos.</p>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button onClick={() => setIsDeletingId(null)} className="flex-1 py-4 border border-slate-200 text-primary/60 font-bold rounded-2xl hover:bg-slate-50 transition-all">Manter</button>
                            <button onClick={confirmRemoveAccount} className="flex-1 py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-all shadow-xl shadow-red-200">Excluir</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Confirmação de Limpeza */}
            {isClearing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-slate-200 p-8 space-y-6 animate-in zoom-in-95 duration-300 text-center">
                        <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mx-auto">
                            <Trash2 className="h-8 w-8" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-primary">Limpar Todos os Dados?</h3>
                            <p className="text-sm text-primary/40 leading-relaxed">Esta ação zerá todos os campos preenchidos de Janeiro a Dezembro. Deseja continuar?</p>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button onClick={() => setIsClearing(false)} className="flex-1 py-4 border border-slate-200 text-primary/60 font-bold rounded-2xl hover:bg-slate-50 transition-all">Manter Dados</button>
                            <button onClick={clearAllData} className="flex-1 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-200">Limpar Tudo</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sistema de Notificação Customizado */}
            {notification && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] animate-in slide-in-from-bottom-5 duration-300">
                    <div className={`px-6 py-4 rounded-[1.5rem] shadow-2xl border flex items-center gap-3 backdrop-blur-md ${notification.type === 'success' ? 'bg-green-500/90 border-green-400 text-white' :
                        notification.type === 'error' ? 'bg-red-500/90 border-red-400 text-white' :
                            'bg-blue-500/90 border-blue-400 text-white'
                        }`}>
                        {notification.type === 'success' && <Sparkles className="h-5 w-5" />}
                        {notification.type === 'error' && <Trash2 className="h-5 w-5" />}
                        {notification.type === 'info' && <Info className="h-5 w-5" />}
                        <span className="font-bold text-sm tracking-tight">{notification.message}</span>
                        <button onClick={() => setNotification(null)} className="ml-2 hover:opacity-70">
                            <RefreshCcw className="h-4 w-4 rotate-45" />
                        </button>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Análise <span className="text-accent underline decoration-accent/20">Tributária Live</span></h1>
                    <p className="text-primary/50">Edite os valores da DRE e veja a análise de cenários em tempo real.</p>
                </div>
                <div className="flex gap-3">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".xlsx, .xls, .csv"
                        onChange={handleFileUpload}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-5 py-4 bg-white border border-slate-200 text-primary font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-2"
                    >
                        <Upload className="h-4 w-4 text-accent" />
                        Importar Planilha
                    </button>
                    <button
                        onClick={() => setIsClearing(true)}
                        className="p-4 bg-white border border-slate-200 text-red-500 hover:text-red-600 font-bold rounded-2xl hover:bg-red-50 transition-all shadow-sm"
                        title="Limpar todos os campos"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                    <button onClick={saveToSupabase} className="px-5 py-4 bg-white border border-slate-200 text-primary font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-2">
                        Salvar Dados
                    </button>
                    <button onClick={runAnalysis} disabled={analyzing} className="px-8 py-4 bg-accent text-primary font-bold rounded-2xl hover:scale-105 transition-all shadow-xl shadow-accent/20 flex items-center gap-2">
                        {analyzing ? <RefreshCcw className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                        {analyzing ? 'Processando...' : 'Gerar Parecer Técnico'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
                        <div className="overflow-x-auto max-h-[70vh]">
                            <table className="w-full text-xs text-left border-collapse">
                                <thead className="sticky top-0 z-20">
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="p-4 min-w-[280px] font-bold uppercase tracking-widest text-primary/40 text-[10px] sticky left-0 bg-slate-50 z-30 border-r border-slate-100 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">Estrutura de Resultados</th>
                                        {months.map(m => (
                                            <th key={m} className="p-4 text-center font-bold text-primary/60 border-l border-slate-100 uppercase tracking-widest text-[10px] min-w-[124px] bg-slate-50">{m}</th>
                                        ))}
                                        <th className="p-4 text-center font-bold text-primary/40 border-l border-slate-100 uppercase tracking-widest text-[10px] min-w-[120px] bg-slate-100">Total Ano</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-[13px]">
                                    {structure.map((field) => {
                                        const isTotalField = ['revenue', 'deductions', 'cogs', 'opex', 'depreciation_header', 'financial_header', 'non_op_header', 'taxes', 'cash_flow_header', 'rl', 'mb', 'ebitda', 'ebit', 'll', 'lair'].includes(field.id);
                                        const rowData = values[field.id] || Array(12).fill(0);

                                        // Cálculos de linha para campos calculados
                                        const getVal = (idx: number): number => {
                                            const v = (id: string) => (values[id] || Array(12).fill(0))[idx];

                                            // Somatórias de Grupos
                                            if (field.id === 'revenue') return v('services') + v('rev_breach') + v('rev_punctual') + v('partners') + v('rev_events');
                                            if (field.id === 'deductions') return v('iss') + v('ded_pis') + v('ded_cofins') + v('ded_simples');
                                            if (field.id === 'cogs') return v('personnel_cogs') + v('costs_hosting') + v('costs_third_party') + v('costs_marketing_clients') + v('costs_payments') + v('costs_travel');
                                            if (field.id === 'opex') return v('personnel_opex') + v('marketing') + v('installations') + v('admin') + v('infra_tech');
                                            if (field.id === 'financial_header') return v('fin_revenue') - v('fin_expenses');
                                            if (field.id === 'taxes') return v('irpj') + v('csll');
                                            if (field.id === 'cash_flow_header') return v('partners_draw') + v('capex') + v('loan_in') + v('loan_out') + v('capital_in') + v('other_cash');

                                            // Subtotais (Fórmulas da DRE)
                                            if (field.id === 'rl') {
                                                const total_rev = v('services') + v('rev_breach') + v('rev_punctual') + v('partners') + v('rev_events');
                                                const total_ded = v('iss') + v('ded_pis') + v('ded_cofins') + v('ded_simples');
                                                return total_rev - total_ded;
                                            }
                                            if (field.id === 'mb') {
                                                const total_rev = v('services') + v('rev_breach') + v('rev_punctual') + v('partners') + v('rev_events');
                                                const total_ded = v('iss') + v('ded_pis') + v('ded_cofins') + v('ded_simples');
                                                const rl = total_rev - total_ded;
                                                const cogs = v('personnel_cogs') + v('costs_hosting') + v('costs_third_party') + v('costs_marketing_clients') + v('costs_payments') + v('costs_travel');
                                                return rl - cogs;
                                            }
                                            if (field.id === 'ebitda') {
                                                const total_rev = v('services') + v('rev_breach') + v('rev_punctual') + v('partners') + v('rev_events');
                                                const total_ded = v('iss') + v('ded_pis') + v('ded_cofins') + v('ded_simples');
                                                const rl = total_rev - total_ded;
                                                const cogs = v('personnel_cogs') + v('costs_hosting') + v('costs_third_party') + v('costs_marketing_clients') + v('costs_payments') + v('costs_travel');
                                                const mb = rl - cogs;
                                                const opex = v('personnel_opex') + v('marketing') + v('installations') + v('admin') + v('infra_tech');
                                                return mb - opex;
                                            }
                                            if (field.id === 'ebit' || field.id === 'depreciation_header') {
                                                const sub_rev = v('services') + v('rev_breach') + v('rev_punctual') + v('partners') + v('rev_events');
                                                const sub_ded = v('iss') + v('ded_pis') + v('ded_cofins') + v('ded_simples');
                                                const sub_rl = sub_rev - sub_ded;
                                                const sub_cogs = v('personnel_cogs') + v('costs_hosting') + v('costs_third_party') + v('costs_marketing_clients') + v('costs_payments') + v('costs_travel');
                                                const sub_mb = sub_rl - sub_cogs;
                                                const sub_opex = v('personnel_opex') + v('marketing') + v('installations') + v('admin') + v('infra_tech');
                                                return sub_mb - sub_opex;
                                            }
                                            if (field.id === 'lair' || field.id === 'non_op_header') {
                                                const sub_rev = v('services') + v('rev_breach') + v('rev_punctual') + v('partners') + v('rev_events');
                                                const sub_ded = v('iss') + v('ded_pis') + v('ded_cofins') + v('ded_simples');
                                                const sub_rl = sub_rev - sub_ded;
                                                const sub_cogs = v('personnel_cogs') + v('costs_hosting') + v('costs_third_party') + v('costs_marketing_clients') + v('costs_payments') + v('costs_travel');
                                                const sub_mb = sub_rl - sub_cogs;
                                                const sub_opex = v('personnel_opex') + v('marketing') + v('installations') + v('admin') + v('infra_tech');
                                                const sub_ebitda = sub_mb - sub_opex;
                                                const fin = v('fin_revenue') - v('fin_expenses');
                                                return sub_ebitda + fin;
                                            }
                                            if (field.id === 'll') {
                                                const sub_rev = v('services') + v('rev_breach') + v('rev_punctual') + v('partners') + v('rev_events');
                                                const sub_ded = v('iss') + v('ded_pis') + v('ded_cofins') + v('ded_simples');
                                                const sub_rl = sub_rev - sub_ded;
                                                const sub_cogs = v('personnel_cogs') + v('costs_hosting') + v('costs_third_party') + v('costs_marketing_clients') + v('costs_payments') + v('costs_travel');
                                                const sub_mb = sub_rl - sub_cogs;
                                                const sub_opex = v('personnel_opex') + v('marketing') + v('installations') + v('admin') + v('infra_tech');
                                                const sub_ebitda = sub_mb - sub_opex;
                                                const fin = v('fin_revenue') - v('fin_expenses');
                                                const lair = sub_ebitda + fin;
                                                const taxes = v('irpj') + v('csll');
                                                return lair - taxes;
                                            }
                                            return rowData[idx];
                                        };

                                        return (
                                            <tr key={field.id} className={`
                                                ${field.isHeader ? 'bg-slate-100/80 font-bold text-primary border-b border-slate-200' : ''} 
                                                ${field.isSubtotal ? 'bg-accent/10 font-extrabold text-accent border-y border-accent/20' : ''} 
                                                group/row transition-colors hover:bg-slate-50/50
                                            `}>
                                                <td className={`
                                                    p-3 sticky left-0 z-10 whitespace-nowrap
                                                    ${field.indent ? 'pl-8 text-primary/60' : 'text-primary'} 
                                                    ${field.isHeader ? 'bg-slate-100/100' : field.isSubtotal ? 'bg-[#fcf8ff]' : 'bg-white'} 
                                                    border-r border-slate-100 shadow-[2px_0_5px_rgba(0,0,0,0.02)]
                                                `}>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 whitespace-nowrap">
                                                            {field.label}
                                                            {(field.id === 'costs_inputs' || field.id === 'costs_energy' || field.id === 'costs_rent') && (
                                                                <span className="text-[8px] bg-green-100 text-green-700 px-1 rounded font-bold uppercase">Crédito</span>
                                                            )}
                                                        </div>
                                                        <div className="flex gap-2 group-hover/row:opacity-100 opacity-0 transition-opacity z-20">
                                                            {field.isHeader && (
                                                                <button type="button" onClick={(e) => { e.stopPropagation(); setIsAddingTo(field.id); }} className="p-1 bg-accent/10 hover:bg-accent/30 rounded text-accent shadow-sm border border-accent/20">
                                                                    <Plus className="h-3 w-3" />
                                                                </button>
                                                            )}
                                                            {field.indent && (
                                                                <button type="button" onClick={(e) => { e.stopPropagation(); removeAccount(field.id); }} className="p-1 bg-red-50 hover:bg-red-100 rounded text-red-500 shadow-sm border border-red-100">
                                                                    <RefreshCcw className="h-3 w-3 rotate-45" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                {months.map((m, idx) => {
                                                    const val = isTotalField ? getVal(idx) : rowData[idx];
                                                    return (
                                                        <td key={`${field.id}-${m}`} className="p-2 border-l border-slate-100">
                                                            {isTotalField || field.isHeader ? (
                                                                <div className="text-center font-mono py-1 font-bold">
                                                                    {(val || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                                </div>
                                                            ) : (
                                                                <input
                                                                    type="text"
                                                                    value={(val || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                                    onChange={(e) => handleInputChange(field.id, idx, e.target.value)}
                                                                    className="w-full bg-transparent border-none rounded-lg py-1 px-1 text-center focus:outline-none focus:ring-1 focus:ring-accent/40 font-mono text-primary transition-all text-[12px]"
                                                                />
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                                <td className="p-2 border-l border-slate-100 bg-slate-50/50 font-bold text-center font-mono">
                                                    {(months.reduce((acc, _, idx) => acc + (isTotalField ? getVal(idx) : rowData[idx]), 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6 text-primary no-print">
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Calculator className="text-accent h-5 w-5" />
                            Comparativo Rápido
                        </h3>
                        <div className="space-y-4">
                            {calcs.analysis.map((s) => (
                                <div key={s.regime} className={`flex justify-between items-center p-4 rounded-2xl border ${s.regime === calcs.best ? 'bg-accent/5 border-accent/20' : 'bg-slate-50 border-slate-100'
                                    }`}>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">{s.regime}</p>
                                        <p className="font-mono font-bold text-sm">R$ {s.total.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.regime === calcs.best ? 'bg-accent text-white' : 'bg-slate-200 text-slate-500'
                                            }`}>
                                            {s.efficiency}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="pt-4 border-t border-slate-100">
                            <div className="bg-green-50 border border-green-100 p-5 rounded-2xl shadow-sm">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-green-600 mb-1">Economia Máxima</p>
                                <p className="text-3xl font-bold text-green-600">R$ {calcs.savings.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} <span className="text-sm font-normal">/mês</span></p>
                                <button onClick={() => window.print()} className="w-full mt-4 py-3 bg-green-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-green-700 transition-colors shadow-lg shadow-green-200">
                                    <FileDown className="h-4 w-4" />
                                    Gerar Parecer PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* REGIAO DE IMPRESSAO (Oculta na tela, visivel no PDF) */}
            <div className="hidden print:block print-m-0 text-slate-900 font-sans p-10 bg-white min-h-screen">
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @media print {
                        @page { margin: 1.5cm; }
                        body { background: white !important; }
                        .no-print { display: none !important; }
                    }
                `}} />

                {/* Cabeçalho Profissional */}
                <div className="flex justify-between items-start border-b-4 border-primary pb-8 mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-primary tracking-tighter">PARECER TÉCNICO TRIBUTÁRIO</h1>
                        <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-[0.3em]">FBRA Intelligence • Relatório Estratégico</p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-black text-primary uppercase">Empresa Analisada</p>
                        <p className="text-slate-600 font-bold">{companyId === 'c1' ? 'Cliente Exemplo S.A.' : 'Empresa do Grupo FBRA'}</p>
                        <p className="text-xs text-slate-400">Data de Emissão: {new Date().toLocaleDateString('pt-BR')}</p>
                    </div>
                </div>

                {/* 1. Resumo Executivo */}
                <section className="mb-10">
                    <h2 className="text-xl font-bold text-primary mb-4 bg-slate-100 p-2 rounded">1. RESUMO EXECUTIVO</h2>
                    <p className="text-sm leading-relaxed text-slate-700">
                        Com base na análise da DRE fornecida, que apresenta um faturamento bruto médio de <strong>R$ {calcs.rb.toLocaleString('pt-BR')}</strong> e uma margem operacional (EBITDA) de <strong>{((calcs.ebitda / (calcs.rb || 1)) * 100).toFixed(1)}%</strong>, avaliamos os regimes tributários disponíveis para o exercício atual.
                    </p>
                    <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded">
                        <p className="text-sm font-bold text-green-800">
                            RECOMENDAÇÃO: O regime de <span className="underline">{calcs.best}</span> apresenta a maior eficiência fiscal, gerando uma economia estimada de <strong>R$ {(calcs.savings * 12).toLocaleString('pt-BR')}</strong> ao ano.
                        </p>
                    </div>
                </section>

                {/* 2. Comparativo Detalhado */}
                <section className="mb-10">
                    <h2 className="text-xl font-bold text-primary mb-4 bg-slate-100 p-2 rounded">2. QUADRO COMPARATIVO DE CARGA TRIBUTÁRIA</h2>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-primary text-white text-xs font-bold uppercase tracking-widest">
                                <th className="p-3 border">Cenário Analisado</th>
                                <th className="p-3 border">Imposto Anual</th>
                                <th className="p-3 border">Taxa Efetiva (%)</th>
                                <th className="p-3 border">Eficiência</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs font-medium">
                            {calcs.analysis.map(s => (
                                <tr key={s.regime} className={s.regime === calcs.best ? 'bg-green-50 font-bold' : ''}>
                                    <td className="p-3 border">{s.regime}</td>
                                    <td className="p-3 border">R$ {(s.total * 12).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</td>
                                    <td className="p-3 border">{((s.total / (calcs.rb || 1)) * 100).toFixed(1)}%</td>
                                    <td className="p-3 border">{s.efficiency}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {/* 3. Memória de Cálculo e Justificativa */}
                <section className="mb-10">
                    <h2 className="text-xl font-bold text-primary mb-4 bg-slate-100 p-2 rounded">3. MEMÓRIA DE CÁLCULO E JUSTIFICATIVA TÉCNICA</h2>
                    <div className="space-y-6">
                        <div className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm">
                            <h3 className="font-bold text-primary text-sm mb-3"># Lucro Real (Não-Cumulativo)</h3>
                            <ul className="text-[11px] text-slate-600 space-y-2">
                                <li>• <strong>PIS/COFINS (9,25%)</strong>: Calculado sobre a Receita de Serviços e Produtos, deduzindo créditos sobre Insumos, Energia e Aluguéis.</li>
                                <li>• <strong>IRPJ/CSLL (15% + 10% adicional + 9%)</strong>: Incide sobre o Lucro Líquido Real (baseado no EBITDA analisado).</li>
                                <li>• <strong>Vantagem</strong>: Ideal para empresas com margens líquidas abaixo de 32% ou alto volume de insumos creditáveis.</li>
                            </ul>
                        </div>
                        <div className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm">
                            <h3 className="font-bold text-primary text-sm mb-3"># Lucro Presumido</h3>
                            <ul className="text-[11px] text-slate-600 space-y-2">
                                <li>• <strong>PIS/COFINS (3,65%)</strong>: Regime cumulativo, sem direito a créditos sobre custos operacionais.</li>
                                <li>• <strong>IRPJ/CSLL</strong>: Baseado na presunção de 32% do faturamento bruto (padrão Serviços).</li>
                                <li>• <strong>Vantagem</strong>: Indicado para empresas com margens de lucro muito elevadas (acima de 32%).</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Rodapé do Parecer */}
                <div className="mt-20 pt-10 border-t border-slate-200 flex justify-between items-end">
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-primary">FBRA SOCIEDADE DE ADVOGADOS</p>
                        <p className="text-xs text-slate-400">Consultoria Tributária e Planejamento Fiscal</p>
                    </div>
                    <div className="text-center w-64 border-t border-slate-400 pt-4">
                        <p className="text-xs font-bold">Responsável Técnico</p>
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">ID: AI-FBRA-{new Date().getFullYear()}</p>
                    </div>
                </div>
            </div>

            {/* RELATÓRIO NA TELA (O que o usuário vê no navegador) */}
            {showResults && (
                <div className="no-print bg-white p-12 rounded-[3.5rem] border border-accent/20 shadow-xl animate-in slide-in-from-bottom-8 duration-1000">
                    <div className="flex items-center justify-between mb-12 border-b border-slate-100 pb-10">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/20">
                                <Sparkles className="text-accent h-10 w-10" />
                            </div>
                            <div>
                                <h2 className="text-4xl font-black text-primary tracking-tighter">Parecer Técnico FBRA</h2>
                                <p className="text-[10px] text-primary/30 uppercase tracking-[0.4em] font-black">Tax Intelligence Engine • v2.0</p>
                            </div>
                        </div>
                        <div className="text-right space-y-1">
                            <p className="text-xs font-black text-primary tracking-widest uppercase">Análise Preditiva</p>
                            <p className="text-xs text-slate-400 font-bold">Ref: 2024-TR-{Math.floor(Math.random() * 10000)}</p>
                            <button
                                onClick={() => window.print()}
                                className="mt-2 px-4 py-2 bg-accent text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent-light transition-all shadow-lg shadow-accent/20 flex items-center gap-2 ml-auto"
                            >
                                <FileDown className="h-4 w-4" /> Gerar Parecer PDF
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        <div className="md:col-span-2 space-y-10">
                            <section className="space-y-4">
                                <div className="flex items-center gap-2 text-accent">
                                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                                    <h4 className="text-xs font-black uppercase tracking-widest">Resumo da Análise</h4>
                                </div>
                                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                                    Após o processamento dos dados contábeis, identificamos que a empresa opera com uma margem EBITDA de
                                    <strong className="text-primary"> {((calcs.ebitda / (calcs.rb || 1)) * 100).toFixed(1)}%</strong>.
                                    Esta métrica indica que o regime de <strong className="text-accent underline decoration-2 decoration-accent/20 underline-offset-4">{calcs.best}</strong> é a rota de maior eficiência.
                                </p>
                            </section>

                            <section className="space-y-6">
                                <div className="flex items-center gap-2 text-accent">
                                    <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                                    <h4 className="text-xs font-black uppercase tracking-widest">Comparativo de Eficiência</h4>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {calcs.analysis.map(s => (
                                        <div key={s.regime} className={`p-6 rounded-3xl border ${s.regime === calcs.best ? 'bg-accent/5 border-accent/20' : 'bg-slate-50 border-slate-100'}`}>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{s.regime}</p>
                                            <p className="text-xl font-black text-primary">R$ {(s.total * 12).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}</p>
                                            <p className={`text-[10px] font-bold mt-2 ${s.regime === calcs.best ? 'text-accent' : 'text-slate-500'}`}>
                                                Eficiência: {s.efficiency}%
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center">
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 font-mono">Índice de Eficiência</h5>
                                <div className="relative w-32 h-32 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-200" />
                                        <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={377} strokeDashoffset={377 - (377 * calcs.efficiency) / 100} className="text-accent" />
                                    </svg>
                                    <span className="absolute text-3xl font-black text-primary">{calcs.efficiency}%</span>
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold mt-6 tracking-tight">Cenário Otimizado vs Cenário Atual</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function CheckCircle({ icon: Icon, className }: { icon: any, className?: string }) {
    return <div className={`inline-block ${className}`}><FileText className="h-4 w-4" /></div>;
}
