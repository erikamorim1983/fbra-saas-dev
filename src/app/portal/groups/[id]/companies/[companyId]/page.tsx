'use client';

import React, { useState } from 'react';
import {
    ArrowLeft,
    Building2,
    Settings,
    TrendingUp,
    FileCheck,
    History,
    Sparkles,
    ChevronRight,
    Plus,
    Calculator
} from 'lucide-react';
import Link from 'next/link';
import FunctionalSimulator from '@/components/FunctionalSimulator';

export default function CompanyDetailsPage() {
    const [activeTab, setActiveTab] = useState('dre');

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Breadcrumbs & Navigation */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href="/portal/groups" className="p-2 glass rounded-lg hover:text-accent transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/40">
                            <Link href="/portal/groups" className="hover:text-foreground transition-colors">Grupos</Link>
                            <ChevronRight className="h-3 w-3" />
                            <span>Holding Nacional</span>
                        </div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            N0T4X Tecnologia S.A.
                            <span className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] rounded-md border border-green-500/20">Ativa</span>
                        </h1>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="px-6 py-3 glass hover:bg-white/10 rounded-xl text-sm font-bold flex items-center gap-2 transition-all">
                        <History className="h-4 w-4" />
                        Histórico
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 glass w-fit rounded-xl border-white/5">
                <button
                    onClick={() => setActiveTab('dre')}
                    className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'dre' ? 'bg-accent text-primary' : 'text-foreground/50 hover:text-foreground'}`}
                >
                    Estrutura DRE & Simulação
                </button>
                <button
                    onClick={() => setActiveTab('config')}
                    className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'config' ? 'bg-accent text-primary' : 'text-foreground/50 hover:text-foreground'}`}
                >
                    Parâmetros Fiscais
                </button>
            </div>

            {/* Content Area */}
            {activeTab === 'dre' ? (
                <FunctionalSimulator />
            ) : (
                <div className="glass p-20 rounded-3xl text-center">
                    <Settings className="h-12 w-12 text-accent mx-auto mb-4 opacity-20" />
                    <p className="text-foreground/40 font-medium">Configurações de Alíquotas por CNAE em breve.</p>
                </div>
            )}
        </div>
    );
}
