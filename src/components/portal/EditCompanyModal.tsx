'use client';

import React, { useState } from 'react';
import {
    X,
    Building2,
    Save,
    Hash,
    Briefcase,
    Layers,
    Percent,
    RefreshCcw,
    Sparkles
} from 'lucide-react';
import { updateCompany } from '@/app/portal/grupos/company-actions';

interface EditCompanyModalProps {
    groupId: string;
    company: any;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditCompanyModal({ groupId, company, onClose, onSuccess }: EditCompanyModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: company.name,
        cnpj: company.cnpj,
        segment: company.segment || 'Serviços',
        current_regime: company.current_regime || 'Lucro Presumido',
        iss_rate: company.iss_rate || 5
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await updateCompany(company.id, groupId, formData);
            onSuccess();
        } catch (error: any) {
            console.error('Error updating company:', error);
            alert('Erro ao atualizar empresa: ' + (error.message || 'Verifique o console.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-[#081F2E] w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-10 border-b border-white/5 flex justify-between items-center bg-[#0C2538]">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-accent/20 rounded-[20px] flex items-center justify-center text-accent shadow-inner shadow-accent/10">
                            <Building2 className="h-7 w-7" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black italic text-white leading-none">Editar <span className="text-accent underline decoration-accent/10">Unidade</span></h2>
                            <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mt-2">Atualizar dados do CNPJ Coligado</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl transition-colors text-white/20 hover:text-white">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-10 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Nome */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 px-1 flex items-center gap-2">
                                <Briefcase className="h-3 w-3 text-accent" />
                                Nome Social da Empresa
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="Ex: N0T4X Sul Ltda"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-accent transition-all font-bold placeholder:opacity-20 shadow-inner"
                            />
                        </div>

                        {/* CNPJ */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 px-1 flex items-center gap-2">
                                <Hash className="h-3 w-3 text-accent" />
                                CNPJ Completo
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="00.000.000/0000-00"
                                value={formData.cnpj}
                                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-accent transition-all font-mono font-bold placeholder:opacity-20 shadow-inner"
                            />
                        </div>

                        {/* Segmento */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 px-1 flex items-center gap-2">
                                <Layers className="h-3 w-3 text-accent" />
                                Segmento de Atuação
                            </label>
                            <select
                                value={formData.segment}
                                onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-accent transition-all font-bold appearance-none cursor-pointer shadow-inner"
                            >
                                <option value="Serviços" className="bg-[#081F2E]">Serviços</option>
                                <option value="Comércio" className="bg-[#081F2E]">Comércio</option>
                                <option value="Indústria" className="bg-[#081F2E]">Indústria</option>
                            </select>
                        </div>

                        {/* Regime Atual */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 px-1 flex items-center gap-2">
                                <Sparkles className="h-3 w-3 text-accent" />
                                Regime Tributário Vigente
                            </label>
                            <select
                                value={formData.current_regime}
                                onChange={(e) => setFormData({ ...formData, current_regime: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-accent transition-all font-bold appearance-none cursor-pointer shadow-inner"
                            >
                                <option value="Simples Nacional" className="bg-[#081F2E]">Simples Nacional</option>
                                <option value="Lucro Presumido" className="bg-[#081F2E]">Lucro Presumido</option>
                                <option value="Lucro Real" className="bg-[#081F2E]">Lucro Real</option>
                            </select>
                        </div>

                        {/* ISS Rate */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 px-1 flex items-center gap-2">
                                <Percent className="h-3 w-3 text-accent" />
                                Alíquota ISS (Média %)
                            </label>
                            <div className="relative flex items-center">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, iss_rate: Math.max(2, formData.iss_rate - 0.5) })}
                                    className="absolute left-2 w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg text-white/40 hover:text-accent transition-all"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="2"
                                    max="5"
                                    value={formData.iss_rate}
                                    onChange={(e) => setFormData({ ...formData, iss_rate: parseFloat(e.target.value) })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-12 text-center text-white focus:outline-none focus:border-accent transition-all font-bold shadow-inner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, iss_rate: Math.min(5, formData.iss_rate + 0.5) })}
                                    className="absolute right-2 w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg text-white/40 hover:text-accent transition-all"
                                >
                                    +
                                </button>
                                <div className="absolute right-12 top-1/2 -translate-y-1/2 text-accent font-black text-xs uppercase tracking-widest pointer-events-none">%</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-5 border border-white/5 text-white/40 font-black uppercase tracking-widest rounded-2xl hover:bg-white/5 hover:text-white transition-all text-xs"
                        >
                            Cancelar Operação
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] py-5 bg-accent text-primary font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-accent/20 flex items-center justify-center gap-3 text-xs"
                        >
                            {loading ? <RefreshCcw className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                            {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
