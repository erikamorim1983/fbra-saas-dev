'use client';

import { X, Save, RefreshCcw, CheckCircle, Package, Users, Building2, FileText, IndianRupee } from 'lucide-react';
import { useState, useEffect } from 'react';
import { upsertPlan } from '@/app/admin/plans/actions';

interface PlanModalProps {
    plan?: any;
    onClose: () => void;
    onSuccess: () => void;
}

export default function PlanModal({ plan, onClose, onSuccess }: PlanModalProps) {
    const [formData, setFormData] = useState({
        id: plan?.id || null,
        name: plan?.name || '',
        max_users: plan?.max_users || 1,
        max_organizations: plan?.max_organizations || 1,
        max_companies: plan?.max_companies || 5,
        has_parecer: plan?.has_parecer || false,
        price: plan?.price || 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await upsertPlan(formData);
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Erro ao salvar plano');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={onClose} />

            <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-2xl font-bold italic text-primary">
                            {plan ? 'Editar' : 'Criar'} <span className="text-accent underline decoration-accent/10">Plano</span>
                        </h2>
                        <p className="text-sm text-primary/40 mt-1 uppercase tracking-widest font-black text-[10px]">Configuração de limites e precificação</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-primary/20 hover:text-primary">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold animate-in fade-in">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Nome do Plano</label>
                                <div className="relative">
                                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                                    <input
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        type="text"
                                        placeholder="Ex: GOLD"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-accent transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Preço Mensal (R$)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 font-bold text-sm">R$</span>
                                    <input
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        type="number"
                                        step="0.01"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-accent transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Usuários</label>
                                <div className="relative">
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                                    <input
                                        required
                                        value={formData.max_users}
                                        onChange={(e) => setFormData({ ...formData, max_users: e.target.value })}
                                        type="number"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-accent transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Orgs</label>
                                <div className="relative">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                                    <input
                                        required
                                        value={formData.max_organizations}
                                        onChange={(e) => setFormData({ ...formData, max_organizations: e.target.value })}
                                        type="number"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-accent transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Empresas</label>
                                <div className="relative">
                                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                                    <input
                                        required
                                        value={formData.max_companies}
                                        onChange={(e) => setFormData({ ...formData, max_companies: e.target.value })}
                                        type="number"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-accent transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${formData.has_parecer ? 'bg-accent/20 text-accent' : 'bg-slate-200 text-primary/20'}`}>
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-primary italic">Parecer AI / Técnico</p>
                                    <p className="text-[10px] text-primary/30 uppercase font-black tracking-widest">Incluso no plano?</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, has_parecer: !formData.has_parecer })}
                                className={`w-14 h-8 rounded-full transition-all relative ${formData.has_parecer ? 'bg-accent' : 'bg-slate-300'}`}
                            >
                                <div className={`absolute top-1 h-6 w-6 bg-white rounded-full transition-all shadow-md ${formData.has_parecer ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 flex flex-col gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-primary text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:shadow-accent/10"
                        >
                            {loading ? <RefreshCcw className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5 text-accent" />}
                            Salvar Configuração do Plano
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full py-4 text-primary/40 font-bold text-[10px] uppercase tracking-widest hover:text-primary transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
