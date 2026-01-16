import Link from 'next/link';
import { Shield, CreditCard, ChevronRight } from 'lucide-react';

export default function Header() {
    return (
        <header className="fixed top-0 w-full z-50 glass py-4">
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
                        <Shield className="text-primary h-6 w-6" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-foreground">
                        FBRA<span className="text-accent underline decoration-2 underline-offset-4">SaaS</span>
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <Link href="#servicos" className="text-sm font-medium hover:text-accent transition-colors">Serviços</Link>
                    <Link href="#sobre" className="text-sm font-medium hover:text-accent transition-colors">Sobre Nós</Link>
                    <Link href="#contato" className="text-sm font-medium hover:text-accent transition-colors">Contato</Link>
                    <Link
                        href="/auth/login"
                        className="px-6 py-2 bg-accent hover:bg-accent-light text-primary font-bold rounded-full transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                        Acessar Plataforma
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </nav>

                {/* Botão mobile */}
                <Link
                    href="/auth/login"
                    className="md:hidden px-4 py-2 bg-accent hover:bg-accent-light text-primary font-bold rounded-full transition-all hover:scale-105 active:scale-95 flex items-center gap-1 text-sm"
                >
                    Acessar Plataforma
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </div>
        </header>
    );
}
