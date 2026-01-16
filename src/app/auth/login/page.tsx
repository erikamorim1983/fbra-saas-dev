'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Mail, Lock, ChevronRight, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login attempt:', { email, password });
        alert('Integração com Supabase será habilitada em breve!');
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-primary-dark">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent/10 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-md">
                <Link href="/" className="inline-flex items-center gap-2 text-foreground/50 hover:text-accent font-medium mb-8 transition-colors group">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Voltar para Home
                </Link>

                <div className="glass p-10 rounded-3xl border-white/10 shadow-2xl">
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-accent/20">
                            <Shield className="text-primary h-8 w-8" />
                        </div>
                        <h1 className="text-3xl font-bold text-center">Acesse o <span className="text-accent underline decoration-2 underline-offset-4">Portal</span></h1>
                        <p className="text-foreground/50 text-sm mt-2">Área exclusiva para clientes FBRA</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-1">E-mail</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/20 group-focus-within:text-accent transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="exemplo@email.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent focus:bg-white/10 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 px-1">Senha</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/20 group-focus-within:text-accent transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent focus:bg-white/10 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Link href="#" className="text-xs text-accent hover:text-accent-light transition-colors font-semibold">Esqueceu a senha?</Link>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-accent hover:bg-accent-light text-primary font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-accent/10 flex items-center justify-center gap-2"
                        >
                            Entrar na Plataforma
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </form>

                    <p className="text-center text-sm text-foreground/40 mt-10">
                        Ainda não é cliente? <Link href="/#contato" className="text-accent font-semibold hover:underline">Entre em contato</Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
