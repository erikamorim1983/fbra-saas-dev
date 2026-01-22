'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, Mail, Lock, ChevronRight, ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function LoginPage() {
    const supabase = createClient();
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get('type');

    const isAdminMode = type === 'admin';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<{ type: 'error' | 'success', message: string } | null>(null);

    // Carregar e-mail salvo se existir
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedEmail = localStorage.getItem('remembered_email');
            if (savedEmail) {
                setEmail(savedEmail);
                setRememberMe(true);
            }
        }
    }, []);

    // Check for error messages from middleware (like blocked account)
    useEffect(() => {
        const error = searchParams.get('error');
        if (error) {
            showNotify('error', error);
        }
    }, [searchParams]);

    const showNotify = (type: 'error' | 'success', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 5000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Lógica de Lembrar-me
            if (rememberMe) {
                localStorage.setItem('remembered_email', email);
            } else {
                localStorage.removeItem('remembered_email');
            }

            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            // Buscar perfil para saber o role
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', authData.user.id)
                .single();

            if (profileError) {
                console.error('Erro ao buscar perfil:', profileError);

                // Se o erro for "não encontrado" (PGRST116), significa que o trigger não criou o profile
                if (profileError.code === 'PGRST116') {
                    showNotify('error', 'Usuário autenticado, mas perfil não encontrado. Por favor, verifique se o profile foi criado no banco de dados.');
                } else {
                    showNotify('error', 'Erro ao validar perfil: ' + (profileError.message || 'Erro desconhecido'));
                }
                setLoading(false);
                return;
            }

            // Se for login admin e o usuário não for admin/consultant, barrar
            if (isAdminMode && profile.role === 'client') {
                await supabase.auth.signOut();
                throw new Error('Acesso restrito à equipe administrativa.');
            }

            showNotify('success', 'Acesso autorizado!');

            setTimeout(() => {
                if (isAdminMode) {
                    router.push('/admin');
                } else {
                    router.push('/portal/simulator');
                }
                router.refresh();
            }, 800);

        } catch (error: any) {
            console.error('Login error:', error);
            showNotify('error', error.message || 'Erro ao realizar login. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={`min-h-screen flex items-center justify-center p-6 relative overflow-hidden ${isAdminMode ? 'bg-[#041018]' : 'bg-slate-50'}`}>
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
            <div className={`absolute top-0 left-0 w-full h-full -z-10 ${isAdminMode ? 'opacity-30' : 'opacity-10'}`}>
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent/20 rounded-full blur-[120px]`} />
            </div>

            <div className="w-full max-w-md">
                <Link href="/" className={`inline-flex items-center gap-2 font-medium mb-8 transition-colors group ${isAdminMode ? 'text-white/60 hover:text-accent' : 'text-primary/40 hover:text-accent'}`}>
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Voltar para o site
                </Link>

                <div className={`${isAdminMode ? 'bg-[#081F2E]/80 border-white/5 shadow-white/5' : 'bg-white shadow-xl shadow-primary/5 border-primary/5'} backdrop-blur-xl p-10 rounded-[40px] border`}>
                    <div className="flex flex-col items-center mb-10">
                        <img src="/logo_n0t4x.png" alt="N0T4X" className="h-14 w-auto mb-8" />

                        <h1 className={`text-3xl font-black text-center ${isAdminMode ? 'text-white' : 'text-primary'}`}>
                            {isAdminMode ? (
                                <>Portal <span className="text-accent">Adm</span></>
                            ) : (
                                <>Acesse o <span className="text-accent underline decoration-4 underline-offset-8">Portal</span></>
                            )}
                        </h1>
                        <p className={`text-sm mt-4 font-medium ${isAdminMode ? 'text-white/50' : 'text-primary/40 text-center'}`}>
                            {isAdminMode ? 'Painel de Gestão Administrativa' : 'Área exclusiva para clientes N0T4X'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className={`text-[10px] font-black uppercase tracking-[0.2em] px-1 ${isAdminMode ? 'text-white/40' : 'text-primary/40'}`}>E-mail</label>
                            <div className="relative group">
                                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${isAdminMode ? 'text-white/20' : 'text-primary/20'} group-focus-within:text-accent transition-colors`} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="exemplo@email.com"
                                    className={`w-full ${isAdminMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-100/50 border-slate-200 text-primary'} border rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent transition-all font-semibold placeholder:opacity-30`}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className={`text-[10px] font-black uppercase tracking-[0.2em] px-1 ${isAdminMode ? 'text-white/40' : 'text-primary/40'}`}>Senha</label>
                            <div className="relative group">
                                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${isAdminMode ? 'text-white/20' : 'text-primary/20'} group-focus-within:text-accent transition-colors`} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={`w-full ${isAdminMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-100/50 border-slate-200 text-primary'} border rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-accent transition-all font-bold placeholder:opacity-30`}
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="peer sr-only"
                                    />
                                    <div className={`h-5 w-5 rounded-md border-2 transition-all ${isAdminMode ? 'border-white/10 bg-white/5 peer-checked:border-accent peer-checked:bg-accent' : 'border-slate-200 bg-slate-50 peer-checked:border-accent peer-checked:bg-accent'}`}></div>
                                    <Shield className={`absolute h-3 w-3 text-primary scale-0 peer-checked:scale-100 transition-transform`} strokeWidth={3} />
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${isAdminMode ? 'text-white/40 group-hover:text-white/60' : 'text-primary/40 group-hover:text-primary/60'} transition-colors`}>Lembrar-me</span>
                            </label>
                            <Link href="#" className="text-[10px] text-accent hover:text-accent-light transition-colors font-black uppercase tracking-widest">Esqueceu a senha?</Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-accent hover:bg-accent-light text-primary font-black rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-accent/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed uppercase text-xs tracking-widest"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    {isAdminMode ? 'Entrar no Painel' : 'Acessar Plataforma'}
                                    <ChevronRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center mt-6 pt-6 border-t border-primary/5">
                        <p className={`text-[10px] font-medium mb-1 ${isAdminMode ? 'text-white/20' : 'text-primary/20'}`}>
                            {isAdminMode ? 'Acesso restrito a colaboradores autorizados.' : 'Não possui conta? O acesso é liberado por nossa equipe.'}
                        </p>
                        <Link href="/#contato" className={`text-xs font-bold transition-colors ${isAdminMode ? 'text-white/40 hover:text-accent' : 'text-primary/40 hover:text-accent'}`}>
                            Problemas com acesso? Entre em contato
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

