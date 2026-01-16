'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Building2,
    Settings,
    LogOut,
    Calculator,
    FileText,
    Users
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

const menuItems = [
    { icon: LayoutDashboard, label: 'Início', href: '/dashboard' },
    { icon: Users, label: 'Grupos de Empresas', href: '/dashboard/groups' },
    { icon: Calculator, label: 'Simulador Tributário', href: '/dashboard/simulator' },
    { icon: FileText, label: 'Pareceres Técnicos', href: '/dashboard/reports' },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = createClient();
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error logging out:', error.message);
            return;
        }
        router.push('/auth/login');
        router.refresh();
    };

    const userInitials = user?.email?.substring(0, 2).toUpperCase() || '??';

    return (
        <div className="flex h-screen bg-slate-50 text-primary overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm">
                <div className="p-8">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <span className="text-xl font-bold tracking-tight text-primary">
                            FBRA<span className="text-accent underline decoration-2 decoration-accent/20 underline-offset-4">SaaS</span>
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'text-primary/60 hover:text-primary hover:bg-slate-50'
                                    }`}
                            >
                                <item.icon className={`h-5 w-5 ${isActive ? '' : 'group-hover:scale-110'} transition-transform`} />
                                <span className="text-sm font-semibold">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100 space-y-1">
                    <Link
                        href="/dashboard/settings"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === '/dashboard/settings'
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-primary/60 hover:text-primary hover:bg-slate-50'
                            }`}
                    >
                        <Settings className="h-5 w-5" />
                        <span className="text-sm font-semibold">Configurações</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-all text-primary/60 hover:text-red-600 cursor-pointer"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="text-sm font-semibold">Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-slate-50">
                <header className="h-20 border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 bg-white/80 backdrop-blur-xl z-20">
                    <div>
                        <h2 className="text-[10px] font-bold uppercase tracking-widest text-primary/30">Dashboard</h2>
                        <p className="text-xl font-bold text-primary">Bem-vindo, Consultor FBRA</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end mr-2">
                            <span className="text-xs font-bold text-primary truncate max-w-[150px]">
                                {user?.email?.split('@')[0] || 'Fernando Brasil'}
                            </span>
                            <span className="text-[10px] text-primary/40 uppercase font-bold tracking-tight">Consultor Sênior</span>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-accent font-bold shadow-lg shadow-primary/10">
                            {userInitials}
                        </div>
                    </div>
                </header>

                <div className="p-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
