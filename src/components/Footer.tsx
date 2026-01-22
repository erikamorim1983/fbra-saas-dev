import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer id="contato" className="py-20 bg-primary text-white border-t border-white/10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
                    <div className="lg:col-span-3">
                        <Link href="/" className="flex items-center group mb-6 w-fit">
                            <img
                                src="/logo_n0t4x.png"
                                alt="N0T4X Inteligência Tributária"
                                className="h-12 w-auto group-hover:scale-105 transition-transform"
                            />
                        </Link>
                        <p className="text-white/60 text-sm leading-relaxed mb-6">
                            Líder em planejamento tributário e conformidade fiscal no mercado brasileiro. Excelência técnica e tecnologia para o seu negócio.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-neon hover:text-primary transition-all text-white/50 hover:border-neon">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-neon hover:text-primary transition-all text-white/50 hover:border-neon">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-neon hover:text-primary transition-all text-white/50 hover:border-neon">
                                <Twitter className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="font-bold mb-6">Institucional</h4>
                        <ul className="space-y-4 text-sm text-white/60">
                            <li><Link href="#" className="hover:text-neon transition-colors">Sobre Nós</Link></li>
                            <li><Link href="#" className="hover:text-neon transition-colors">Nossa Equipe</Link></li>
                            <li><Link href="#" className="hover:text-neon transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-neon transition-colors">Carreiras</Link></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="font-bold mb-6">Acessos</h4>
                        <ul className="space-y-4 text-sm text-white/60">
                            <li><Link href="/auth/login" className="hover:text-neon transition-colors font-bold text-white/80">Portal do Cliente</Link></li>
                            <li><Link href="/auth/login?type=admin" className="hover:text-neon transition-colors opacity-40">Portal Administrativo</Link></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-3">
                        <h4 className="font-bold mb-6 uppercase tracking-widest text-xs opacity-70">Newsletter</h4>
                        <p className="text-white/40 text-xs mb-4">Inscreva-se para receber atualizações do mercado.</p>
                        <form className="space-y-3">
                            <input
                                type="text"
                                placeholder="Seu nome"
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-xs focus:outline-none focus:border-neon transition-all text-white"
                            />
                            <div className="space-y-3">
                                <input
                                    type="email"
                                    placeholder="Email corporativo"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-3 text-xs focus:outline-none focus:border-neon transition-all text-white"
                                />
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg text-xs transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]">
                                    Inscrever-se agora
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="font-bold mb-6">Contato</h4>
                        <ul className="space-y-4 text-sm text-white/60">
                            <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                                <span className="w-1.5 h-1.5 bg-neon rounded-full" />
                                contato@n0t4x.com.br
                            </li>
                            <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                                <span className="w-1.5 h-1.5 bg-neon rounded-full" />
                                +55 (11) 4004-0000
                            </li>
                            <li className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                                <span className="w-1.5 h-1.5 bg-neon rounded-full" />
                                São Paulo, SP
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col items-center md:items-start gap-1">
                        <p className="text-xs text-white/40">
                            © 2026 N0T4X Planejamento Tributário. Todos os direitos reservados.
                        </p>
                        <p className="text-[10px] text-white/20">
                            Desenvolvido por <a href="https://www.eafinancialadvisory.com/pt/companies/ea-tech-solutions" target="_blank" rel="noopener noreferrer" className="hover:text-neon transition-colors">EA Tech Solutions</a>
                        </p>
                    </div>
                    <div className="flex gap-8 text-xs text-white/40">
                        <Link href="#" className="hover:text-white transition-colors">Termos de Uso</Link>
                        <Link href="#" className="hover:text-white transition-colors">Privacidade</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
