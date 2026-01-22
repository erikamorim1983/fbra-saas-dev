'use client';

import { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, ArrowLeft, Search, MoreVertical, ShieldCheck, MailPlus, RefreshCcw, Edit2, Ban, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { getUsers } from './actions';
import InviteUserModal from '@/components/admin/InviteUserModal';
import EditUserModal from '@/components/admin/EditUserModal';

export default function UsersSettingsPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any | null>(null);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {isInviteModalOpen && (
                <InviteUserModal
                    onClose={() => setIsInviteModalOpen(false)}
                    onSuccess={() => {
                        setIsInviteModalOpen(false);
                        loadUsers();
                    }}
                />
            )}

            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onSuccess={() => {
                        setEditingUser(null);
                        loadUsers();
                    }}
                />
            )}

            <Link href="/admin/settings" className="inline-flex items-center gap-2 text-primary/50 hover:text-accent font-medium transition-colors group">
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Voltar para Configurações
            </Link>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center text-accent shadow-2xl shadow-primary/20 ring-8 ring-accent/5">
                        <Users className="h-10 w-10" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold italic">Usuários e <span className="text-accent underline decoration-accent/10">Perfis</span></h1>
                        <p className="text-primary/40 mt-1">Gestão de acessos à plataforma administrativa.</p>
                    </div>
                </div>

                <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="px-8 py-4 bg-accent text-primary font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent/20 flex items-center gap-2 group"
                >
                    <UserPlus className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                    Convidar Novo Usuário
                </button>
            </div>

            <div className="glass p-10 rounded-[40px] border border-primary/5 space-y-8">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou e-mail..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-accent transition-all"
                        />
                    </div>

                    <div className="flex gap-2">
                        <span className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-primary/40 uppercase tracking-widest leading-loose">
                            {loading ? '...' : users.length} Usuários Totais
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4 opacity-50">
                        <RefreshCcw className="h-8 w-8 animate-spin text-accent" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Consultando Supabase...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-primary/5">
                                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-primary/20">Membro</th>
                                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-primary/20">Nível de Acesso</th>
                                    <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-primary/20">Status</th>
                                    <th className="text-right p-4 text-[10px] font-black uppercase tracking-widest text-primary/20">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/5">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-primary font-bold italic border border-primary/5 group-hover:bg-primary group-hover:text-white transition-all uppercase">
                                                    {user.full_name?.substring(0, 2) || '??'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-primary italic">{user.full_name || 'Sem Nome'}</p>
                                                    <p className="text-xs text-primary/40 leading-none mt-1">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <ShieldCheck className={`h-4 w-4 ${user.role === 'admin' ? 'text-accent' : 'text-primary/20'}`} />
                                                <span className="text-xs font-bold text-primary/60 uppercase">{user.role || 'client'}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${user.status === 'blocked'
                                                ? 'bg-rose-50 text-rose-600'
                                                : user.status === 'pending'
                                                    ? 'bg-amber-50 text-amber-600'
                                                    : 'bg-emerald-50 text-emerald-600'
                                                }`}>
                                                {user.status === 'blocked' ? 'Bloqueado' : user.status === 'pending' ? 'Pendente' : 'Ativo'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => setEditingUser(user)}
                                                className="p-3 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100 shadow-sm text-primary/20 hover:text-accent group/btn"
                                            >
                                                <Edit2 className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Bottom Info Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
                <div className="glass p-8 rounded-[40px] border border-primary/5 space-y-4">
                    <Shield className="h-8 w-8 text-accent mb-2" />
                    <h3 className="text-xl font-bold italic">Permissões de Perfil</h3>
                    <p className="text-sm text-primary/40 leading-relaxed">Defina o que cada nível de acesso pode visualizar ou editar no ecossistema econômico N0T4X.</p>
                    <Link href="/admin/settings/users/permissions" className="text-accent text-sm font-bold hover:underline block w-fit">Configurar Matriz de Acesso</Link>
                </div>
                <div className="glass p-8 rounded-[40px] border border-primary/5 space-y-4">
                    <MailPlus className="h-8 w-8 text-primary mb-2" />
                    <h3 className="text-xl font-bold italic">Log de Convites</h3>
                    <p className="text-sm text-primary/40 leading-relaxed">Histórico de e-mails disparados e status de aceitação dos termos de uso da plataforma.</p>
                    <button className="text-primary text-sm font-bold hover:underline">Ver Histórico de Envio</button>
                </div>
            </div>
        </div>
    );
}
