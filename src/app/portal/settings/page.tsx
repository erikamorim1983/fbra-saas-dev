'use client';

import React, { useState, useEffect } from 'react';
import {
    Building2,
    Globe,
    MapPin,
    Phone,
    Hash,
    Camera,
    Save,
    CreditCard,
    ShieldCheck,
    CheckCircle2,
    RefreshCcw,
    Sparkles,
    Layout,
    Users,
    Plus,
    Trash2,
    Mail,
    UserCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { getOrganization, updateOrganization, getTeamMembers, addTeamMember } from './actions';

export default function SettingsPage() {
    const supabase = createClient();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'branding' | 'team'>('branding');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [addingUser, setAddingUser] = useState(false);
    const [org, setOrg] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [team, setTeam] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        cnpj: '',
        website: '',
        phone: '',
        address: '',
        logo_url: ''
    });

    const [newUser, setNewUser] = useState({
        email: '',
        fullName: '',
        role: 'client'
    });

    async function loadData() {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            setProfile(profileData);

            if (profileData?.org_id) {
                const orgData = await getOrganization(profileData.org_id);
                setOrg(orgData);
                setFormData({
                    name: orgData.name || '',
                    cnpj: orgData.cnpj || '',
                    website: orgData.website || '',
                    phone: orgData.phone || '',
                    address: orgData.address || '',
                    logo_url: orgData.logo_url || ''
                });

                const teamData = await getTeamMembers(profileData.org_id);
                setTeam(teamData);
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [supabase]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !org) return;

        setSaving(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${org.id}-${Math.random()}.${fileExt}`;
            const filePath = `logos/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('logos')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('logos')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, logo_url: publicUrl }));
            await updateOrganization(org.id, { ...formData, logo_url: publicUrl });
            alert('Logo carregada com sucesso!');
            router.refresh(); // Refresh layout to show new logo
        } catch (error: any) {
            alert('Erro no upload: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile?.is_org_admin) return alert('Apenas o usuário MASTER pode alterar as configurações da organização.');

        setSaving(true);
        try {
            await updateOrganization(org.id, formData);
            alert('Configurações atualizadas com sucesso!');
            router.refresh(); // Refresh to update brand colors/names in layout
        } catch (error: any) {
            console.error('Error updating organization:', error);
            alert('Erro ao salvar: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddingUser(true);
        try {
            await addTeamMember(org.id, newUser.email, newUser.fullName, newUser.role);
            setNewUser({ email: '', fullName: '', role: 'client' });
            loadData();
            alert('Usuário convidado com sucesso!');
        } catch (error: any) {
            alert('Erro ao adicionar: ' + error.message);
        } finally {
            setAddingUser(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4 opacity-50">
                <RefreshCcw className="h-8 w-8 animate-spin text-accent" />
                <p className="font-bold text-sm text-primary uppercase tracking-widest leading-relaxed">Carregando Preferências...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
            {/* Header com Tabs */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-primary flex items-center gap-4 italic leading-tight">
                        Configurações <span className="text-accent underline decoration-accent/10 italic">do Portal</span>
                    </h1>
                    <p className="text-primary/40 font-bold uppercase tracking-[0.2em] text-[10px]">Portal administrativo da sua consultoria</p>
                </div>

                <div className="flex p-1.5 glass rounded-2xl border-white/10 shadow-xl bg-primary/5">
                    <button
                        onClick={() => setActiveTab('branding')}
                        className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'branding' ? 'bg-primary text-accent shadow-lg' : 'text-primary/40 hover:text-primary hover:bg-primary/5'}`}
                    >
                        <Layout className="h-4 w-4" /> Branding & Dados
                    </button>
                    <button
                        onClick={() => setActiveTab('team')}
                        className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'team' ? 'bg-primary text-accent shadow-lg' : 'text-primary/40 hover:text-primary hover:bg-primary/5'}`}
                    >
                        <Users className="h-4 w-4" /> Gestão de Equipe
                    </button>
                </div>
            </div>

            {activeTab === 'branding' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Coluna de Branding à Esquerda */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Sparkles className="h-20 w-20 text-accent rotate-12" />
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-widest text-primary/40 flex items-center gap-2">
                                    <Camera className="h-3 w-3 text-accent" /> Logotipo Oficial
                                </h3>
                            </div>

                            <div className="relative aspect-square w-full bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center group/logo hover:border-accent transition-all overflow-hidden shadow-inner">
                                {formData.logo_url ? (
                                    <img src={formData.logo_url} alt="Logo" className="w-full h-full object-contain p-8 animate-in zoom-in duration-500" />
                                ) : (
                                    <div className="text-center space-y-3">
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-slate-100 text-slate-300">
                                            <Camera className="h-8 w-8" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inserir Logo</p>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm opacity-0 group-hover/logo:opacity-100 transition-all flex items-center justify-center">
                                    <label className="cursor-pointer bg-accent text-primary px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl active:scale-95 transition-all">
                                        Substituir Imagem
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary/30 mb-2 block">Link da Logo (URL)</label>
                                <input
                                    type="text"
                                    placeholder="Ex: https://img.com/logo.png"
                                    value={formData.logo_url}
                                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-6 text-xs font-mono text-primary focus:outline-none focus:border-accent transition-all"
                                />
                            </div>
                        </div>

                        {/* Subscription Info */}
                        <div className="bg-primary p-10 rounded-[2.5rem] shadow-2xl shadow-primary/20 space-y-8 relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                <ShieldCheck className="h-40 w-40 text-white" />
                            </div>
                            <div className="space-y-1 relative">
                                <h3 className="text-white font-black text-2xl italic leading-tight">Plano Intelligence</h3>
                                <p className="text-accent text-[10px] font-black uppercase tracking-widest">Status da Assinatura Corporativa</p>
                            </div>

                            <div className="bg-white/5 rounded-2xl p-6 border border-white/5 backdrop-blur-md relative">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Controle de Acesso</span>
                                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                        <CheckCircle2 className="h-3 w-3" /> Ativo
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black text-white italic">{org?.plan_type || 'Basic'}</span>
                                    <span className="text-white/30 text-[10px] font-black uppercase tracking-widest">Licença Enterprise</span>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-white/10 hover:bg-accent hover:text-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 relative overflow-hidden group">
                                <CreditCard className="h-4 w-4" /> Gerenciar Assinatura
                            </button>
                        </div>
                    </div>

                    {/* Formulário de Dados à Direita */}
                    <div className="lg:col-span-8">
                        <form onSubmit={handleSubmit} className="bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 px-1 flex items-center gap-2">
                                        <Building2 className="h-3 w-3 text-accent" /> Nome Fantasia da Consultoria
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-8 text-primary focus:outline-none focus:border-accent transition-all font-black text-xl italic placeholder:opacity-20 shadow-sm"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 px-1 flex items-center gap-2">
                                        <Hash className="h-3 w-3 text-accent" /> CNPJ Documental
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.cnpj}
                                        onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                                        placeholder="00.000.000/0000-00"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-primary focus:outline-none focus:border-accent transition-all font-mono font-bold shadow-sm"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 px-1 flex items-center gap-2">
                                        <Phone className="h-3 w-3 text-accent" /> Telefone de Contato
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="(00) 00000-0000"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-primary focus:outline-none focus:border-accent transition-all font-bold shadow-sm"
                                    />
                                </div>

                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 px-1 flex items-center gap-2">
                                        <Globe className="h-3 w-3 text-accent" /> Website Corporativo
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        placeholder="https://suaempresa.com.br"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-primary focus:outline-none focus:border-accent transition-all font-bold text-blue-600 underline decoration-blue-200/50 shadow-sm"
                                    />
                                </div>

                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 px-1 flex items-center gap-2">
                                        <MapPin className="h-3 w-3 text-accent" /> Endereço Comercial
                                    </label>
                                    <textarea
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        rows={4}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-primary focus:outline-none focus:border-accent transition-all font-medium resize-none shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-8 border-t border-slate-50">
                                {!profile?.is_org_admin && (
                                    <div className="flex items-center gap-3 text-red-500 bg-red-50 px-4 py-2 rounded-xl">
                                        <ShieldCheck className="h-4 w-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Bloqueado: Apenas usuário MASTER</span>
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    disabled={saving || !profile?.is_org_admin}
                                    className={`px-12 py-5 bg-primary text-accent font-black uppercase tracking-[0.3em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/20 flex items-center gap-4 text-xs ml-auto disabled:opacity-50 disabled:grayscale disabled:hover:scale-100`}
                                >
                                    {saving ? <RefreshCcw className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                                    {saving ? 'Gravando...' : 'Salvar Alterações'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Lista de Equipe */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
                            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary/40 flex items-center gap-2">
                                    <Users className="h-4 w-4 text-accent" /> Colaboradores Ativos ({team.length})
                                </h3>
                            </div>

                            <div className="divide-y divide-slate-50">
                                {team.map((member) => (
                                    <div key={member.id} className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-all group">
                                        <div className="flex items-center gap-6">
                                            <div className="h-14 w-14 rounded-2xl bg-primary text-accent flex items-center justify-center font-black text-lg shadow-lg group-hover:scale-110 transition-transform">
                                                {member.full_name?.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className="font-black text-primary italic leading-none">{member.full_name}</h4>
                                                    {member.is_org_admin && (
                                                        <span className="px-3 py-1 bg-accent/10 text-accent border border-accent/20 rounded-full text-[8px] font-black uppercase tracking-widest italic">USUÁRIO MASTER</span>
                                                    )}
                                                </div>
                                                <p className="text-xs font-mono text-primary/40">{member.role === 'admin' ? 'Administrador' : member.role === 'consultant' ? 'Consultor' : 'Cliente'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-right hidden md:block">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/20 mb-1">Desde</p>
                                                <p className="text-xs font-bold text-primary/60">{new Date(member.created_at).toLocaleDateString('pt-BR')}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Adicionar Membro */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-10 sticky top-28">
                            <div className="space-y-2">
                                <h3 className="text-primary font-black italic text-xl">Novo Membro</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">Inclusão de Colaboradores</p>
                            </div>

                            {!profile?.is_org_admin ? (
                                <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center gap-4">
                                    <ShieldCheck className="h-10 w-10 text-slate-200" />
                                    <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-tighter">Somente o usuário MASTER pode adicionar novos membros à equipe.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleAddMember} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Nome Completo</label>
                                        <input
                                            required
                                            type="text"
                                            value={newUser.fullName}
                                            onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-primary focus:outline-none focus:border-accent transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">E-mail Profissional</label>
                                        <input
                                            required
                                            type="email"
                                            value={newUser.email}
                                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-primary focus:outline-none focus:border-accent transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Função</label>
                                        <select
                                            value={newUser.role}
                                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-primary focus:outline-none focus:border-accent transition-all appearance-none"
                                        >
                                            <option value="client">Analista</option>
                                            <option value="consultant">Consultor</option>
                                        </select>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={addingUser}
                                        className="w-full py-5 bg-accent text-primary font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3 text-xs"
                                    >
                                        {addingUser ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                        {addingUser ? 'Criando...' : 'Adicionar Membro'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
