'use client';

import { useState } from 'react';
import { X, Sparkles, Calendar, FileText, ChevronRight, RefreshCcw } from 'lucide-react';
import { createScenario } from '@/app/portal/grupos/scenarios-actions';

interface NewScenarioModalProps {
    groupId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function NewScenarioModal({ groupId, onClose, onSuccess }: NewScenarioModalProps) {
    const [name, setName] = useState('');
    const [year, setYear] = useState(new Date().getFullYear());
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createScenario(groupId, name, year, description);
            onSuccess();
        } catch (error) {
            console.error('Error creating scenario:', error);
            alert('Erro ao criar cenário.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={onClose} />

            <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-10 border-b border-primary/5 bg-slate-50/50 flex justify-between items-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black italic text-primary">Novo <span className="text-accent underline decoration-accent/10">Cenário</span></h2>
                        <p className="text-sm text-primary/40 mt-1 font-medium">Crie um ambiente de simulação isolado.</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl transition-colors text-primary/20 hover:text-primary relative z-10">
                        <X className="h-6 w-6" />
                    </button>
                    <div className="absolute right-0 top-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-10 -mt-10" />
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 px-1">Nome do Cenário</label>
                            <div className="relative">
                                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                                <input
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ex: Simulação de Fusão 2025"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-accent transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 px-1">Ano Base</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                                <input
                                    required
                                    type="number"
                                    value={year}
                                    onChange={(e) => setYear(parseInt(e.target.value))}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-accent transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 px-1">Objetivo da Análise (Opcional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Descreva o que pretende analisar neste cenário..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-3xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-accent transition-all min-h-[100px] resize-none"
                        />
                    </div>

                    <div className="pt-4 border-t border-primary/5 flex flex-col md:flex-row gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 text-primary/40 font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] py-5 bg-primary text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 group"
                        >
                            {loading ? <RefreshCcw className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5 text-accent group-hover:rotate-12 transition-transform" />}
                            Configurar e Iniciar Simulação
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
