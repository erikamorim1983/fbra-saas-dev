'use client';

import React, { useState } from 'react';
import {
    ArrowLeft,
    Building2,
    Save,
    Info,
    Hash,
    Globe,
    Briefcase,
    RefreshCcw
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

const brazilianStates = [
    "Acre (AC)", "Alagoas (AL)", "Amapá (AP)", "Amazonas (AM)", "Bahia (BA)", "Ceará (CE)",
    "Distrito Federal (DF)", "Espírito Santo (ES)", "Goiás (GO)", "Maranhão (MA)",
    "Mato Grosso (MT)", "Mato Grosso do Sul (MS)", "Minas Gerais (MG)", "Pará (PA)",
    "Paraíba (PB)", "Paraná (PR)", "Pernambuco (PE)", "Piauí (PI)", "Rio de Janeiro (RJ)",
    "Rio Grande do Norte (RN)", "Rio Grande do Sul (RS)", "Rondônia (RO)", "Roraima (RR)",
    "Santa Catarina (SC)", "São Paulo (SP)", "Sergipe (SE)", "Tocantins (TO)"
];

export default function NewGroupPage() {
    const supabase = createClient();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        cnpj_raiz: '',
        region: 'São Paulo (SP)',
        initial_companies: '1'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase
                .from('company_groups')
                .insert({
                    name: formData.name,
                    cnpj_raiz: formData.cnpj_raiz || null,
                } as any)
                .select()
                .single();

            if (error) throw error;

            const group = data as any;
            router.push(`/portal/groups/${group.id}`);
        } catch (error) {
            console.error('Error creating group:', error);
            alert('Erro ao criar grupo. Verifique os dados.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Link href="/portal/groups" className="inline-flex items-center gap-2 text-primary/50 hover:text-accent font-medium transition-colors group">
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Voltar para Grupos
            </Link>

            <div className="space-y-2">
                <h1 className="text-4xl font-bold text-primary">Cadastrar Novo <span className="text-accent underline decoration-accent/20">Grupo Econômico</span></h1>
                <p className="text-primary/50">Defina a estrutura de holding ou grupo empresarial para iniciar as análises.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Nome do Grupo */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 flex items-center gap-2">
                            <Building2 className="h-3 w-3" />
                            Nome Social do Grupo
                        </label>
                        <input
                            required
                            type="text"
                            placeholder="Ex: Holding Brasil S.A."
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all font-medium"
                        />
                    </div>

                    {/* CNPJ Raiz */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 flex items-center gap-2">
                            <Hash className="h-3 w-3" />
                            CNPJ Raiz (Opcional)
                        </label>
                        <input
                            type="text"
                            placeholder="00.000.000"
                            value={formData.cnpj_raiz}
                            onChange={(e) => setFormData({ ...formData, cnpj_raiz: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all font-mono"
                        />
                    </div>

                    {/* Região Principal */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 flex items-center gap-2">
                            <Globe className="h-3 w-3" />
                            Região Principal
                        </label>
                        <select
                            value={formData.region}
                            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all font-medium appearance-none"
                        >
                            {brazilianStates.map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                    </div>

                    {/* Número de Empresas */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-primary/40 flex items-center gap-2">
                            <Briefcase className="h-3 w-3" />
                            Quantas empresas iniciais?
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={formData.initial_companies}
                            onChange={(e) => setFormData({ ...formData, initial_companies: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all font-medium"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto px-10 py-5 bg-accent text-primary font-bold rounded-2xl hover:scale-105 transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3 group"
                >
                    {loading ? <RefreshCcw className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5 group-hover:rotate-12 transition-transform" />}
                    {loading ? 'Criando Grupo...' : 'Salvar e Configurar Empresas'}
                </button>
            </form>

            {/* Tip Card */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex gap-4 items-start">
                <div className="bg-primary/5 p-3 rounded-xl text-primary">
                    <Info className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-primary/60 italic text-sm leading-relaxed">
                        "Ao criar um grupo, você poderá gerenciar múltiplas unidades e analisar o impacto tributário consolidado, sem a necessidade de um CNPJ único para o grupo."
                    </p>
                </div>
            </div>
        </div>
    );
}
