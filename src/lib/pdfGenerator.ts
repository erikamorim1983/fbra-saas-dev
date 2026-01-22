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
    'Simples Nacional': 'Simples Nacional',
    'Lucro Presumido': 'Lucro Presumido',
    'Lucro Real (Cumulativo)': 'Lucro Real (Cumulativo)',
    'Lucro Real (Não-Cumulativo)': 'Lucro Real (Não Cumulativo)',
};

const formatCurrency = (value: number) =>
    `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Cores da marca N0T4X
const primaryColor: [number, number, number] = [15, 23, 42]; // Slate-900
const accentColor: [number, number, number] = [234, 179, 8]; // Amarelo N0T4X
const grayColor: [number, number, number] = [100, 116, 139]; // Slate-500

function addHeader(doc: jsPDF, data: ParecerData, pageNum: number, totalPages: number) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;

    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('N0T4X', margin, 20);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Planejamento Tributário Estratégico', margin, 28);

    doc.setFontSize(8);
    doc.text(`Parecer: ${data.date}`, pageWidth - margin - 30, 20);
    doc.text(`Página ${pageNum}/${totalPages}`, pageWidth - margin - 30, 28);
}

function addFooter(doc: jsPDF) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    doc.setFillColor(...primaryColor);
    doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.text('N0T4X | Planejamento Tributário Estratégico', margin, pageHeight - 6);
    doc.text('Documento confidencial - Uso exclusivo do cliente', pageWidth - margin - 65, pageHeight - 6);
}

export function generateParecerPDF(data: ParecerData) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentTop = 50;
    const contentBottom = pageHeight - 25;
    let yPos = contentTop;

    // Calcular número de páginas (estimativa)
    const totalPages = 2;

    // ==================== PÁGINA 1 ====================
    addHeader(doc, data, 1, totalPages);

    // Título do Parecer
    doc.setTextColor(...primaryColor);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('PARECER TÉCNICO TRIBUTÁRIO', margin, yPos);

    yPos += 5;
    doc.setFillColor(...accentColor);
    doc.rect(margin, yPos, 55, 2, 'F');

    yPos += 15;

    // Dados da Empresa
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('EMPRESA ANALISADA', margin, yPos);

    yPos += 7;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);
    doc.setFontSize(9);
    doc.text(`Razão Social: ${data.companyName}`, margin, yPos);
    yPos += 5;
    if (data.cnpj) {
        doc.text(`CNPJ: ${data.cnpj}`, margin, yPos);
        yPos += 5;
    }
    doc.text(`Consultor Responsável: ${data.consultorName}`, margin, yPos);

    yPos += 15;

    // Resumo Financeiro
    doc.setTextColor(...primaryColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('RESUMO FINANCEIRO MENSAL', margin, yPos);

    yPos += 6;

    autoTable(doc, {
        startY: yPos,
        margin: { left: margin, right: margin },
        head: [['Indicador', 'Valor Mensal', 'Valor Anual']],
        body: [
            ['Receita Bruta', formatCurrency(data.receitaBruta), formatCurrency(data.receitaBruta * 12)],
            ['Receita Líquida', formatCurrency(data.receitaLiquida), formatCurrency(data.receitaLiquida * 12)],
            ['EBITDA', formatCurrency(data.ebitda), formatCurrency(data.ebitda * 12)],
        ],
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
            0: { cellWidth: 50 },
            1: { cellWidth: 45, halign: 'right' },
            2: { cellWidth: 45, halign: 'right' }
        }
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Comparativo de Regimes
    doc.setTextColor(...primaryColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('COMPARATIVO DE REGIMES TRIBUTÁRIOS', margin, yPos);

    yPos += 6;

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
        head: [['Regime Tributário', 'PIS/COFINS', 'IRPJ/CSLL', 'ISS', 'TOTAL', 'Efic.']],
        body: tableData,
        headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 7
        },
        bodyStyles: {
            textColor: primaryColor,
            fontSize: 7
        },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
            0: { cellWidth: 42 },
            4: { fontStyle: 'bold' },
            5: { halign: 'center' }
        }
    });

    yPos = (doc as any).lastAutoTable.finalY + 12;

    // Economia Identificada
    doc.setFillColor(236, 253, 245);
    doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 22, 3, 3, 'F');

    doc.setTextColor(22, 163, 74);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('ECONOMIA POTENCIAL IDENTIFICADA', margin + 8, yPos + 9);

    doc.setFontSize(14);
    doc.text(formatCurrency(data.savings) + ' /mês  |  ' + formatCurrency(data.savings * 12) + ' /ano', margin + 8, yPos + 18);

    addFooter(doc);

    // ==================== PÁGINA 2 ====================
    doc.addPage();
    addHeader(doc, data, 2, totalPages);
    yPos = contentTop;

    // Parecer Técnico
    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PARECER TÉCNICO E RECOMENDAÇÃO', margin, yPos);

    yPos += 5;
    doc.setFillColor(...accentColor);
    doc.rect(margin, yPos, 55, 2, 'F');

    yPos += 12;

    const bestRegimeName = regimeNames[data.bestRegime] || data.bestRegime;

    // Introdução
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...grayColor);

    const intro = `Com base na análise detalhada dos demonstrativos financeiros da empresa ${data.companyName}, considerando os parâmetros estabelecidos pela legislação tributária vigente (Lei 10.637/02, Lei 10.833/03, Lei 9.718/98 e legislação complementar), este parecer técnico recomenda a adoção do regime de ${bestRegimeName}.`;

    const splitIntro = doc.splitTextToSize(intro, pageWidth - (margin * 2));
    doc.text(splitIntro, margin, yPos);
    yPos += splitIntro.length * 5 + 10;

    // Fundamentação
    doc.setTextColor(...primaryColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('FUNDAMENTAÇÃO', margin, yPos);
    yPos += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...grayColor);

    // Item 1
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('1. ANÁLISE COMPARATIVA', margin, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);
    const text1 = `Após simulação dos quatro regimes tributários aplicáveis (Simples Nacional, Lucro Presumido, Lucro Real Cumulativo e Lucro Real Não Cumulativo), identificou-se que o regime de ${bestRegimeName} apresenta a menor carga tributária efetiva para o perfil operacional da empresa, considerando sua estrutura de receitas, custos e despesas.`;
    const split1 = doc.splitTextToSize(text1, pageWidth - (margin * 2));
    doc.text(split1, margin, yPos);
    yPos += split1.length * 5 + 8;

    // Item 2
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('2. ECONOMIA FISCAL', margin, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);
    const text2 = `A adoção do regime recomendado representa uma economia mensal estimada de ${formatCurrency(data.savings)} em comparação com o regime menos vantajoso, totalizando aproximadamente ${formatCurrency(data.savings * 12)} ao ano. Esta economia pode ser reinvestida na operação ou distribuída como lucros aos sócios.`;
    const split2 = doc.splitTextToSize(text2, pageWidth - (margin * 2));
    doc.text(split2, margin, yPos);
    yPos += split2.length * 5 + 8;

    // Item 3
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('3. BASE LEGAL', margin, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);
    const text3 = `A opção pelo regime tributário é direito do contribuinte, devendo ser formalizada no início de cada exercício fiscal, conforme art. 13 da Lei 9.718/98. A mudança de regime pode ser solicitada até o último dia útil de janeiro de cada ano, produzindo efeitos a partir de 1º de janeiro.`;
    const split3 = doc.splitTextToSize(text3, pageWidth - (margin * 2));
    doc.text(split3, margin, yPos);
    yPos += split3.length * 5 + 12;

    // Ressalvas
    doc.setTextColor(...primaryColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('RESSALVAS E OBSERVAÇÕES', margin, yPos);
    yPos += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...grayColor);
    const ressalvas = `Este parecer tem caráter consultivo e baseia-se exclusivamente nos dados financeiros informados pelo cliente. As projeções e estimativas apresentadas podem variar de acordo com alterações na legislação tributária ou nas condições operacionais da empresa. Recomenda-se validação junto ao departamento contábil antes da implementação de qualquer mudança no regime tributário.`;
    const splitRessalvas = doc.splitTextToSize(ressalvas, pageWidth - (margin * 2));
    doc.text(splitRessalvas, margin, yPos);
    yPos += splitRessalvas.length * 5 + 15;

    // Assinatura
    doc.setTextColor(...primaryColor);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('_'.repeat(40), margin, yPos);
    yPos += 5;
    doc.setFont('helvetica', 'bold');
    doc.text(data.consultorName, margin, yPos);
    yPos += 4;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);
    doc.text('Consultor Tributário - N0T4X', margin, yPos);
    yPos += 4;
    doc.text(`Data: ${data.date}`, margin, yPos);

    addFooter(doc);

    // Salvar o PDF
    const safeName = data.companyName
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 50) || 'Empresa';

    const safeDate = data.date.replace(/\//g, '-');
    const fileName = `Parecer_Tecnico_${safeName}_${safeDate}.pdf`;

    console.log('📄 Gerando PDF:', fileName);
    doc.save(fileName);
}
