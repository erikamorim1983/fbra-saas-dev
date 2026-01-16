import { Scale, Calculator, FileCheck, ShieldCheck, TrendingUp, Handshake } from 'lucide-react';

const services = [
    {
        title: 'Consultoria Contábil',
        description: 'Gestão completa da conformidade tributária, garantindo que sua empresa pague apenas o essencial dentro da lei.',
        icon: Calculator,
    },
    {
        title: 'Direito Tributário',
        description: 'Defesa administrativa e judicial com os melhores especialistas do mercado jurídico brasileiro.',
        icon: Scale,
    },
    {
        title: 'Planejamento Fiscal',
        description: 'Estratégias personalizadas para otimização de carga tributária e aumento de rentabilidade.',
        icon: TrendingUp,
    },
    {
        title: 'Recuperação de Créditos',
        description: 'Análise retroativa para identificar e recuperar impostos pagos indevidamente nos últimos 5 anos.',
        icon: ShieldCheck,
    },
    {
        title: 'Auditoria e Compliance',
        description: 'Verificação rigorosa de processos para mitigar riscos de fiscalização e autuações.',
        icon: FileCheck,
    },
    {
        title: 'BPO Financeiro',
        description: 'Terceirização estratégica de processos financeiros para que você foque no crescimento do seu negócio.',
        icon: Handshake,
    }
];

export default function Services() {
    return (
        <section id="servicos" className="py-24 bg-primary-dark/30">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Soluções Corporativas</h2>
                    <p className="text-foreground/60 max-w-2xl mx-auto">
                        Abordagem integrada combinando expertise contábil e jurídica para máxima segurança e eficiência.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="glass p-8 rounded-2xl hover:bg-white/10 transition-all hover:translate-y-[-8px] border-t-2 border-transparent hover:border-accent group"
                        >
                            <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent transition-colors">
                                <service.icon className="text-accent group-hover:text-primary h-8 w-8 transition-colors" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                            <p className="text-foreground/60 leading-relaxed">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
