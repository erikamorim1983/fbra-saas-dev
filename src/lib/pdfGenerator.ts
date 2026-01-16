'use client';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface TaxAnalysis {
    regime: string;
    total: number;
    efficiency: number;
    pis_cofins: number;
    irpj_csll: number;
    iss: number;
}

interface ParecerData {
    companyName: string;
    cnpj?: string;
    consultorName: string;
    date: string;
    receitaBruta: number;
    receitaLiquida: number;
    ebitda: number;
    analysis: TaxAnalysis[];
    bestRegime: string;
    savings: number;
}

const regimeNames: Record<string, string> = {
    'simples': 'Simples Nacional',
    'presumido': 'Lucro Presumido',
    'real_cumulativo': 'Lucro Real (Cumulativo)',
    'real_nao_cumulativo': 'Lucro Real (Não Cumulativo)',
};

export function generateParecerPDF(data: ParecerData) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPos = 20;

    // Cores da marca FBRA
    const primaryColor: [number, number, number] = [15, 23, 42]; // Slate-900
    const accentColor: [number, number, number] = [234, 179, 8]; // Amarelo FBRA
    const grayColor: [number, number, number] = [100, 116, 139]; // Slate-500

    // ========== CABEÇALHO ==========
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 45, 'F');

    // Logo/Nome da empresa
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('FBRA', margin, 25);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Planejamento Tributário Estratégico', margin, 33);

    // Data do parecer
    doc.setFontSize(9);
    doc.text(`Parecer emitido em: ${data.date}`, pageWidth - margin - 50, 25);
    doc.text(`Consultor: ${data.consultorName}`, pageWidth - margin - 50, 33);

    yPos = 60;

    // ========== TÍTULO DO PARECER ==========
    doc.setTextColor(...primaryColor);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('PARECER TÉCNICO TRIBUTÁRIO', margin, yPos);

    yPos += 8;
    doc.setFillColor(...accentColor);
    doc.rect(margin, yPos, 60, 2, 'F');

    yPos += 15;

    // ========== DADOS DA EMPRESA ==========
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('EMPRESA ANALISADA', margin, yPos);

    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);
    doc.setFontSize(10);
    doc.text(`Razão Social: ${data.companyName}`, margin, yPos);
    yPos += 6;
    if (data.cnpj) {
        doc.text(`CNPJ: ${data.cnpj}`, margin, yPos);
        yPos += 6;
    }

    yPos += 10;

    // ========== RESUMO FINANCEIRO ==========
    doc.setTextColor(...primaryColor);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('RESUMO FINANCEIRO MENSAL (MÉDIA)', margin, yPos);

    yPos += 8;

    const formatCurrency = (value: number) =>
        `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    autoTable(doc, {
        startY: yPos,
        margin: { left: margin, right: margin },
        head: [['Indicador', 'Valor']],
        body: [
            ['Receita Bruta Mensal', formatCurrency(data.receitaBruta)],
            ['Receita Líquida Mensal', formatCurrency(data.receitaLiquida)],
            ['EBITDA Mensal', formatCurrency(data.ebitda)],
        ],
        headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 9
        },
        bodyStyles: {
            textColor: primaryColor,
            fontSize: 9
        },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
            0: { cellWidth: 80 },
            1: { cellWidth: 60, halign: 'right' }
        }
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // ========== COMPARATIVO DE REGIMES ==========
    doc.setTextColor(...primaryColor);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('COMPARATIVO DE REGIMES TRIBUTÁRIOS', margin, yPos);

    yPos += 8;

    const tableData = data.analysis.map(a => [
        regimeNames[a.regime] || a.regime,
        formatCurrency(a.pis_cofins),
        formatCurrency(a.irpj_csll),
        formatCurrency(a.iss),
        formatCurrency(a.total),
        `${a.efficiency}%`
    ]);

    autoTable(doc, {
        startY: yPos,
        margin: { left: margin, right: margin },
        head: [['Regime', 'PIS/COFINS', 'IRPJ/CSLL', 'ISS', 'TOTAL', 'Eficiência']],
        body: tableData,
        headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 8
        },
        bodyStyles: {
            textColor: primaryColor,
            fontSize: 8
        },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
            0: { cellWidth: 45 },
            4: { fontStyle: 'bold' },
            5: { halign: 'center' }
        }
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // ========== ECONOMIA IDENTIFICADA ==========
    doc.setFillColor(236, 253, 245); // Green-50
    doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 25, 3, 3, 'F');

    doc.setTextColor(22, 163, 74); // Green-600
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('ECONOMIA POTENCIAL IDENTIFICADA', margin + 10, yPos + 10);

    doc.setFontSize(16);
    doc.text(formatCurrency(data.savings) + ' /mês', margin + 10, yPos + 20);

    yPos += 35;

    // ========== PARECER TÉCNICO ==========
    doc.setTextColor(...primaryColor);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('PARECER TÉCNICO E RECOMENDAÇÃO', margin, yPos);

    yPos += 3;
    doc.setFillColor(...accentColor);
    doc.rect(margin, yPos, 60, 2, 'F');

    yPos += 10;

    const bestRegimeName = regimeNames[data.bestRegime] || data.bestRegime;
    const parecer = `
Com base na análise detalhada dos demonstrativos financeiros da empresa ${data.companyName}, considerando os parâmetros estabelecidos pela legislação tributária vigente (Lei 10.637/02, Lei 10.833/03, Lei 9.718/98 e legislação complementar), este parecer técnico recomenda a adoção do regime de ${bestRegimeName}.

FUNDAMENTAÇÃO:

1. ANÁLISE COMPARATIVA: Após simulação dos quatro regimes tributários aplicáveis (Simples Nacional, Lucro Presumido, Lucro Real Cumulativo e Lucro Real Não Cumulativo), identificou-se que o regime de ${bestRegimeName} apresenta a menor carga tributária efetiva para o perfil operacional da empresa.

2. ECONOMIA FISCAL: A adoção do regime recomendado representa uma economia mensal estimada de ${formatCurrency(data.savings)} em comparação com o regime menos vantajoso, totalizando aproximadamente ${formatCurrency(data.savings * 12)} ao ano.

3. BASE LEGAL: A opção pelo regime tributário é direito do contribuinte, devendo ser formalizada no início de cada exercício fiscal, conforme art. 13 da Lei 9.718/98.

RESSALVAS:
Este parecer tem caráter consultivo e baseia-se exclusivamente nos dados financeiros informados. Recomenda-se validação junto ao departamento contábil da empresa antes da implementação.
    `.trim();

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...grayColor);

    const splitParecer = doc.splitTextToSize(parecer, pageWidth - (margin * 2));
    doc.text(splitParecer, margin, yPos);

    // ========== RODAPÉ ==========
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFillColor(...primaryColor);
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text('FBRA | Planejamento Tributário Estratégico', margin, pageHeight - 10);
    doc.text('Este documento é confidencial e destinado exclusivamente ao cliente.', pageWidth - margin - 90, pageHeight - 10);

    // Salvar o PDF com nome legível
    const safeName = data.companyName
        .replace(/[^a-zA-Z0-9\s]/g, '') // Remove caracteres especiais
        .replace(/\s+/g, '_') // Substitui espaços por underscores
        .substring(0, 50) || 'Empresa'; // Limita tamanho

    const safeDate = data.date.replace(/\//g, '-');
    const fileName = `Parecer_Tecnico_${safeName}_${safeDate}.pdf`;

    console.log('📄 Gerando PDF:', fileName);
    doc.save(fileName);
}
