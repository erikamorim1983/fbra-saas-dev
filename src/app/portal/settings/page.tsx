'use client';

import { useState, useEffect } from 'react';
import {
    Users,
    UserPlus,
    Mail,
    Shield,
    RefreshCcw,
    Trash2,
    CheckCircle2,
    AlertCircle,
    Building,
    Key
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function PortalSettingsPage() {
    const supabase = createClient();
    const [profile, setProfile] = useState<any>(null);
    const [team, setTeam] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [inviting, setInviting] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteName, setInviteName] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*, organizations(*)')
                    .eq('id', user.id)
                    .single();
                setProfile(profile);

                if (profile?.org_id) {
                    const { data: teamMembers } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('org_id', profile.org_id);
                    setTeam(teamMembers || []);
                }
            }
            setLoading(false);
        }
        loadData();
    }, []);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setInviting(true);
        setMessage({ type: '', text: '' });

        try {
            // Note: In a real app, this would call a server action that uses admin.inviteUserByEmail
            // and sets the org_id to the current user's org_id.
            // For now, let's show the UI and explain the logic.

            setMessage({
                type: 'success',
                text: `Convite enviado para ${inviteEmail}! (Simulação - requer Configuração de Servidor)`
            });
            setInviteEmail('');
            setInviteName('');
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao enviar convite.' });
        } finally {
            setInviting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <RefreshCcw className="h-8 w-8 animate-spin text-accent" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold italic text-primary">Configurações da <span className="text-accent underline decoration-accent/10">Organização</span></h1>
                    <p className="text-primary/40 mt-1">Gerencie sua equipe e vinculação de segurança.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Organization Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass p-8 rounded-[32px] border-primary/5 bg-primary text-white shadow-2xl relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-primary mb-6">
                                <Building className="h-6 w-6" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent/60">ID da Organização</p>
                            <p className="font-mono text-[10px] mb-4 opacity-40">{profile?.org_id || 'Não vinculado'}</p>
                            <h3 className="text-xl font-bold italic mb-1">{profile?.organizations?.name || 'Sua Empresa'}</h3>
                            <p className="text-xs text-white/40">Plano corporativo ativo</p>
                        </div>
                        <div className="absolute right-0 bottom-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-10 -mb-10" />
                    </div>

                    <div className="glass p-8 rounded-[32px] border-primary/5 space-y-4">
                        <h4 className="font-bold flex items-center gap-2">
                            <Key className="h-4 w-4 text-accent" />
                            Segurança Multi-Tenancy
                        </h4>
                        <p className="text-xs text-primary/40 leading-relaxed">
                            Todos os dados inseridos por membros desta organização são isolados por criptografia e RLS (Row Level Security). Nenhuma outra organização tem acesso aos seus cenários tributários.
                        </p>
                    </div>
                </div>

                {/* Team Management */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass p-8 rounded-[40px] border-primary/5 space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold italic flex items-center gap-3">
                                <Users className="h-6 w-6 text-accent" />
                                Gestão de Equipe Interna
                            </h3>
                        </div>

                        {/* Invite Form */}
                        <form onSubmit={handleInvite} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1 space-y-2 w-full">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Nome</label>
                                <input
                                    required
                                    value={inviteName}
                                    onChange={(e) => setInviteName(e.target.value)}
                                    type="text"
                                    placeholder="Nome do colaborador"
                                    className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-accent transition-all"
                                />
                            </div>
                            <div className="flex-[2] space-y-2 w-full">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">E-mail</label>
                                <input
                                    required
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    type="email"
                                    placeholder="colaborador@suaempresa.com"
                                    className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-accent transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={inviting}
                                className="px-6 py-3 bg-primary text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2"
                            >
                                {inviting ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4 text-accent" />}
                                Convidar
                            </button>
                        </form>

                        {message.text && (
                            <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in zoom-in ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                }`}>
                                {message.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                {message.text}
                            </div>
                        )}

                        <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/20 px-1">Membros Ativos</p>
                            <div className="divide-y divide-slate-100">
                                {team.map((member) => (
                                    <div key={member.id} className="py-4 flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-primary/40 font-bold group-hover:bg-primary group-hover:text-accent transition-all">
                                                {member.full_name?.substring(0, 2).toUpperCase() || '??'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">{member.full_name || 'Usuário Sem Nome'}</p>
                                                <p className="text-[10px] text-primary/30 uppercase font-black tracking-tight">{member.role === 'client' ? 'Administrador' : 'Analista'}</p>
                                            </div>
                                        </div>
                                        {member.id !== profile.id && (
                                            <button className="p-2 text-primary/10 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
