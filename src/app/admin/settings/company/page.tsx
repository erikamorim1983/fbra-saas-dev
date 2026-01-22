import { Building2, Save, ArrowLeft, Globe, Hash, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function CompanySettingsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Link href="/admin/settings" className="inline-flex items-center gap-2 text-primary/50 hover:text-accent font-medium transition-colors group">
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Voltar para Configurações
            </Link>

            <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-3xl bg-accent flex items-center justify-center text-primary shadow-2xl shadow-accent/20">
                    <Building2 className="h-10 w-10" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold italic">Dados da <span className="text-accent underline decoration-accent/10">Empresa</span></h1>
                    <p className="text-primary/40 mt-1">Gerencie a identidade institucional e fiscal da N0T4X.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Informações Básicas */}
                <div className="glass p-10 rounded-[40px] border border-primary/5 space-y-8">
                    <h2 className="text-xl font-bold flex items-center gap-2 italic">
                        <Building2 className="h-5 w-5 text-accent" />
                        Identificação Jurídica
                    </h2>

                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Razão Social</label>
                            <div className="relative">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                                <input type="text" defaultValue="N0T4X INTELIGENCIA TRIBUTARIA LTDA" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-accent transition-all" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Nome Fantasia</label>
                            <input type="text" defaultValue="N0T4X" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-accent transition-all" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">CNPJ</label>
                            <div className="relative">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                                <input type="text" defaultValue="00.000.000/0001-00" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-accent transition-all" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Inscrição Estadual</label>
                            <input type="text" defaultValue="Isento" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-accent transition-all" />
                        </div>
                    </form>
                </div>

                {/* Contato e Localização */}
                <div className="glass p-10 rounded-[40px] border border-primary/5 space-y-8">
                    <h2 className="text-xl font-bold flex items-center gap-2 italic">
                        <MapPin className="h-5 w-5 text-accent" />
                        Contato e Localização
                    </h2>

                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">E-mail Institucional</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                                <input type="email" defaultValue="contato@n0t4x.com.br" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-accent transition-all" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Telefone</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/20" />
                                <input type="text" defaultValue="+55 (11) 4004-0000" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-accent transition-all" />
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-1">Endereço Completo</label>
                            <input type="text" defaultValue="Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-accent transition-all" />
                        </div>
                    </form>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <button className="px-10 py-5 bg-primary text-white font-bold rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/20 flex items-center gap-2">
                        <Save className="h-5 w-5 text-accent" />
                        Salvar Informações Culturais
                    </button>
                </div>
            </div>
        </div>
    );
}
