'use client';

import { X, User, Mail, Shield, RefreshCcw, CheckCircle, Search, Building2, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getPlans, inviteClient } from '@/app/admin/clients/actions';

interface InviteClientModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function InviteClientModal({ onClose, onSuccess }: InviteClientModalProps) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [orgName, setOrgName] = useState('');
    const [selectedPlan, setSelectedPlan] = useState<string>('');
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingPlans, setFetchingPlans] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        async function loadPlans() {
            try {
                const data = await getPlans();
                setPlans(data || []);
                if (data && data.length > 0) setSelectedPlan(data[0].id);
            } catch (err) {
                console.error('Erro ao carregar planos:', err);
            } finally {
                setFetchingPlans(false);
            }
        }
        loadPlans();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPlan) {
            setError('Selecione um plano para o cliente.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            await inviteClient(email, fullName, orgName || `${fullName} Consultoria`, selectedPlan);
            setSuccess(true);
            setTimeout(() => {
                onSuccess();
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Erro ao convidar cliente');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={onClose} />

            <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-2xl font-bold italic text-primary">Convidar <span className="text-accent underline decoration-accent/10">Cliente</span></h2>
                        <p className="text-sm text-primary/40 mt-1">Configuração de conta e plano contratado.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-primary/20 hover:text-primary">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    {error && (
                        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold animate-in fade-in">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 text-sm font-bold animate-in zoom-in">
                            ✓ Convite de acesso enviado com sucesso!
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Nome do Responsável</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                                <input
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    type="text"
                                    placeholder="Ex: João Silva"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-accent transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">E-mail de Acesso</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                                <input
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    placeholder="joao@empresa.com"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-accent transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Nome da Organização (Empresa do Cliente)</label>
                        <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                            <input
                                required
                                value={orgName}
                                onChange={(e) => setOrgName(e.target.value)}
                                type="text"
                                placeholder="Ex: Silva & Associados Tax"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-accent transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1 italic">Plano Contratado e Limites</label>

                        <div className="grid grid-cols-1 gap-3">
                            {fetchingPlans ? (
                                <div className="p-8 text-center"><RefreshCcw className="h-5 w-5 animate-spin mx-auto text-accent" /></div>
                            ) : plans.map(plan => (
                                <button
                                    key={plan.id}
                                    type="button"
                                    onClick={() => setSelectedPlan(plan.id)}
                                    className={`flex flex-col p-5 rounded-2xl border transition-all text-left group ${selectedPlan === plan.id
                                        ? 'bg-primary border-primary shadow-xl shadow-primary/20 scale-[1.01]'
                                        : 'bg-white border-slate-100 hover:border-accent/30'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className={`text-lg font-black italic tracking-tight ${selectedPlan === plan.id ? 'text-accent' : 'text-primary'}`}>{plan.name}</h3>
                                            <p className={`text-[10px] font-bold ${selectedPlan === plan.id ? 'text-white/40' : 'text-primary/30'}`}>MEMBRO ATIVO N0T4X</p>
                                        </div>
                                        <div className={`text-right ${selectedPlan === plan.id ? 'text-white' : 'text-primary'}`}>
                                            <span className="text-xs font-bold leading-none">R$</span>
                                            <span className="text-2xl font-black italic ml-1 leading-none">{plan.price.toLocaleString('pt-BR')}</span>
                                            <p className={`text-[8px] font-bold uppercase tracking-widest ${selectedPlan === plan.id ? 'text-white/40' : 'text-primary/30'}`}>/ mensal</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1 h-1 rounded-full ${selectedPlan === plan.id ? 'bg-accent' : 'bg-primary/20'}`} />
                                                <span className={`text-[10px] font-bold ${selectedPlan === plan.id ? 'text-white/80' : 'text-primary/60'}`}>Usuários: <b>{plan.max_users}</b></span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1 h-1 rounded-full ${selectedPlan === plan.id ? 'bg-accent' : 'bg-primary/20'}`} />
                                                <span className={`text-[10px] font-bold ${selectedPlan === plan.id ? 'text-white/80' : 'text-primary/60'}`}>Orgs: <b>{plan.max_organizations}</b></span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1 h-1 rounded-full ${selectedPlan === plan.id ? 'bg-accent' : 'bg-primary/20'}`} />
                                                <span className={`text-[10px] font-bold ${selectedPlan === plan.id ? 'text-white/80' : 'text-primary/60'}`}>Análises: <b>{plan.max_companies}</b></span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1 h-1 rounded-full ${selectedPlan === plan.id ? 'bg-accent' : 'bg-primary/20'}`} />
                                                <span className={`text-[10px] font-bold ${selectedPlan === plan.id ? 'text-white/80' : 'text-primary/60'}`}>Parecer AI: <b>{plan.has_parecer ? 'SIM' : 'NÃO'}</b></span>
                                            </div>
                                        </div>
                                    </div>

                                    {selectedPlan === plan.id && (
                                        <div className="absolute right-4 bottom-4">
                                            <CheckCircle className="h-6 w-6 text-accent" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 flex flex-col gap-3">
                        <button
                            type="submit"
                            disabled={loading || success}
                            className={`w-full py-5 font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl ${success ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-primary text-white shadow-primary/20'
                                }`}
                        >
                            {loading ? <RefreshCcw className="h-5 w-5 animate-spin" /> : success ? <CheckCircle className="h-5 w-5" /> : <Save className="h-5 w-5 text-accent" />}
                            {loading ? 'Preparando ecossistema...' : success ? 'Cliente Convidado!' : 'Ativar Assinatura e Convidar'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full py-4 text-primary/40 font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
