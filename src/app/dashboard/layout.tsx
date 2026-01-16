'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Building2,
    Settings,
    LogOut,
    Calculator,
    FileText,
    Users,
    ChevronLeft,
    ChevronRight,
    Menu
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
    const [isExpanded, setIsExpanded] = useState(true);

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
            <aside className={`${isExpanded ? 'w-64' : 'w-20'} bg-white border-r border-slate-200 flex flex-col shadow-sm transition-all duration-300 relative`}>
                {/* Toggle Button */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="absolute -right-3 top-24 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
                >
                    {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </button>

                {/* Logo */}
                <div className={`p-4 ${isExpanded ? 'px-6' : 'px-2'} flex items-center justify-center`}>
                    <Link href="/dashboard" className="flex items-center gap-2">
                        {isExpanded ? (
                            <div className="flex items-center gap-2">
                                <Image src="/logo.png" alt="FBRA Consulting" width={40} height={40} className="rounded-lg" />
                                <div className="flex flex-col">
                                    <span className="text-lg font-bold tracking-tight text-primary leading-tight">FBRA</span>
                                    <span className="text-[10px] font-medium text-primary/50 uppercase tracking-widest">Consulting</span>
                                </div>
                            </div>
                        ) : (
                            <Image src="/logo.png" alt="FBRA" width={40} height={40} className="rounded-lg" />
                        )}
                    </Link>
                </div>

                <nav className="flex-1 px-3 space-y-1 mt-4">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={item.label}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${isActive
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'text-primary/60 hover:text-primary hover:bg-slate-50'
                                    } ${!isExpanded ? 'justify-center' : ''}`}
                            >
                                <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? '' : 'group-hover:scale-110'} transition-transform`} />
                                {isExpanded && <span className="text-sm font-semibold truncate">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-3 border-t border-slate-100 space-y-1">
                    <Link
                        href="/dashboard/settings"
                        title="Configurações"
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${pathname === '/dashboard/settings'
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-primary/60 hover:text-primary hover:bg-slate-50'
                            } ${!isExpanded ? 'justify-center' : ''}`}
                    >
                        <Settings className="h-5 w-5 flex-shrink-0" />
                        {isExpanded && <span className="text-sm font-semibold">Configurações</span>}
                    </Link>
                    <button
                        onClick={handleLogout}
                        title="Sair"
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-50 transition-all text-primary/60 hover:text-red-600 cursor-pointer ${!isExpanded ? 'justify-center' : ''}`}
                    >
                        <LogOut className="h-5 w-5 flex-shrink-0" />
                        {isExpanded && <span className="text-sm font-semibold">Sair</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-slate-50">
                <header className="h-16 border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 bg-white/80 backdrop-blur-xl z-20">
                    <div>
                        <h2 className="text-[10px] font-bold uppercase tracking-widest text-primary/30">Dashboard</h2>
                        <p className="text-lg font-bold text-primary">Bem-vindo, Consultor FBRA</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-primary truncate max-w-[120px]">
                                {user?.email?.split('@')[0] || 'Consultor'}
                            </span>
                            <span className="text-[10px] text-primary/40 uppercase font-bold tracking-tight">Consultor Sênior</span>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-accent font-bold shadow-lg shadow-primary/10">
                            {userInitials}
                        </div>
                    </div>
                </header>

                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
