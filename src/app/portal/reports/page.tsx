import { FileText, Download, Filter, Search } from 'lucide-react';

export default function ReportsPage() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Pareceres Técnicos</h1>
                    <p className="text-primary/40">Consulte e baixe os pareceres emitidos pela equipe N0T4X.</p>
                </div>
            </div>

            <div className="glass p-6 rounded-3xl border-primary/5">
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
                        <input
                            type="text"
                            placeholder="Buscar parecer por título ou palavra-chave..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-accent transition-all"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-primary/60 hover:border-accent hover:text-accent transition-all">
                        <Filter className="h-4 w-4" />
                        Filtrar
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-primary/30">Título do Parecer</th>
                                <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-primary/30">Data de Emissão</th>
                                <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-primary/30">Categoria</th>
                                <th className="text-right p-4 text-[10px] font-black uppercase tracking-widest text-primary/30">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3].map((i) => (
                                <tr key={i} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <span className="font-bold text-primary italic">Parecer Técnico #{2024 + i} - Planejamento ICMS</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-primary/60">1{i}/01/2026</td>
                                    <td className="p-4 text-sm">
                                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase">Fiscal</span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="p-2 hover:text-accent transition-colors" title="Baixar PDF">
                                            <Download className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
