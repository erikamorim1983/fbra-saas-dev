import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer id="contato" className="py-20 border-t border-white/10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <span className="text-2xl font-bold tracking-tight text-foreground">
                                FBRA<span className="text-accent">SaaS</span>
                            </span>
                        </Link>
                        <p className="text-foreground/50 text-sm leading-relaxed mb-6">
                            Líder em planejamento tributário e conformidade fiscal no mercado brasileiro. Excelência técnica e tecnologia para o seu negócio.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="w-10 h-10 glass rounded-lg flex items-center justify-center hover:bg-accent hover:text-primary transition-all">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 glass rounded-lg flex items-center justify-center hover:bg-accent hover:text-primary transition-all">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 glass rounded-lg flex items-center justify-center hover:bg-accent hover:text-primary transition-all">
                                <Twitter className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Serviços</h4>
                        <ul className="space-y-4 text-sm text-foreground/60">
                            <li><Link href="#" className="hover:text-accent transition-colors">Planejamento Tributário</Link></li>
                            <li><Link href="#" className="hover:text-accent transition-colors">Contabilidade Consultiva</Link></li>
                            <li><Link href="#" className="hover:text-accent transition-colors">Direito Corporativo</Link></li>
                            <li><Link href="#" className="hover:text-accent transition-colors">Recuperação Fiscal</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Institucional</h4>
                        <ul className="space-y-4 text-sm text-foreground/60">
                            <li><Link href="#" className="hover:text-accent transition-colors">Sobre Nós</Link></li>
                            <li><Link href="#" className="hover:text-accent transition-colors">Nossa Equipe</Link></li>
                            <li><Link href="#" className="hover:text-accent transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-accent transition-colors">Carreiras</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Contato</h4>
                        <ul className="space-y-4 text-sm text-foreground/60">
                            <li>contato@fbra.com.br</li>
                            <li>+55 (11) 4004-0000</li>
                            <li>Av. Paulista, 1000 - São Paulo, SP</li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:row justify-between items-center gap-4">
                    <p className="text-xs text-foreground/40">
                        © 2024 FBRA Planejamento Tributário. Todos os direitos reservados.
                    </p>
                    <div className="flex gap-8 text-xs text-foreground/40">
                        <Link href="#" className="hover:text-foreground transition-colors">Termos de Uso</Link>
                        <Link href="#" className="hover:text-foreground transition-colors">Privacidade</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
