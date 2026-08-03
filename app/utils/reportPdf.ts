import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function humanizeKey(key: string): string {
    return key
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/_/g, " ")
        .replace(/^./, (c) => c.toUpperCase());
}

function ensureSpace(doc: jsPDF, y: number, needed = 30): number {
    const pageHeight = doc.internal.pageSize.getHeight();
    if (y + needed > pageHeight - 14) {
        doc.addPage();
        return 20;
    }
    return y;
}

function addTitle(doc: jsPDF, text: string, y: number): number {
    doc.setFontSize(16);
    doc.setTextColor(31, 41, 55);
    doc.text(text, 14, y);
    return y + 8;
}

function addSectionHeading(doc: jsPDF, text: string, y: number): number {
    doc.setFontSize(12);
    doc.setTextColor(210, 138, 68);
    doc.text(text, 14, y);
    return y + 6;
}

function addKeyValueTable(doc: jsPDF, rows: [string, string][], y: number): number {
    autoTable(doc, {
        startY: y,
        body: rows,
        theme: "plain",
        styles: { fontSize: 10, cellPadding: 2 },
        columnStyles: { 0: { fontStyle: "bold", cellWidth: 65 } },
    });
    return (doc as any).lastAutoTable.finalY + 8;
}

function addTable(doc: jsPDF, head: string[], body: (string | number)[][], y: number): number {
    autoTable(doc, {
        startY: y,
        head: [head],
        body,
        theme: "striped",
        headStyles: { fillColor: [210, 138, 68] },
        styles: { fontSize: 9 },
    });
    return (doc as any).lastAutoTable.finalY + 8;
}

export type ReportSection = {
    title: string;
    districtComparison?: Array<Record<string, any>>;
    priceTrend?: Array<Record<string, any>>;
    snapshot?: Record<string, any> | null;
    overview?: Record<string, any> | null;
    dealResult?: Record<string, any> | null;
};

export function buildReportPdf(opts: {
    reportName: string;
    district?: string;
    propertyType?: string;
    period?: string;
    sections: ReportSection[];
}): jsPDF {
    const doc = new jsPDF();
    let y = 20;

    y = addTitle(doc, opts.reportName, y);
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text(`Generated: ${new Date().toLocaleString("en-GB")}`, 14, y);
    y += 6;
    if (opts.district) {
        doc.text(`District: ${opts.district}`, 14, y);
        y += 6;
    }
    if (opts.propertyType) {
        doc.text(`Property Type: ${opts.propertyType}`, 14, y);
        y += 6;
    }
    if (opts.period) {
        doc.text(`Period: ${opts.period}`, 14, y);
        y += 6;
    }
    y += 4;

    for (const section of opts.sections) {
        y = ensureSpace(doc, y, 30);
        y = addSectionHeading(doc, section.title, y);

        if (section.districtComparison?.length) {
            const head = ["District", "Avg ROI", "Rental Yield", "Avg Price/SQM", "Transactions", "Trend", "Signal"];
            const body = section.districtComparison.map((r) => [
                r.districtName ?? r.district ?? "-",
                r.avgRoi != null ? `${Number(r.avgRoi).toFixed(1)}%` : "-",
                r.avgRentalYield != null ? `${Number(r.avgRentalYield).toFixed(1)}%` : "-",
                r.avgPricePerSqm != null ? `AED ${Math.round(r.avgPricePerSqm).toLocaleString()}` : "-",
                r.totalTransactions != null ? Number(r.totalTransactions).toLocaleString() : "-",
                r.trendDirection ?? "-",
                r.marketSignal ?? "-",
            ]);
            y = ensureSpace(doc, y, 20);
            y = addTable(doc, head, body, y);
        }

        if (section.priceTrend?.length) {
            const head = ["Month", "District", "Avg Price / SQM"];
            const body = section.priceTrend.map((r) => [
                r.month ?? "-",
                r.district ?? "-",
                r.avgPricePerSqm != null ? `AED ${Math.round(r.avgPricePerSqm).toLocaleString()}` : "-",
            ]);
            y = ensureSpace(doc, y, 20);
            y = addTable(doc, head, body, y);
        }

        if (section.snapshot) {
            const entries = Object.entries(section.snapshot).filter(([, v]) => v != null && typeof v !== "object");
            if (entries.length) {
                y = ensureSpace(doc, y, 20);
                y = addKeyValueTable(doc, entries.map(([k, v]) => [humanizeKey(k), String(v)]), y);
            }
        }

        if (section.overview) {
            const entries = Object.entries(section.overview).filter(([, v]) => v != null && typeof v !== "object");
            if (entries.length) {
                y = ensureSpace(doc, y, 20);
                y = addKeyValueTable(doc, entries.map(([k, v]) => [humanizeKey(k), String(v)]), y);
            }
        }

        if (section.dealResult) {
            const d = section.dealResult;
            const rows: [string, string][] = [
                ["Deal Score", d.dealScore != null ? String(d.dealScore) : "-"],
                ["Verdict", d.dealVerdictLabel ?? "-"],
                ["Asking Price", d.askingPriceAed != null ? `AED ${Number(d.askingPriceAed).toLocaleString()}` : "-"],
                ["Estimated Market Price", d.estimatedMarketPriceAed != null ? `AED ${Number(d.estimatedMarketPriceAed).toLocaleString()}` : "-"],
                ["Price Position", d.pricePositionPct != null ? `${Number(d.pricePositionPct).toFixed(1)}% (${d.pricePositionLabel ?? "-"})` : "-"],
                ["Market Verdict", d.marketVerdict ?? "-"],
                ["Avg Price / SQM", d.avgPricePerSqm != null ? `AED ${Math.round(d.avgPricePerSqm).toLocaleString()}` : "-"],
                ["Comparable Transactions", d.comparableTransactions != null ? String(d.comparableTransactions) : "-"],
                ["District Trend", d.districtTrend ?? "-"],
                ["Demand Activity", d.demandActivity ?? "-"],
                ["ROI", d.roi != null ? `${Number(d.roi).toFixed(1)}%` : "-"],
                ["Rental Yield", d.rentalYield != null ? `${Number(d.rentalYield).toFixed(1)}%` : "-"],
            ];
            y = ensureSpace(doc, y, 20);
            y = addKeyValueTable(doc, rows, y);
        }

        y += 4;
    }

    return doc;
}
