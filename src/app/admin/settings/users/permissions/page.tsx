'use client';

import { Shield, ArrowLeft, Check, X, Info, Save, Lock, LayoutDashboard, Calculator, Users, Building2, Settings } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const roles = [
    { id: 'admin', name: 'Administrador', description: 'Acesso total ao sistema e configurações.' },
    { id: 'consultant', name: 'Consultor', description: 'Gere múltiplos clientes e simulações.' },
    { id: 'client', name: 'Cliente', description: 'Acesso apenas aos seus próprios dados.' },
];

const modules = [
    {
        id: 'dashboard',
        name: 'Dashboard e Relatórios',
        icon: LayoutDashboard,
        permissions: ['view_global', 'view_own', 'export_pdf']
    },
    {
        id: 'simulations',
        name: 'Simulador Tributário',
        icon: Calculator,
        permissions: ['run_new', 'view_history', 'edit_parameters']
    },
    {
        id: 'clients',
        name: 'Gestão de Clientes',
        icon: Users,
        permissions: ['create_client', 'edit_client', 'view_all_clients']
    },
    {
        id: 'company',
        name: 'Dados da N0T4X',
        icon: Building2,
        permissions: ['edit_institutional', 'view_logs']
    },
    {
        id: 'settings',
        name: 'Configurações de Acesso',
        icon: Settings,
        permissions: ['manage_users', 'edit_roles']
    },
];

const permissionLabels: Record<string, string> = {
    view_global: 'Ver Global',
    view_own: 'Ver Próprios',
    export_pdf: 'Exportar PDF',
    run_new: 'Nova Simulação',
    view_history: 'Ver Histórico',
    edit_parameters: 'Editar Alíquotas',
    create_client: 'Cadastrar Cliente',
    edit_client: 'Editar Cliente',
    view_all_clients: 'Ver Todos Clientes',
    edit_institutional: 'Editar Empresa',
    view_logs: 'Ver Logs Segurança',
    manage_users: 'Gestor Usuários',
    edit_roles: 'Alterar Permissões'
};

// Initial state mapping permissions to roles
const initialMatrix: Record<string, Record<string, boolean>> = {
    admin: {
        view_global: true, view_own: true, export_pdf: true, run_new: true, view_history: true,
        edit_parameters: true, create_client: true, edit_client: true, view_all_clients: true,
        edit_institutional: true, view_logs: true, manage_users: true, edit_roles: true
    },
    consultant: {
        view_global: true, view_own: true, export_pdf: true, run_new: true, view_history: true,
        edit_parameters: true, create_client: true, edit_client: true, view_all_clients: true,
        edit_institutional: false, view_logs: false, manage_users: false, edit_roles: false
    },
    client: {
        view_global: false, view_own: true, export_pdf: true, run_new: true, view_history: true,
        edit_parameters: false, create_client: false, edit_client: false, view_all_clients: false,
        edit_institutional: false, view_logs: false, manage_users: false, edit_roles: false
    }
};

export default function PermissionsPage() {
    const [matrix, setMatrix] = useState(initialMatrix);

    const togglePermission = (roleId: string, permissionId: string) => {
        if (roleId === 'admin') return; // Admin always full access in this demo
        setMatrix(prev => ({
            ...prev,
            [roleId]: {
                ...prev[roleId],
                [permissionId]: !prev[roleId][permissionId]
            }
        }));
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Link href="/admin/settings/users" className="inline-flex items-center gap-2 text-primary/50 hover:text-accent font-medium transition-colors group">
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Voltar para Usuários
            </Link>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center text-accent shadow-2xl shadow-primary/20 ring-8 ring-accent/5">
                        <Lock className="h-10 w-10" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold italic">Matriz de <span className="text-accent underline decoration-accent/10">Acesso</span></h1>
                        <p className="text-primary/40 mt-1">Defina detalhadamente os privilégios de cada perfil no sistema.</p>
                    </div>
                </div>

                <button className="px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center gap-2 group">
                    <Save className="h-5 w-5 text-accent group-hover:rotate-12 transition-transform" />
                    Salvar Alterações Globais
                </button>
            </div>

            <div className="glass overflow-hidden rounded-[40px] border border-primary/5">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-primary/5">
                                <th className="p-8 text-left min-w-[300px]">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/30">Módulos e Recursos</span>
                                </th>
                                {roles.map(role => (
                                    <th key={role.id} className="p-8 text-center min-w-[150px]">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold italic">{role.name}</p>
                                            <p className="text-[10px] text-primary/40 uppercase tracking-widest">{role.id}</p>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5">
                            {modules.map((module) => (
                                <>
                                    <tr key={module.id} className="bg-slate-50/50">
                                        <td className="p-8 font-bold italic text-primary flex items-center gap-3">
                                            <module.icon className="h-5 w-5 text-accent" />
                                            {module.name}
                                        </td>
                                        {roles.map(role => <td key={`${module.id}-${role.id}`} className="p-8"></td>)}
                                    </tr>
                                    {module.permissions.map(perm => (
                                        <tr key={perm} className="group hover:bg-slate-50 transition-colors">
                                            <td className="p-8 pl-16 text-sm text-primary/60 border-r border-primary/5">
                                                {permissionLabels[perm]}
                                            </td>
                                            {roles.map(role => (
                                                <td key={`${perm}-${role.id}`} className="p-8 text-center border-r border-primary/5 last:border-r-0">
                                                    <button
                                                        onClick={() => togglePermission(role.id, perm)}
                                                        className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto transition-all ${matrix[role.id]?.[perm]
                                                                ? 'bg-emerald-50 text-emerald-600 shadow-inner'
                                                                : 'bg-rose-50 text-rose-300 opacity-40 grayscale group-hover:grayscale-0'
                                                            }`}
                                                    >
                                                        {matrix[role.id]?.[perm] ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                                                    </button>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Warning Card */}
            <div className="bg-amber-50 p-8 rounded-3xl border border-amber-100 flex gap-6 items-start">
                <div className="p-3 bg-amber-500 rounded-2xl text-white shadow-lg shadow-amber-500/20">
                    <Info className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                    <h4 className="font-bold text-amber-900 italic">Atenção Técnica</h4>
                    <p className="text-sm text-amber-800/70 leading-relaxed">
                        Alterações nesta matriz afetam o acesso a componentes de interface (Sidebars e Menus) e também as validações no lado do servidor (Server Actions). Certifique-se de que os papéis estejam sincronizados com as políticas de RLS do Supabase.
                    </p>
                </div>
            </div>
        </div>
    );
}
