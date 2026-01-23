'use client';

import { useEffect, useState } from 'react';
import {
    Users,
    UserPlus,
    Search,
    Mail,
    Shield,
    MoreVertical,
    RefreshCcw,
    ExternalLink,
    CheckCircle2,
    Building2,
    AlertCircle,
    ChevronRight,
    Filter
} from 'lucide-react';
import { getClients } from './actions';
import InviteClientModal from '@/components/admin/InviteClientModal';
import EditClientModal from '@/components/admin/EditClientModal';

export default function ClientsManagementPage() {
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<any | null>(null);

    const loadClients = async () => {
        setLoading(true);
        try {
            const data = await getClients();
            setClients(data || []);
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadClients();
    }, []);

    const filteredClients = clients.filter(client =>
        client.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center text-accent shadow-2xl shadow-primary/20 ring-8 ring-accent/5">
                        <Users className="h-10 w-10" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold italic">Base de <span className="text-accent underline decoration-accent/10">Clientes</span></h1>
                        <p className="text-primary/40 mt-1">Gerencie os acessos e os vínculos dos grupos econômicos.</p>
                    </div>
                </div>

                <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center gap-2 group"
                >
                    <UserPlus className="h-5 w-5 text-accent group-hover:rotate-12 transition-transform" />
                    Convidar Novo Cliente
                </button>
            </div>

            {/* Filters and Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 glass p-4 rounded-[30px] border border-primary/5 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                        <input
                            type="text"
                            placeholder="Buscar por nome, e-mail ou grupo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-accent transition-all"
                        />
                    </div>
                    <button className="p-3 bg-slate-50 text-primary/40 rounded-xl hover:text-primary transition-colors">
                        <Filter className="h-5 w-5" />
                    </button>
                    <div className="h-8 w-[1px] bg-primary/5 mx-2" />
                    <div className="pr-4 hidden md:block text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/20">Total de Clientes</p>
                        <p className="text-lg font-black italic text-primary">{clients.length}</p>
                    </div>
                </div>

                <div className="glass p-4 rounded-[30px] border border-emerald-500/10 bg-emerald-500/[0.02] flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/40">Acessos Ativos</p>
                        <p className="text-lg font-black italic text-emerald-600">{clients.filter(c => c.status === 'active').length}</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                </div>
            </div>

            {/* Clients Table */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-6 glass rounded-[40px] border border-primary/5">
                    <div className="relative">
                        <RefreshCcw className="h-12 w-12 animate-spin text-accent" />
                        <div className="absolute inset-0 bg-accent/20 blur-xl animate-pulse" />
                    </div>
                    <p className="font-bold text-sm text-primary/30 uppercase tracking-[0.2em] animate-pulse">Sincronizando base de clientes...</p>
                </div>
            ) : filteredClients.length === 0 ? (
                <div className="text-center py-32 glass rounded-[40px] border border-primary/5 space-y-4">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                        <Users className="h-10 w-10 text-slate-200" />
                    </div>
                    <div className="space-y-1">
                        <p className="font-bold text-primary/40 italic">Nenhum cliente encontrado</p>
                        <p className="text-xs text-primary/20">Tente ajustar seus filtros ou cadastre um novo cliente.</p>
                    </div>
                </div>
            ) : (
                <div className="glass rounded-[40px] border border-primary/5 overflow-hidden shadow-2xl shadow-primary/5">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-primary/5">
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-primary/30">Cliente e Contato</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-primary/30">Organização e Plano</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-primary/30">Limites do Contrato</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-primary/30">Status</th>
                                <th className="p-8 text-right text-[10px] font-black uppercase tracking-[0.2em] text-primary/30 px-10">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5">
                            {filteredClients.map((client) => (
                                <tr key={client.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                                    <td className="p-8">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-accent text-lg font-black italic shadow-lg shadow-primary/10 group-hover:scale-110 transition-transform">
                                                {client.full_name?.substring(0, 2).toUpperCase() || '??'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-primary italic text-lg leading-tight">{client.full_name || 'Usuário sem nome'}</p>
                                                <p className="text-xs text-primary/40 font-medium flex items-center gap-1.5 mt-1">
                                                    <Mail className="h-3 w-3" />
                                                    {client.email || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <div className="space-y-1">
                                            <p className="font-bold text-primary text-sm flex items-center gap-2">
                                                <Building2 className="h-4 w-4 text-accent" />
                                                {client.organization_name}
                                            </p>
                                            {client.plan ? (
                                                <span className="px-3 py-1 bg-primary text-accent text-[9px] font-black uppercase tracking-wider rounded-lg inline-block ring-1 ring-accent/20">
                                                    {client.plan.name}
                                                </span>
                                            ) : (
                                                <span className="text-primary/20 text-[10px] font-bold italic">Sem plano atribuído</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        {client.plan ? (
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 max-w-[200px]">
                                                <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Usuários:</p>
                                                <p className="text-[10px] font-black text-primary">{client.plan.max_users}</p>
                                                <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Análises:</p>
                                                <p className="text-[10px] font-black text-primary">{client.plan.max_companies}</p>
                                            </div>
                                        ) : (
                                            <span className="text-primary/10">—</span>
                                        )}
                                    </td>
                                    <td className="p-8">
                                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${client.status === 'blocked'
                                            ? 'bg-rose-50 text-rose-500 border border-rose-100 shadow-inner'
                                            : client.status === 'pending'
                                                ? 'bg-amber-50 text-amber-500 border border-amber-100 shadow-inner'
                                                : 'bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-inner'
                                            }`}>
                                            <div className={`w-2 h-2 rounded-full animate-pulse ${client.status === 'blocked' ? 'bg-rose-500' :
                                                client.status === 'pending' ? 'bg-amber-500' : 'bg-emerald-500'
                                                }`} />
                                            {client.status === 'blocked' ? 'Suspenso' : client.status === 'pending' ? 'Aguardando' : 'Ativo'}
                                        </span>
                                    </td>
                                    <td className="p-8 text-right px-10">
                                        <button
                                            onClick={() => setEditingClient(client)}
                                            className="w-12 h-12 bg-white border border-primary/5 rounded-2xl inline-flex items-center justify-center text-primary/20 hover:text-accent hover:border-accent hover:bg-accent/5 hover:scale-110 active:scale-95 transition-all shadow-sm hover:shadow-xl hover:shadow-accent/10"
                                        >
                                            <ChevronRight className="h-6 w-6" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modals */}
            {isInviteModalOpen && (
                <InviteClientModal
                    onClose={() => setIsInviteModalOpen(false)}
                    onSuccess={() => {
                        setIsInviteModalOpen(false);
                        loadClients();
                    }}
                />
            )}

            {editingClient && (
                <EditClientModal
                    client={editingClient}
                    onClose={() => setEditingClient(null)}
                    onSuccess={() => {
                        setEditingClient(null);
                        loadClients();
                    }}
                />
            )}
        </div>
    );
}
