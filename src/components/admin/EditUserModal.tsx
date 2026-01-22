'use client';

import { useState } from 'react';
import { X, User, Shield, RefreshCcw, Save, Trash2, Ban, CheckCircle, Hash, Phone, MapPin, Briefcase } from 'lucide-react';
import { updateUser, deleteUser } from '@/app/admin/settings/users/actions';

interface EditUserModalProps {
    user: any;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditUserModal({ user, onClose, onSuccess }: EditUserModalProps) {
    const [fullName, setFullName] = useState(user.full_name || '');
    const [role, setRole] = useState(user.role || 'consultant');
    const [status, setStatus] = useState(user.status || 'active');
    const [cpf, setCpf] = useState(user.cpf || '');
    const [phone, setPhone] = useState(user.phone || '');
    const [address, setAddress] = useState(user.address || '');
    const [jobTitle, setJobTitle] = useState(user.job_title || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await updateUser(user.id, {
                full_name: fullName,
                role,
                status,
                cpf,
                phone,
                address,
                job_title: jobTitle
            });
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Erro ao atualizar usuário');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Tem certeza que deseja DELETAR permanentemente este usuário?')) return;

        setLoading(true);
        try {
            await deleteUser(user.id);
            onSuccess();
        } catch (err: any) {
            setError(err.message || 'Erro ao deletar usuário');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={onClose} />

            <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-2xl font-bold italic">Editar <span className="text-accent underline decoration-accent/10">Perfil Completo</span></h2>
                        <p className="text-xs text-primary/40 mt-1 uppercase tracking-widest font-bold">{user.email}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-primary/20 hover:text-primary">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {error && (
                        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold animate-in fade-in">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nome Completo */}
                        <div className="space-y-2 md:col-span-2">
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

                        {/* CPF */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">CPF</label>
                            <div className="relative">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                                <input
                                    value={cpf}
                                    onChange={(e) => setCpf(e.target.value)}
                                    placeholder="000.000.000-00"
                                    type="text"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-accent transition-all"
                                />
                            </div>
                        </div>

                        {/* Cargo */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Cargo / Função</label>
                            <div className="relative">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                                <input
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                    placeholder="Ex: Diretor Fiscal"
                                    type="text"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-accent transition-all"
                                />
                            </div>
                        </div>

                        {/* Telefone */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Telefone / WhatsApp</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                                <input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="(00) 00000-0000"
                                    type="text"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-accent transition-all"
                                />
                            </div>
                        </div>

                        {/* Perfil */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Nível de Sistema</label>
                            <div className="relative">
                                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-accent transition-all appearance-none"
                                >
                                    <option value="consultant">Consultor Sênior</option>
                                    <option value="support">Suporte Técnico (N0T4X)</option>
                                    <option value="admin">Administrador Geral</option>
                                </select>
                            </div>
                        </div>

                        {/* Endereço */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Endereço Residencial / Comercial</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                                <input
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Rua, Número, Bairro, Cidade - UF"
                                    type="text"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-accent transition-all"
                                />
                            </div>
                        </div>

                        {/* Status */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Status da Conta</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className={`w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-accent transition-all appearance-none ${status === 'blocked' ? 'text-rose-500' : 'text-emerald-500'
                                    }`}
                            >
                                <option value="active">✓ Ativo (Acesso Liberado)</option>
                                <option value="blocked">⚠ Bloqueado (Acesso Suspenso)</option>
                                <option value="pending">⏳ Pendente (Aguardando Ativação)</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-6 flex flex-col gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-primary text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:shadow-accent/10"
                        >
                            {loading ? <RefreshCcw className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5 text-accent" />}
                            Salvar Perfil Completo
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
                                Deletar Conta
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
