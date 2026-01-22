'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Lock, ChevronRight, ArrowLeft, Loader2, AlertCircle, CheckCircle2, User } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function SignUpPage() {
    const router = useRouter();
    const supabase = createClient();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<{ type: 'error' | 'success', message: string } | null>(null);

    const showNotify = (type: 'error' | 'success', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 5000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    }
                }
            });

            if (error) throw error;

            if (data.session) {
                showNotify('success', 'Conta criada com sucesso! Acessando...');
                setTimeout(() => {
                    router.push('/portal/simulator');
                    router.refresh();
                }, 1500);
            } else {
                showNotify('success', 'Cadastro realizado! Verifique seu e-mail para confirmar a conta.');
            }

        } catch (error: any) {
            console.error('Sign up error:', error);
            showNotify('error', error.message || 'Erro ao realizar cadastro.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-primary-dark">
            {/* Notification Toast */}
            {notification && (
                <div className={`fixed top-8 right-8 z-[100] animate-in slide-in-from-right-8 duration-500`}>
                    <div className={`flex items-center gap-4 p-5 rounded-2xl border ${notification.type === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        } backdrop-blur-xl shadow-2xl`}>
                        {notification.type === 'success' ? <CheckCircle2 className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
                        <p className="text-sm font-bold tracking-tight">{notification.message}</p>
                    </div>
                </div>
            )}

            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent/10 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-md">
                <Link href="/auth/login" className="inline-flex items-center gap-2 text-foreground/50 hover:text-accent font-medium mb-8 transition-colors group">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Voltar para Login
                </Link>

                <div className="glass p-10 rounded-3xl border-white/10 shadow-2xl">
                    <div className="flex flex-col items-center mb-10 text-primary">
                        <img src="/logo_n0t4x.png" alt="N0T4X" className="h-16 w-auto mb-6" />
                        <h1 className="text-3xl font-black text-center text-primary">Criar <span className="text-accent underline decoration-2 underline-offset-4">Conta</span></h1>
                        <p className="text-slate-500 text-sm mt-2 text-center">Junte-se à plataforma de inteligência tributária da N0T4X</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-[#0F172A] px-1 opacity-80">Nome Completo</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#0F172A]/60 group-focus-within:text-accent transition-colors" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Seu nome"
                                    className="w-full bg-white/10 border border-[#0F172A]/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent focus:bg-white/20 transition-all text-[#0F172A] font-semibold placeholder:text-[#0F172A]/30"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-[#0F172A] px-1 opacity-80">E-mail Corporativo</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#0F172A]/60 group-focus-within:text-accent transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="exemplo@n0t4x.com.br"
                                    className="w-full bg-white/10 border border-[#0F172A]/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent focus:bg-white/20 transition-all text-[#0F172A] font-semibold placeholder:text-[#0F172A]/30"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-[#0F172A] px-1 opacity-80">Senha</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#0F172A]/60 group-focus-within:text-accent transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/10 border border-[#0F172A]/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent focus:bg-white/20 transition-all text-[#0F172A] font-bold placeholder:text-[#0F172A]/30"
                                    required
                                    minLength={6}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-accent hover:bg-accent-light text-primary font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-accent/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Criando conta...
                                </>
                            ) : (
                                <>
                                    Cadastrar no Portal
                                    <ChevronRight className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-foreground/40 mt-10">
                        Já possui uma conta? <Link href="/auth/login" className="text-accent font-semibold hover:underline">Fazer Login</Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
