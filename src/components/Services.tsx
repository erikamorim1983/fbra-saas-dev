import { Scale, Calculator, FileCheck, ShieldCheck, TrendingUp, Handshake, ArrowRight, Building2 } from 'lucide-react';
import Link from 'next/link';

const services = [
    {
        title: 'Planejamento Tributário',
        description: 'Análise estratégica dos 4 regimes tributários (Simples, Presumido, Lucro Real Cumulativo e Não-Cumulativo) para identificar a melhor opção para sua empresa.',
        icon: Calculator,
        highlight: 'Até 40% de economia',
    },
    {
        title: 'Direito Tributário',
        description: 'Defesa administrativa e judicial especializada. Representação em processos tributários e consultoria preventiva.',
        icon: Scale,
        highlight: '+500 casos resolvidos',
    },
    {
        title: 'Recuperação de Créditos',
        description: 'Análise retroativa dos últimos 5 anos para identificar impostos pagos indevidamente. Recuperação administrativa ou judicial.',
        icon: ShieldCheck,
        highlight: '+R$ 2B recuperados',
    },
    {
        title: 'Gestão de Holdings',
        description: 'Estruturação de grupos econômicos e holdings para otimização fiscal e proteção patrimonial.',
        icon: Building2,
        highlight: 'Planejamento sucessório',
    },
    {
        title: 'Auditoria Fiscal',
        description: 'Revisão completa de processos tributários para identificar riscos, inconsistências e oportunidades de melhoria.',
        icon: FileCheck,
        highlight: '100% compliance',
    },
    {
        title: 'BPO Financeiro',
        description: 'Terceirização estratégica da gestão financeira: contas a pagar, receber, conciliação e relatórios gerenciais.',
        icon: Handshake,
        highlight: 'Foco no seu negócio',
    }
];

export default function Services() {
    return (
        <section id="servicos" className="py-24 bg-primary-dark/30">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-xs font-bold uppercase tracking-widest text-accent mb-4 block">Nossos Serviços</span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Soluções <span className="text-gradient">Corporativas</span></h2>
                    <p className="text-foreground/60 max-w-2xl mx-auto text-lg">
                        Abordagem integrada combinando expertise contábil e jurídica para máxima segurança e eficiência fiscal.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="glass p-8 rounded-2xl hover:bg-white/10 transition-all hover:translate-y-[-8px] border-t-2 border-transparent hover:border-accent group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center group-hover:bg-accent transition-colors">
                                    <service.icon className="text-accent group-hover:text-primary h-8 w-8 transition-colors" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wide text-accent bg-accent/10 px-3 py-1 rounded-full">
                                    {service.highlight}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                            <p className="text-foreground/60 leading-relaxed text-sm">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        href="/auth/login"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-accent hover:bg-accent-light text-primary font-bold rounded-xl transition-all hover:translate-y-[-2px] shadow-lg shadow-accent/20"
                    >
                        Acessar Plataforma de Simulação
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
