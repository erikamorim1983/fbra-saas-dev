'use client';

import { X, User, Mail, Shield, RefreshCcw, CheckCircle, Search, Building2, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getCompanyGroups, inviteClient } from '@/app/admin/clients/actions';

interface InviteClientModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function InviteClientModal({ onClose, onSuccess }: InviteClientModalProps) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
    const [groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingGroups, setFetchingGroups] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function loadGroups() {
            try {
                const data = await getCompanyGroups();
                setGroups(data || []);
            } catch (err) {
                console.error('Erro ao carregar grupos:', err);
            } finally {
                setFetchingGroups(false);
            }
        }
        loadGroups();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedGroups.length === 0) {
            setError('Selecione ao menos um grupo econômico para vincular a este cliente.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            await inviteClient(email, fullName, selectedGroups);
            setSuccess(true);
            setTimeout(() => {
                onSuccess();
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Erro ao convidar cliente');
            setLoading(false);
        }
    };

    const toggleGroup = (id: string) => {
        setSelectedGroups(prev =>
            prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
        );
    };

    const filteredGroups = groups.filter(g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={onClose} />

            <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-2xl font-bold italic text-primary">Convidar <span className="text-accent underline decoration-accent/10">Cliente</span></h2>
                        <p className="text-sm text-primary/40 mt-1">O cliente receberá um e-mail para configurar sua senha.</p>
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

                    <div className="space-y-4">
                        <div className="flex justify-between items-end px-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Vincular Grupos Econômicos</label>
                            <span className="text-[10px] font-bold text-accent">{selectedGroups.length} selecionado(s)</span>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                type="text"
                                placeholder="Filtrar grupos..."
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold focus:outline-none focus:border-accent transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-3xl border border-slate-100 custom-scrollbar">
                            {fetchingGroups ? (
                                <div className="p-8 text-center"><RefreshCcw className="h-5 w-5 animate-spin mx-auto text-accent" /></div>
                            ) : filteredGroups.length === 0 ? (
                                <p className="text-center py-4 text-xs text-primary/30">Nenhum grupo encontrado.</p>
                            ) : filteredGroups.map(group => (
                                <button
                                    key={group.id}
                                    type="button"
                                    onClick={() => toggleGroup(group.id)}
                                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${selectedGroups.includes(group.id)
                                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                            : 'bg-white border-slate-100 text-primary/60 hover:border-accent/30'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Building2 className={`h-4 w-4 ${selectedGroups.includes(group.id) ? 'text-accent' : 'text-primary/20'}`} />
                                        <span className="text-xs font-bold">{group.name}</span>
                                    </div>
                                    {selectedGroups.includes(group.id) && <CheckCircle className="h-4 w-4 text-accent" />}
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
                            {loading ? 'Enviando convite...' : success ? 'Cliente Convidado!' : 'Disparar Acesso Especial'}
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
