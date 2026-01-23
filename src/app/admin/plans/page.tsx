'use client';

import { useState, useEffect } from 'react';
import {
    CreditCard,
    Plus,
    RefreshCcw,
    Edit,
    Trash2,
    CheckCircle2,
    Users,
    Building2,
    FileText,
    TrendingUp,
    Shield
} from 'lucide-react';
import { getPlans, deletePlan } from './actions';
import PlanModal from '@/components/admin/PlanModal';

export default function PlansManagementPage() {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<any | null>(null);

    const loadPlans = async () => {
        setLoading(true);
        try {
            const data = await getPlans();
            setPlans(data || []);
        } catch (error) {
            console.error('Error fetching plans:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPlans();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja deletar este plano? Isso não afetará assinaturas existentes mas impedirá novas.')) return;

        try {
            await deletePlan(id);
            loadPlans();
        } catch (error) {
            console.error('Error deleting plan:', error);
            alert('Não foi possível deletar o plano.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center text-accent shadow-2xl shadow-primary/20 ring-8 ring-accent/5">
                        <CreditCard className="h-10 w-10" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold italic text-primary">Modelos de <span className="text-accent underline decoration-accent/10">Planos</span></h1>
                        <p className="text-primary/40 mt-1 font-medium">Configure os limites e valores para novos contratos.</p>
                    </div>
                </div>

                <button
                    onClick={() => {
                        setEditingPlan(null);
                        setIsModalOpen(true);
                    }}
                    className="px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center gap-2 group"
                >
                    <Plus className="h-5 w-5 text-accent group-hover:rotate-12 transition-transform" />
                    Novo Modelo de Plano
                </button>
            </div>

            {/* Plans List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-6 glass rounded-[40px] border border-primary/5 bg-white/50">
                    <RefreshCcw className="h-12 w-12 animate-spin text-accent" />
                    <p className="font-bold text-sm text-primary/30 uppercase tracking-[0.2em]">Carregando planos...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className="bg-white rounded-[40px] border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden flex flex-col"
                        >
                            {/* Card Header */}
                            <div className="p-8 pb-4 relative">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-3xl font-black italic text-primary tracking-tighter group-hover:text-accent transition-colors">{plan.name}</h3>
                                        <p className="text-[10px] font-black uppercase text-primary/30 tracking-[0.2em] mt-1">N0T4X SaaS Solution</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingPlan(plan);
                                                setIsModalOpen(true);
                                            }}
                                            className="p-2 bg-slate-50 text-primary/20 hover:text-accent hover:bg-accent/10 rounded-xl transition-all"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(plan.id)}
                                            className="p-2 bg-slate-50 text-primary/20 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-baseline gap-1 mt-6">
                                    <span className="text-sm font-bold text-primary/40 uppercase">R$</span>
                                    <span className="text-5xl font-black italic tracking-tighter text-primary">
                                        {plan.price.toLocaleString('pt-BR')}
                                    </span>
                                    <span className="text-[10px] font-bold text-primary/30 uppercase tracking-widest ml-1">/ mês</span>
                                </div>
                            </div>

                            {/* Card Body (Features) */}
                            <div className="p-8 pt-6 space-y-4 flex-1">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary/40">
                                            <Users className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-bold text-primary/60">Até <b>{plan.max_users}</b> usuários</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary/40">
                                            <Building2 className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-bold text-primary/60">Até <b>{plan.max_organizations}</b> organizações</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary/40">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-bold text-primary/60">Até <b>{plan.max_companies}</b> empresas analisadas</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${plan.has_parecer ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                            <Shield className="h-4 w-4" />
                                        </div>
                                        <span className="text-sm font-bold text-primary/60">Parecer AI/Técnico: <b>{plan.has_parecer ? 'Sim' : 'Não'}</b></span>
                                    </div>
                                </div>
                            </div>

                            {/* Card Footer (Decorative) */}
                            <div className="p-8 pt-0 mt-auto">
                                <div className="h-1 bg-slate-50 rounded-full overflow-hidden">
                                    <div className="h-full bg-accent w-1/3 group-hover:w-full transition-all duration-700" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <PlanModal
                    plan={editingPlan}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        loadPlans();
                    }}
                />
            )}
        </div>
    );
}
