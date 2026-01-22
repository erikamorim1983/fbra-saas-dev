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
import { createClient } from '@/utils/supabase/client';

interface NewCompanyModalProps {
    groupId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function NewCompanyModal({ groupId, onClose, onSuccess }: NewCompanyModalProps) {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        cnpj: '',
        segment: 'Serviços',
        current_regime: 'Lucro Presumido',
        iss_rate: 5
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log('📝 Tentando criar empresa:', formData);
            console.log('📝 Group ID:', groupId);

            const { data, error } = await supabase
                .from('companies')
                .insert({
                    group_id: groupId,
                    name: formData.name,
                    cnpj: formData.cnpj,
                    segment: formData.segment,
                    current_regime: formData.current_regime,
                    iss_rate: formData.iss_rate
                } as any)
                .select();

            if (error) {
                console.error('❌ Erro Supabase:', error);
                console.error('❌ Código:', error.code);
                console.error('❌ Mensagem:', error.message);
                console.error('❌ Detalhes:', error.details);
                throw error;
            }

            console.log('✅ Empresa criada:', data);
            onSuccess();
        } catch (error: any) {
            console.error('Error creating company:', error);
            alert('Erro ao cadastrar empresa: ' + (error.message || 'Verifique o console para mais detalhes.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-primary w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center text-accent">
                            <Building2 className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Nova Unidade</h2>
                            <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Cadastro de CNPJ Coligado</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-primary/20 hover:text-primary">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nome */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 flex items-center gap-2">
                                <Briefcase className="h-3 w-3" />
                                Nome da Empresa
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="Ex: N0T4X Sul Ltda"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent transition-all font-medium"
                            />
                        </div>

                        {/* CNPJ */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 flex items-center gap-2">
                                <Hash className="h-3 w-3" />
                                CNPJ Completo
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="00.000.000/0000-00"
                                value={formData.cnpj}
                                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-primary focus:outline-none focus:border-accent transition-all font-mono"
                            />
                        </div>

                        {/* Segmento */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 flex items-center gap-2">
                                <Layers className="h-3 w-3" />
                                Segmento de Atuação
                            </label>
                            <select
                                value={formData.segment}
                                onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-primary focus:outline-none focus:border-accent transition-all font-medium"
                            >
                                <option value="Serviços">Serviços</option>
                                <option value="Comércio">Comércio</option>
                                <option value="Indústria">Indústria</option>
                            </select>
                        </div>

                        {/* Regime Atual */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                                <Sparkles className="h-3 w-3" />
                                Regime Tributário Vigente
                            </label>
                            <select
                                value={formData.current_regime}
                                onChange={(e) => setFormData({ ...formData, current_regime: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent transition-all font-medium"
                            >
                                <option value="Lucro Presumido">Lucro Presumido</option>
                                <option value="Lucro Real">Lucro Real</option>
                                <option value="Simples Nacional">Simples Nacional</option>
                            </select>
                        </div>

                        {/* ISS Rate */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 flex items-center gap-2">
                                <Percent className="h-3 w-3" />
                                Alíquota ISS (Média %)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                min="2"
                                max="5"
                                value={formData.iss_rate}
                                onChange={(e) => setFormData({ ...formData, iss_rate: parseFloat(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 border border-white/10 text-white/60 font-bold rounded-2xl hover:bg-white/5 transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-4 bg-accent text-primary font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-2"
                        >
                            {loading ? <RefreshCcw className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                            {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
