'use client';

import { X, User, Shield, RefreshCcw, Save, Trash2, Ban, CheckCircle, Building2, Search, Link2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getCompanyGroups, updateClientGroups } from '@/app/admin/clients/actions';
import { deleteUser, updateUser } from '@/app/admin/settings/users/actions';

interface EditClientModalProps {
    client: any;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditClientModal({ client, onClose, onSuccess }: EditClientModalProps) {
    const [fullName, setFullName] = useState(client.full_name || '');
    const [status, setStatus] = useState(client.status || 'active');
    const [selectedGroups, setSelectedGroups] = useState<string[]>(client.groups?.map((g: any) => g.id) || []);
    const [groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingGroups, setFetchingGroups] = useState(true);
    const [error, setError] = useState('');
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
        setLoading(true);
        setError('');

        try {
            // Update profile info
            await updateUser(client.id, { full_name: fullName, status });
            // Update group links
            await updateClientGroups(client.id, selectedGroups);
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Erro ao atualizar cliente');
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Tem certeza que deseja DELETAR permanentemente este cliente e remover seus acessos?')) return;

        setLoading(true);
        try {
            await deleteUser(client.id);
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Erro ao deletar cliente');
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
                        <h2 className="text-2xl font-bold italic">Editar <span className="text-accent underline decoration-accent/10">Cliente</span></h2>
                        <p className="text-xs text-primary/40 mt-1 uppercase tracking-widest font-bold">{client.email}</p>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Nome Completo</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                                <input
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    type="text"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-accent transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Status de Acesso</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className={`w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-accent transition-all appearance-none ${status === 'blocked' ? 'text-rose-500' : 'text-emerald-500'
                                    }`}
                            >
                                <option value="active">✓ Ativo</option>
                                <option value="blocked">⚠ Bloqueado</option>
                                <option value="pending">⏳ Pendente</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-end px-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40">Grupos Econômicos Vinculados</label>
                            <span className="text-[10px] font-bold text-accent">{selectedGroups.length} grupo(s)</span>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                type="text"
                                placeholder="Buscar grupos..."
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold focus:outline-none focus:border-accent transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-3xl border border-slate-100 custom-scrollbar">
                            {fetchingGroups ? (
                                <div className="p-8 text-center"><RefreshCcw className="h-5 w-5 animate-spin mx-auto text-accent" /></div>
                            ) : filteredGroups.map(group => {
                                const isLinkedToOther = group.owner_id && group.owner_id !== client.id;
                                return (
                                    <button
                                        key={group.id}
                                        type="button"
                                        disabled={isLinkedToOther}
                                        onClick={() => toggleGroup(group.id)}
                                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${selectedGroups.includes(group.id)
                                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                                : isLinkedToOther
                                                    ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed opacity-50'
                                                    : 'bg-white border-slate-100 text-primary/60 hover:border-accent/30'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Building2 className={`h-4 w-4 ${selectedGroups.includes(group.id) ? 'text-accent' : 'text-primary/20'}`} />
                                            <div className="text-left">
                                                <p className="text-xs font-bold">{group.name}</p>
                                                {isLinkedToOther && <p className="text-[9px] font-medium text-rose-400">Vinculado a outro cliente</p>}
                                            </div>
                                        </div>
                                        {selectedGroups.includes(group.id) && <CheckCircle className="h-4 w-4 text-accent" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pt-6 flex flex-col gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-primary text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:shadow-accent/10"
                        >
                            {loading ? <RefreshCcw className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5 text-accent" />}
                            Salvar Alterações do Cliente
                        </button>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setStatus(status === 'blocked' ? 'active' : 'blocked')}
                                className={`py-4 px-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border ${status === 'blocked'
                                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100'
                                        : 'bg-amber-50 border-amber-100 text-amber-600 hover:bg-amber-100'
                                    }`}
                            >
                                {status === 'blocked' ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                                {status === 'blocked' ? 'Desbloquear' : 'Bloquear Acesso'}
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="py-4 px-2 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-100 transition-all"
                            >
                                <Trash2 className="h-4 w-4" />
                                Deletar Cliente
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
