'use client';

import React from 'react';
import { FileText, Sparkles, Construction, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ReportsPage() {
    return (
        <div className="h-[80vh] flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-700">
            <div className="relative">
                <div className="absolute -inset-10 bg-accent/20 blur-[100px] rounded-full"></div>
                <div className="w-32 h-32 bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl flex items-center justify-center relative group">
                    <Construction className="h-16 w-16 text-accent animate-bounce" />
                    <div className="absolute -top-2 -right-2 bg-primary text-accent text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                        MÓDULO ALPHA
                    </div>
                </div>
            </div>

            <div className="space-y-4 max-w-lg">
                <h1 className="text-5xl font-black text-primary italic leading-tight">
                    Pareceres <span className="text-accent underline decoration-accent/10">Técnicos</span>
                </h1>
                <p className="text-primary/40 font-bold uppercase tracking-[0.2em] text-xs">
                    EM DESENVOLVIMENTO PELA ENGENHARIA
                </p>
                <p className="text-primary/60 font-medium leading-relaxed">
                    Estamos finalizando o motor de geração de PDFs dinâmicos com inteligência artificial.
                    Este módulo permitirá gerar relatórios personalizados em segundos.
                </p>
            </div>

            <div className="flex gap-4">
                <Link
                    href="/portal/grupos"
                    className="px-8 py-4 bg-primary text-accent font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/20 flex items-center gap-3"
                >
                    <ArrowLeft className="h-4 w-4" /> Voltar aos Grupos
                </Link>
                <div className="px-8 py-4 bg-white border border-slate-200 text-primary/40 font-black uppercase tracking-widest text-xs rounded-2xl flex items-center gap-3">
                    <Sparkles className="h-4 w-4 text-accent" /> Em Breve
                </div>
            </div>

            <div className="pt-12 grid grid-cols-3 gap-8 w-full max-w-2xl opacity-30 grayscale">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-2">
                    <div className="h-2 w-12 bg-slate-200 rounded-full"></div>
                    <div className="h-4 w-full bg-slate-100 rounded-full"></div>
                    <div className="h-2 w-20 bg-slate-50 rounded-full"></div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-2">
                    <div className="h-2 w-12 bg-slate-200 rounded-full"></div>
                    <div className="h-4 w-full bg-slate-100 rounded-full"></div>
                    <div className="h-2 w-20 bg-slate-50 rounded-full"></div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-2">
                    <div className="h-2 w-12 bg-slate-200 rounded-full"></div>
                    <div className="h-4 w-full bg-slate-100 rounded-full"></div>
                    <div className="h-2 w-20 bg-slate-50 rounded-full"></div>
                </div>
            </div>
        </div>
    );
}
