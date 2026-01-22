import Link from 'next/link';
import { Shield, CreditCard, ChevronRight } from 'lucide-react';

export default function Header() {
    return (
        <header className="fixed top-0 w-full z-50 bg-primary/95 backdrop-blur-md border-b border-white/5 py-4">
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link href="/" className="flex items-center group">
                    <img
                        src="/logo_n0t4x.png"
                        alt="N0T4X Inteligência Tributária"
                        className="h-14 w-auto group-hover:scale-105 transition-transform"
                    />
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <Link href="#servicos" className="text-sm font-medium text-white/70 hover:text-accent transition-colors">Serviços</Link>
                    <Link href="#sobre" className="text-sm font-medium text-white/70 hover:text-accent transition-colors">Sobre Nós</Link>
                    <Link href="#contato" className="text-sm font-medium text-white/70 hover:text-accent transition-colors">Contato</Link>
                    <Link
                        href="/auth/login"
                        className="px-6 py-2 bg-white text-primary font-bold rounded-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                        Portal do Cliente
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
