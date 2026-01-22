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
    { icon: Building2, label: 'Grupos de Empresas', href: '/portal/groups', roles: ['admin', 'consultant', 'client'] },
    { icon: Calculator, label: 'Simulador Tributário', href: '/portal/simulator', roles: ['admin', 'consultant', 'client'] },
    { icon: FileText, label: 'Pareceres Técnicos', href: '/portal/reports', roles: ['admin', 'consultant', 'client'] },
];

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = createClient();
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [isExpanded, setIsExpanded] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                setProfile(profile);
            }
        };
        fetchUserData();
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
    const userRole = profile?.role || 'client';

    return (
        <div className="flex h-screen bg-slate-50 text-primary overflow-hidden">
            {/* Sidebar */}
            <aside className={`${isExpanded ? 'w-64' : 'w-20'} bg-primary border-r border-white/5 flex flex-col shadow-2xl transition-all duration-300 relative`}>
                {/* Toggle Button */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="absolute -right-3 top-24 w-6 h-6 bg-accent text-primary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50 border-2 border-primary"
                >
                    {isExpanded ? <ChevronLeft className="h-3 w-3" strokeWidth={3} /> : <ChevronRight className="h-3 w-3" strokeWidth={3} />}
                </button>

                {/* Logo */}
                <div className={`p-6 ${isExpanded ? 'px-6' : 'px-2'} flex items-center justify-center border-b border-white/5`}>
                    <Link href="/portal" className="flex items-center gap-2">
                        {isExpanded ? (
                            <img src="/logo_n0t4x.png" alt="N0T4X" className="h-10 w-auto" />
                        ) : (
                            <div className="w-10 h-10 relative overflow-hidden rounded-lg bg-white/5 border border-white/10 shadow-lg">
                                <Image src="/logo_n0t4x.png" alt="N0T4X" fill className="object-contain" />
                            </div>
                        )}
                    </Link>
                </div>

                <nav className="flex-1 px-3 space-y-1.5 mt-6">
                    {menuItems.filter(item => item.roles.includes(userRole)).map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/portal' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={item.label}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                                    ? 'bg-accent text-primary shadow-lg shadow-accent/20'
                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                                    } ${!isExpanded ? 'justify-center' : ''}`}
                            >
                                <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? '' : 'group-hover:scale-110'} transition-transform`} />
                                {isExpanded && <span className="text-sm font-bold truncate">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-3 border-t border-white/5 space-y-1.5 mb-4">
                    <Link
                        href="/portal/settings"
                        title="Configurações"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === '/portal/settings'
                            ? 'bg-accent text-primary shadow-lg shadow-accent/20'
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                            } ${!isExpanded ? 'justify-center' : ''}`}
                    >
                        <Settings className="h-5 w-5 flex-shrink-0" />
                        {isExpanded && <span className="text-sm font-bold">Configurações</span>}
                    </Link>
                    <button
                        onClick={handleLogout}
                        title="Sair"
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-500/10 transition-all text-white/40 hover:text-rose-400 cursor-pointer ${!isExpanded ? 'justify-center' : ''}`}
                    >
                        <LogOut className="h-5 w-5 flex-shrink-0" />
                        {isExpanded && <span className="text-sm font-bold">Sair</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-slate-50">
                <header className="h-16 border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 bg-white/80 backdrop-blur-xl z-20">
                    <div>
                        <h2 className="text-[10px] font-bold uppercase tracking-widest text-primary/30">Portal do Cliente</h2>
                        <p className="text-lg font-bold text-primary">Bem-vindo, {profile?.full_name?.split(' ')[0] || 'Cliente'}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-primary truncate max-w-[120px]">
                                {profile?.full_name || user?.email?.split('@')[0]}
                            </span>
                            <span className="text-[10px] text-primary/40 uppercase font-bold tracking-tight">Status: Ativo</span>
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
