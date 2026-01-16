import { ArrowRight, BarChart3, Gavel, Landmark } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/40 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
                        <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                        <span className="text-xs font-semibold tracking-widest uppercase text-accent-light">
                            Planejamento Tributário Estratégico
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                        Excelência em Gestão <br />
                        <span className="text-gradient">Contábil e Jurídica</span>
                    </h1>

                    <p className="text-lg md:text-xl text-foreground/70 mb-12 max-w-2xl mx-auto">
                        Transformamos a complexidade tributária brasileira em vantagem competitiva para sua empresa através de análise técnica rigorosa e tecnologia de ponta.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
                        <Link
                            href="#servicos"
                            className="w-full sm:w-auto px-8 py-4 bg-accent hover:bg-accent-light text-primary font-bold rounded-xl transition-all hover:translate-y-[-2px] shadow-lg shadow-accent/20 group flex items-center justify-center gap-2"
                        >
                            Conheça nossos serviços
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/auth/login"
                            className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-primary/20 hover:border-accent text-primary font-bold rounded-xl transition-all hover:translate-y-[-2px] shadow-lg flex items-center justify-center gap-2"
                        >
                            Acessar Plataforma
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>

                    {/* Stats/Badges */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="glass p-6 rounded-2xl flex flex-col items-center gap-4 hover:border-accent/40 transition-colors">
                            <Landmark className="h-10 w-10 text-accent" />
                            <div>
                                <h3 className="text-xl font-bold">+R$ 2B</h3>
                                <p className="text-sm text-foreground/50">Recuperados em Créditos</p>
                            </div>
                        </div>
                        <div className="glass p-6 rounded-2xl flex flex-col items-center gap-4 hover:border-accent/40 transition-colors">
                            <BarChart3 className="h-10 w-10 text-accent" />
                            <div>
                                <h3 className="text-xl font-bold">100%</h3>
                                <p className="text-sm text-foreground/50">Conformidade Legal</p>
                            </div>
                        </div>
                        <div className="glass p-6 rounded-2xl flex flex-col items-center gap-4 hover:border-accent/40 transition-colors">
                            <Gavel className="h-10 w-10 text-accent" />
                            <div>
                                <h3 className="text-xl font-bold">+500</h3>
                                <p className="text-sm text-foreground/50">Empresas Atendidas</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
