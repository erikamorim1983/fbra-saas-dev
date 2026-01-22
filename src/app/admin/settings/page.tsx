import { Shield, Building2, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const settingsCards = [
    {
        title: 'Usuários e Perfis',
        description: 'Gestão completa de acessos, convites e permissões da equipe.',
        icon: Users,
        href: '/admin/settings/users',
        color: 'bg-primary',
        iconColor: 'text-accent',
        borderColor: 'hover:border-accent/20'
    },
    {
        title: 'Dados da Empresa',
        description: 'Informações institucionais, fiscais e configurações da marca N0T4X.',
        icon: Building2,
        href: '/admin/settings/company',
        color: 'bg-accent',
        iconColor: 'text-primary',
        borderColor: 'hover:border-accent/20'
    },
    {
        title: 'Segurança e Auditoria',
        description: 'Logs detalhados de acesso, auditoria ISO e configurações críticas.',
        icon: Shield,
        href: '/admin/settings/security',
        color: 'bg-slate-100',
        iconColor: 'text-primary',
        borderColor: 'hover:border-primary/20'
    }
];

export default function SettingsHubPage() {
    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div>
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/30 mb-2">Painel de Controle</h2>
                <h1 className="text-4xl font-bold italic">Configurações <span className="text-accent underline decoration-accent/10">Globais</span></h1>
                <p className="text-primary/40 mt-2">Central de gestão administrativa do ecossistema N0T4X.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {settingsCards.map((card) => (
                    <Link
                        key={card.href}
                        href={card.href}
                        className={`glass p-8 rounded-[40px] border border-primary/5 ${card.borderColor} transition-all group hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5 flex flex-col justify-between min-h-[320px]`}
                    >
                        <div className="space-y-6">
                            <div className={`w-16 h-16 rounded-2xl ${card.color} flex items-center justify-center ${card.iconColor} ring-8 ring-slate-50 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                                <card.icon className="h-8 w-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold leading-tight mb-2 italic">{card.title}</h2>
                                <p className="text-sm text-primary/40 leading-relaxed">{card.description}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-primary font-bold text-sm group-hover:text-accent transition-colors pt-6">
                            Configurar agora
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
