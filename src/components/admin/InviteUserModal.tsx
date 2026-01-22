'use client';

import { useState } from 'react';
import { X, Mail, User, Shield, RefreshCcw, CheckCircle } from 'lucide-react';
import { inviteUser } from '@/app/admin/settings/users/actions';

interface InviteUserModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function InviteUserModal({ onClose, onSuccess }: InviteUserModalProps) {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState('client');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            await inviteUser(email, fullName, role);
            setSuccess(true);
            setTimeout(() => {
                onSuccess();
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Erro ao convidar usuário');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={onClose} />

            <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-2xl font-bold italic">Convidar <span className="text-accent underline decoration-accent/10">Novo Membro</span></h2>
                        <p className="text-xs text-primary/40 mt-1 uppercase tracking-widest font-bold">Acesso ao ecossistema N0T4X</p>
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

                    {success && (
                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 text-sm font-bold animate-in zoom-in">
                            ✓ Convite enviado com sucesso para {email}!
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Nome Completo</label>
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
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">E-mail Corporativo</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                            <input
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                placeholder="joao@empresa.com.br"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-accent transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Perfil de Acesso</label>
                        <div className="relative">
                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-accent transition-all appearance-none"
                            >
                                <option value="consultant">Consultor Sênior (Gestão de múltiplos grupos)</option>
                                <option value="support">Suporte Técnico (Acesso assistencial)</option>
                                <option value="admin">Administrador (Gestão total da N0T4X)</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-slate-50 text-primary/40 font-bold rounded-2xl hover:bg-slate-100 transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || success}
                            className={`flex-[2] py-4 font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl ${success ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-primary text-white shadow-primary/20'
                                }`}
                        >
                            {loading ? <RefreshCcw className="h-5 w-5 animate-spin" /> : success ? <CheckCircle className="h-5 w-5" /> : <Mail className="h-5 w-5 text-accent" />}
                            {loading ? 'Enviando Convite...' : success ? 'Convite Enviado!' : 'Disparar Convite Oficial'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
