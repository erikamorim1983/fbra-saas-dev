'use client';

import { useState } from 'react';
import {
    Calculator,
    ArrowRight,
    TrendingUp,
    AlertCircle,
    FileText,
    Sparkles,
    CheckCircle2,
    Info
} from 'lucide-react';

const scenarioTypes = [
    { id: 'presumido', name: 'Lucro Presumido', description: 'Baseado na presunção de lucro sobre o faturamento bruta.' },
    { id: 'real-acum', name: 'Lucro Real Acumulativo', description: 'Regime onde PIS/COFINS são calculados sem créditos (cumulativo).' },
    { id: 'real-nao-acum', name: 'Lucro Real Não Acumulativo', description: 'Permite tomada de créditos sobre insumos (não-cumulativo).' },
    { id: 'hibrido', name: 'Lucro Real Híbrido', description: 'Combinação estratégica de operações para otimização de carga.' },
];

export default function SimulatorPage() {
    const [step, setStep] = useState(1);
    const [data, setData] = useState({
        name: 'Exemplo S.A.',
        revenue: '1000000',
        costs: '600000',
        expenses: '200000',
        employeeCount: '15',
        segment: 'Indústria',
    });

    const [analyzing, setAnalyzing] = useState(false);
    const [results, setResults] = useState<any>(null);

    const handleSimulate = () => {
        setAnalyzing(true);
        // Simulate AI/Calculation latency
        setTimeout(() => {
            setResults({
                best: 'real-nao-acum',
                scenarios: [
                    { type: 'presumido', tax: 165000, efficiency: 82 },
                    { type: 'real-acum', tax: 142000, efficiency: 88 },
                    { type: 'real-nao-acum', tax: 118000, efficiency: 95 },
                    { type: 'hibrido', tax: 125000, efficiency: 91 },
                ],
                aiOpinion: "Com base no faturamento de R$ 1.000.000,00 e uma margem de custos de 60%, o regime de Lucro Real Não Acumulativo apresenta a maior eficiência fiscal. A possibilidade de aproveitamento de créditos sobre insumos elásticos compensa a alíquota nominal maior de PIS/COFINS (9,25%). Recomenda-se também avaliar o planejamento para o cenário Híbrido caso haja expansão para serviços de logística própria."
            });
            setAnalyzing(false);
            setStep(2);
        }, 2000);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold">Simulador Tributário <span className="text-accent underline decoration-accent/20">Inteligente</span></h1>
                    <p className="text-foreground/50">Compare regimes e obtenha pareceres baseados em IA.</p>
                </div>
                <div className="flex gap-2">
                    <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-accent' : 'bg-white/10'}`} />
                    <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-accent' : 'bg-white/10'}`} />
                </div>
            </div>

            {step === 1 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Inputs Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass p-8 rounded-3xl space-y-6 border-white/5 shadow-xl">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Calculator className="text-accent h-5 w-5" />
                                Dados Financeiros Mensais
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-1">Faturamento Bruto (R$)</label>
                                    <input
                                        type="number"
                                        value={data.revenue}
                                        onChange={(e) => setData({ ...data, revenue: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-accent transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-1">Custos de Insumos (R$)</label>
                                    <input
                                        type="number"
                                        value={data.costs}
                                        onChange={(e) => setData({ ...data, costs: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-accent transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-1">Despesas Operacionais (R$)</label>
                                    <input
                                        type="number"
                                        value={data.expenses}
                                        onChange={(e) => setData({ ...data, expenses: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-accent transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-1">Segmento</label>
                                    <select
                                        value={data.segment}
                                        onChange={(e) => setData({ ...data, segment: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-accent transition-all appearance-none"
                                    >
                                        <option>Indústria</option>
                                        <option>Comércio</option>
                                        <option>Serviços</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={handleSimulate}
                                    disabled={analyzing}
                                    className="w-full py-4 bg-accent text-primary font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-accent/20"
                                >
                                    {analyzing ? (
                                        <>
                                            <Sparkles className="h-5 w-5 animate-spin" />
                                            Analisando Legislação...
                                        </>
                                    ) : (
                                        <>
                                            <TrendingUp className="h-5 w-5" />
                                            Gerar Análise de Cenários
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="space-y-6">
                        <div className="glass p-6 rounded-3xl border-white/5">
                            <h4 className="font-bold flex items-center gap-2 mb-4">
                                <Info className="text-accent h-4 w-4" />
                                Dica Técnica
                            </h4>
                            <p className="text-sm text-foreground/60 leading-relaxed">
                                A análise hibrida considera a fragmentação estratégica de faturamento entre ME/EPP e Lucro Real para redução de alíquotas marginais. Certifique-se de que os dados de custos incluem apenas itens passíveis de crédito.
                            </p>
                        </div>

                        <div className="relative group overflow-hidden rounded-3xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-50 transition-opacity group-hover:opacity-70" />
                            <div className="glass p-6 relative z-10">
                                <Sparkles className="text-accent h-8 w-8 mb-4" />
                                <h4 className="font-bold mb-2 text-lg">Parecer IA</h4>
                                <p className="text-xs text-foreground/50">Nossa inteligência artificial processa mais de 5.000 normas tributárias atualizadas para gerar sua recomendação personalizada.</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Results Summary */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {results.scenarios.map((s: any) => (
                            <div key={s.type} className={`glass p-6 rounded-3xl border-2 transition-all ${results.best === s.type ? 'border-accent bg-accent/5' : 'border-white/5'}`}>
                                {results.best === s.type && (
                                    <div className="bg-accent text-primary text-[10px] font-bold uppercase rounded-full px-2 py-0.5 w-fit mb-3">
                                        Melhor Escolha
                                    </div>
                                )}
                                <h4 className="font-bold text-sm mb-1">{scenarioTypes.find(t => t.id === s.type)?.name}</h4>
                                <div className="text-2xl font-bold mb-4">R$ {s.tax.toLocaleString()}</div>
                                <div className="flex items-center gap-2 text-xs">
                                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div className="bg-accent h-full" style={{ width: `${s.efficiency}%` }} />
                                    </div>
                                    <span className="font-mono text-foreground/40">{s.efficiency}%</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* AI Opinion Block */}
                    <div className="glass p-8 rounded-3xl border-accent/30 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Sparkles className="h-32 w-32 text-accent" />
                        </div>

                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center">
                                    <Sparkles className="text-primary h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-accent">Parecer Técnico Estratégico</h3>
                                    <p className="text-xs text-foreground/40 uppercase tracking-widest font-bold">Gerado por IA FBRA-Tax Engine</p>
                                </div>
                            </div>

                            <div className="prose prose-invert max-w-none">
                                <p className="text-lg leading-relaxed text-foreground/80 italic">
                                    "{results.aiOpinion}"
                                </p>
                            </div>

                            <div className="pt-6 flex gap-4 border-t border-white/10">
                                <button className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold flex items-center gap-2 transition-all">
                                    <FileText className="h-4 w-4" />
                                    Exportar PDF
                                </button>
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-6 py-3 text-accent hover:underline text-sm font-bold"
                                >
                                    Refazer Simulação
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center pt-8">
                        <button className="flex items-center gap-2 text-foreground/30 hover:text-foreground/50 transition-colors text-xs font-bold uppercase tracking-widest">
                            Termos e Bases da Lei 10.833/03 e 10.637/02 aplicadas <ArrowRight className="h-3 w-3" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
