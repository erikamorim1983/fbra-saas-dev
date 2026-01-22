import { Shield, Lock, Bell, ArrowLeft, History, Eye, Terminal, Key } from 'lucide-react';
import Link from 'next/link';

export default function SecuritySettingsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Link href="/admin/settings" className="inline-flex items-center gap-2 text-primary/50 hover:text-accent font-medium transition-colors group">
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Voltar para Configurações
            </Link>

            <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center text-primary shadow-2xl shadow-slate-200/50">
                    <Shield className="h-10 w-10 text-primary" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold italic">Segurança e <span className="text-accent underline decoration-accent/10">Auditoria</span></h1>
                    <p className="text-primary/40 mt-1">Conformidade ISO, logs de acesso e integridade de dados.</p>
                </div>
            </div>

            <div className="space-y-8">
                {/* Audit Logs */}
                <div className="glass p-10 rounded-[40px] border border-primary/5 space-y-8">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold flex items-center gap-2 italic">
                            <History className="h-5 w-5 text-accent" />
                            Logs de Atividade Recentes
                        </h2>
                        <button className="text-[10px] font-bold uppercase tracking-widest text-primary/40 hover:text-accent transition-colors">Exportar LOG Completo (.CSV)</button>
                    </div>

                    <div className="space-y-4">
                        {[
                            { action: 'Login Administrativo', user: 'Erik Amorim', time: '10:24 AM', ip: '177.34.12.98', status: 'Sucesso' },
                            { action: 'Alteração de Alíquota (Simulator)', user: 'Consultor Sênior', time: '09:15 AM', ip: '189.20.0.12', status: 'Aviso' },
                            { action: 'Criação de Novo Grupo', user: 'Erik Amorim', time: 'Ontem, 16:40', ip: '177.34.12.98', status: 'Sucesso' },
                        ].map((log, i) => (
                            <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between text-sm group hover:border-accent/20 transition-all cursor-crosshair">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${log.status === 'Sucesso' ? 'bg-emerald-500' : 'bg-amber-500 shadow-lg shadow-amber-500/50'}`} />
                                    <div>
                                        <p className="font-bold text-primary italic">{log.action}</p>
                                        <p className="text-[10px] text-primary/40">Usuário: {log.user} • IP: {log.ip}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase text-primary/30 tracking-widest">{log.time}</p>
                                    <Eye className="h-4 w-4 text-primary/10 group-hover:text-accent ml-auto mt-1" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Privacy & Keys */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass p-8 rounded-[40px] border border-primary/5 space-y-4 group hover:border-accent/20 transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-accent">
                            <Terminal className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold italic">Chaves de API (Webhooks)</h3>
                        <p className="text-xs text-primary/40 leading-relaxed">Gerencie integrações externas e webhooks para notificações em tempo real de novos simulados.</p>
                        <button className="flex items-center gap-2 text-primary font-bold text-xs hover:text-accent transition-colors">
                            Gerenciar Chaves <Lock className="h-3 w-3" />
                        </button>
                    </div>

                    <div className="glass p-8 rounded-[40px] border border-primary/5 space-y-4 group hover:border-accent/20 transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-primary">
                            <Key className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-bold italic">Autenticação (2FA)</h3>
                        <p className="text-xs text-primary/40 leading-relaxed">Configurações globais de Segundo Fator de Autenticação para toda a equipe administrativa da N0T4X.</p>
                        <button className="flex items-center gap-2 text-primary font-bold text-xs hover:text-accent transition-colors">
                            Configurar 2FA Global <Bell className="h-3 w-3" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
