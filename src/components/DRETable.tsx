'use client';

import React from 'react';
import { HelpCircle, Info } from 'lucide-react';

interface DREField {
    id: string;
    label: string;
    isHeader?: boolean;
    isSubtotal?: boolean;
    indent?: boolean;
}

const dreStructure: DREField[] = [
    { id: '1', label: '01 - (+) Receita Bruta (Sales)', isHeader: true },
    { id: '1.1', label: '01.01 - Prestação de Serviços', indent: true },
    { id: '1.2', label: '01.02 - Multas Quebra de Contrato', indent: true },
    { id: '1.4', label: '01.04 - Comissões de Parceiros', indent: true },
    { id: '2', label: '02 - (-) Deduções - Impostos e Repasses', isHeader: true },
    { id: '2.1', label: '02.01 - ISS', indent: true },
    { id: '2.2', label: '02.02 - PIS', indent: true },
    { id: '2.3', label: '02.03 - Cofins', indent: true },
    { id: '2.4', label: '02.04 - Simples Nacional', indent: true },
    { id: 'rl', label: '(=) Receita Líquida', isSubtotal: true },
    { id: '3', label: '03 - (-) Custos do Serviço Vendido (COGS)', isHeader: true },
    { id: '3.1', label: '03.01 - Custos com Pessoal', indent: true },
    { id: '3.2', label: '03.02 - Custos de Infraestrutura e Hospedagem', indent: true },
    { id: '3.3', label: '03.03 - Custos com Serviços de Terceiros', indent: true },
    { id: 'mb', label: '(=) Margem Bruta', isSubtotal: true },
    { id: '4', label: '04 - (-) Despesas Operacionais (Operating Expenses)', isHeader: true },
    { id: '4.1', label: '04.01 - Despesas com Pessoal', indent: true },
    { id: '4.4', label: '04.04 - Marketing & Sales', indent: true },
    { id: '4.6', label: '04.06 - Despesas Administrativas', indent: true },
    { id: 'ebitda', label: '(=) EBITDA', isSubtotal: true },
    { id: '5', label: '05 - (-) Depreciação e Amortização', isHeader: true },
    { id: 'ebit', label: '(=) EBIT', isSubtotal: true },
    { id: 'lair', label: '(=) LAIR', isSubtotal: true },
    { id: '8', label: '08 - (-) IR & CSLL (Taxes)', isHeader: true },
    { id: '8.1', label: '08.01 - IRPJ', indent: true },
    { id: '8.2', label: '08.02 - CSLL', indent: true },
    { id: 'll', label: '(=) Lucro Líquido', isSubtotal: true },
    { id: 'taxes_total', label: 'Total Impostos Consolidados', isSubtotal: true },
    { id: 'effective_rate', label: 'Alíquota Efetiva de Impostos', isSubtotal: true },
];

const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export default function DRETable() {
    return (
        <div className="glass rounded-3xl overflow-hidden border-white/10 shadow-2xl">
            <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                    <thead>
                        <tr className="bg-primary-dark/80 border-b border-white/10">
                            <th className="p-4 min-w-[300px] sticky left-0 bg-primary-dark/95 z-10 font-bold uppercase tracking-widest text-[#d4af37]">Estrutura de Resultados (DRE)</th>
                            <th className="p-4 text-center font-bold text-white border-l border-white/5">Total 2026</th>
                            {months.map(m => (
                                <th key={m} className="p-4 text-center text-foreground/50 border-l border-white/5">{m}/26</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {dreStructure.map((field) => (
                            <tr
                                key={field.id}
                                className={`
                  transition-colors hover:bg-white/5
                  ${field.isHeader ? 'bg-white/5 text-white font-bold' : ''}
                  ${field.isSubtotal ? 'bg-accent/10 text-accent font-bold' : ''}
                `}
                            >
                                <td className={`p-3 sticky left-0 z-10 bg-inherit border-r border-white/5 ${field.indent ? 'pl-8 text-foreground/70' : ''}`}>
                                    {field.label}
                                </td>
                                <td className="p-3 text-center border-l border-white/5">
                                    <input
                                        type="text"
                                        placeholder="0,00"
                                        className="w-full bg-transparent text-center focus:outline-none focus:text-accent font-mono"
                                    />
                                </td>
                                {months.map(m => (
                                    <td key={m} className="p-3 text-center border-l border-white/5">
                                        <input
                                            type="text"
                                            placeholder="-"
                                            className="w-full bg-transparent text-center focus:outline-none focus:bg-white/5 font-mono"
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-6 bg-primary-dark/50 border-t border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-2 text-foreground/40 text-[10px] uppercase font-bold tracking-widest">
                    <Info className="h-4 w-4 text-accent" />
                    Preencha os valores mensais para uma análise de PIS/COFINS precisa
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-2 glass hover:bg-white/10 rounded-xl text-sm font-bold transition-all">
                        Importar Planilha (.csv)
                    </button>
                    <button className="px-8 py-2 bg-accent text-primary rounded-xl text-sm font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent/20">
                        Salvar Dados
                    </button>
                </div>
            </div>
        </div>
    );
}
