'use client';

import { useEffect, useState, useRef } from 'react';
import {
    Building2,
    Plus,
    Search,
    MoreVertical,
    LayoutGrid,
    List,
    AlertTriangle,
    FileCheck,
    RefreshCcw,
    Archive,
    Trash2,
    RotateCcw,
    Pencil,
    XCircle
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { updateGroupStatus, deleteGroupPermanently } from './actions';
import EditGroupModal from '@/components/portal/EditGroupModal';

export default function GroupsPage() {
    const supabase = createClient();
    const [groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'active' | 'archived' | 'deleted'>('active');
    const [menuOpen, setMenuOpen] = useState<string | null>(null);
    const [editingGroup, setEditingGroup] = useState<any | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('company_groups')
                .select(`
                    id,
                    name,
                    cnpj_raiz,
                    status,
                    companies (
                        id,
                        name,
                        cnpj,
                        current_regime
                    )
                `)
                .eq('status', activeTab);

            if (error) throw error;
            setGroups(data || []);
        } catch (error) {
            console.error('Error fetching groups:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, [activeTab]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: 'active' | 'archived' | 'deleted') => {
        try {
            await updateGroupStatus(id, newStatus);
            setMenuOpen(null);
            fetchGroups();
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            alert('Erro ao realizar operação.');
        }
    };

    const handleDeletePermanently = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir permanentemente este grupo e todos os seus dados? Esta ação não pode ser desfeita.')) return;
        try {
            await deleteGroupPermanently(id);
            setMenuOpen(null);
            fetchGroups();
        } catch (error) {
            console.error('Erro ao excluir:', error);
            alert('Erro ao realizar operação.');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Meus Grupos de Empresas</h1>
                    <p className="text-primary/50">Gerencie e analise holdings de forma consolidada.</p>
                </div>
                <Link
                    href="/portal/grupos/new"
                    className="px-6 py-3 bg-accent text-primary rounded-xl text-sm font-bold hover:scale-105 transition-all shadow-xl shadow-accent/20 flex items-center gap-2"
                >
                    <Plus className="h-5 w-5" />
                    Novo Grupo
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
                <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
                    {[
                        { id: 'active', label: 'Ativos', icon: FileCheck },
                        { id: 'archived', label: 'Arquivados', icon: Archive },
                        { id: 'deleted', label: 'Lixeira', icon: Trash2 },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab.id
                                ? 'bg-white text-primary shadow-sm'
                                : 'text-primary/40 hover:text-primary'
                                }`}
                        >
                            <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-accent' : ''}`} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                    <input
                        type="text"
                        placeholder="Buscar grupo ou CNPJ..."
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent transition-all"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                    <RefreshCcw className="h-8 w-8 animate-spin text-accent" />
                    <p className="font-bold text-sm text-primary uppercase tracking-widest">Sincronizando com Supabase...</p>
                </div>
            ) : groups.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                    <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-400">
                        {activeTab === 'active' ? 'Nenhum grupo encontrado. Comece criando um novo!' :
                            activeTab === 'archived' ? 'Nenhum grupo arquivado.' : 'A lixeira está vazia.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map((group) => (
                        <div key={group.id} className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-accent/30 transition-all group flex flex-col shadow-sm relative">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-primary transition-all">
                                    <Building2 className="h-6 w-6" />
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={() => setMenuOpen(menuOpen === group.id ? null : group.id)}
                                        className="p-2 hover:bg-slate-50 rounded-lg transition-colors"
                                    >
                                        <MoreVertical className="h-5 w-5 text-primary/20" />
                                    </button>

                                    {menuOpen === group.id && (
                                        <div
                                            ref={menuRef}
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 py-2 animate-in fade-in zoom-in-95 duration-200"
                                        >
                                            {activeTab === 'active' && (
                                                <>
                                                    <button
                                                        onClick={() => setEditingGroup(group)}
                                                        className="w-full text-left px-4 py-3 text-xs font-bold text-primary hover:bg-slate-50 flex items-center gap-2 transition-colors"
                                                    >
                                                        <Pencil className="h-4 w-4 text-accent" /> Editar grupo
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(group.id, 'archived')}
                                                        className="w-full text-left px-4 py-3 text-xs font-bold text-primary hover:bg-slate-50 flex items-center gap-2 transition-colors"
                                                    >
                                                        <Archive className="h-4 w-4 text-blue-500" /> Arquivar grupo
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(group.id, 'deleted')}
                                                        className="w-full text-left px-4 py-3 text-xs font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" /> Mover para lixeira
                                                    </button>
                                                </>
                                            )}
                                            {activeTab === 'archived' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(group.id, 'active')}
                                                        className="w-full text-left px-4 py-3 text-xs font-bold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 transition-colors"
                                                    >
                                                        <RotateCcw className="h-4 w-4" /> Restaurar para ativos
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(group.id, 'deleted')}
                                                        className="w-full text-left px-4 py-3 text-xs font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" /> Mover para lixeira
                                                    </button>
                                                </>
                                            )}
                                            {activeTab === 'deleted' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(group.id, 'active')}
                                                        className="w-full text-left px-4 py-3 text-xs font-bold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 transition-colors"
                                                    >
                                                        <RotateCcw className="h-4 w-4" /> Restaurar grupo
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeletePermanently(group.id)}
                                                        className="w-full text-left px-4 py-3 text-xs font-bold text-rose-600 hover:bg-rose-100 flex items-center gap-2 transition-colors"
                                                    >
                                                        <XCircle className="h-4 w-4" /> Excluir permanentemente
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-primary mb-1">{group.name}</h3>
                            <p className="text-xs font-mono text-primary/40 mb-6 tracking-tight">CNPJ RAIZ: {group.cnpj_raiz || 'Não informado'}</p>

                            <div className="space-y-3 mb-8">
                                <div className="flex justify-between text-xs">
                                    <span className="text-primary/40 font-medium">Empresas</span>
                                    <span className="font-bold text-primary">{group.companies?.length || 0} Unidades</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-primary/40 font-medium">Status</span>
                                    <span className={`font-bold flex items-center gap-1 ${activeTab === 'active' ? 'text-green-600' :
                                        activeTab === 'archived' ? 'text-blue-500' : 'text-rose-500'
                                        }`}>
                                        <FileCheck className="h-3 w-3" />
                                        {activeTab === 'active' ? 'Ativo' : activeTab === 'archived' ? 'Arquivado' : 'Na Lixeira'}
                                    </span>
                                </div>
                            </div>

                            <Link
                                href={`/portal/grupos/${group.id}`}
                                className={`w-full py-4 text-center rounded-xl text-sm font-bold transition-all ${activeTab === 'deleted'
                                    ? 'bg-slate-100 text-primary/40 cursor-not-allowed'
                                    : 'bg-slate-50 hover:bg-primary hover:text-white text-primary'
                                    }`}
                                onClick={(e) => activeTab === 'deleted' && e.preventDefault()}
                            >
                                Detalhes do Grupo
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            {editingGroup && (
                <EditGroupModal
                    group={editingGroup}
                    onClose={() => setEditingGroup(null)}
                    onSuccess={() => {
                        setEditingGroup(null);
                        fetchGroups();
                    }}
                />
            )}
        </div>
    );
}
