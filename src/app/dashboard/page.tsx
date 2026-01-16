import { Plus, Users, Building2, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const stats = [
    { label: 'Grupos sob Gestão', value: '12', icon: Users, color: 'text-blue-500' },
    { label: 'Empresas Ativas', value: '48', icon: Building2, color: 'text-accent' },
    { label: 'Cenários Analisados', value: '156', icon: TrendingUp, color: 'text-green-500' },
    { label: 'Pendências Técnicas', value: '03', icon: AlertCircle, color: 'text-red-500' },
];

export default function DashboardIndex() {
    return (
        <div className="space-y-10">
            {/* Welcome Banner */}
            <div className="glass p-8 rounded-3xl border-accent/20 flex justify-between items-center relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Visão Geral da Carteira</h1>
                    <p className="text-foreground/50">Gerencie seus grupos e analise cenários tributários com precisão estratégica.</p>
                </div>
                <Link
                    href="/dashboard/groups/new"
                    className="px-6 py-3 bg-accent text-primary font-bold rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 relative z-10"
                >
                    <Plus className="h-5 w-5" />
                    Novo Grupo Econômico
                </Link>
                <div className="absolute right-0 top-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-20 -mt-20" />
            </div>

            {/* Grid Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="glass p-6 rounded-2xl border-white/5 hover:border-accent/20 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stat.value}</div>
                        <div className="text-sm text-foreground/40 font-medium uppercase tracking-wider">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Recent Groups */}
            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <h2 className="text-2xl font-bold text-gradient">Últimos Grupos Acessados</h2>
                    <Link href="/dashboard/groups" className="text-accent text-sm font-semibold hover:underline">Ver todos</Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="glass p-6 rounded-2xl border-white/5 group hover:bg-white/5 transition-all cursor-pointer">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-accent ring-1 ring-white/10">
                                    <Users className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Holding JKL {i}</h3>
                                    <p className="text-xs text-foreground/40">4 Empresas no grupo</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs">
                                    <span className="text-foreground/40 text-sm">Status da Análise</span>
                                    <span className="text-green-500 font-bold">Concluído</span>
                                </div>
                                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-green-500 h-full w-[100%]" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
