import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import { PdfWatermark } from "./pdf-watermark";

const styles = StyleSheet.create({
    page: { padding: 32, fontSize: 10, fontFamily: "Helvetica" },
    title: { fontSize: 18, marginBottom: 4, fontWeight: 700 },
    subtitle: { fontSize: 10, color: "#6B7280", marginBottom: 20 },
    sectionTitle: { fontSize: 13, marginTop: 18, marginBottom: 8, color: "#D28A44", fontWeight: 700 },
    statGrid: { flexDirection: "row", flexWrap: "wrap" },
    statCard: {
        width: "23.5%",
        marginRight: "2%",
        marginBottom: 8,
        border: "1pt solid #E5E7EB",
        borderRadius: 4,
        padding: 8,
    },
    statLabel: { fontSize: 8, color: "#6B7280", marginBottom: 4 },
    statValue: { fontSize: 15, fontWeight: 700, marginBottom: 2 },
    statSub: { fontSize: 7, color: "#6B7280" },
    table: { border: "1pt solid #E5E7EB" },
    tr: { flexDirection: "row", borderBottom: "1pt solid #E5E7EB" },
    th: { flex: 1, padding: 4, fontSize: 8, fontWeight: 700, backgroundColor: "#F3F4F6" },
    td: { flex: 1, padding: 4, fontSize: 8 },
    signalLine: { fontSize: 9, marginBottom: 5 },
});

export type DashboardPdfData = {
    userName: string;
    dateLabel: string;
    stats: Array<{ label: string; value: string; sub: string }>;
    topProperties: Array<{
        name: string;
        district: string;
        price: string;
        sqft: string;
        yield_: string;
        roi: string;
        status: string;
    }>;
    investmentSignals: Array<{ badge: string; title: string }>;
};

function DashboardPdfDocument({ data }: { data: DashboardPdfData }) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <PdfWatermark />
                <Text style={styles.title}>Dashboard Export</Text>
                <Text style={styles.subtitle}>{data.userName} · {data.dateLabel}</Text>

                <Text style={styles.sectionTitle}>Key Metrics</Text>
                <View style={styles.statGrid}>
                    {data.stats.map((s) => (
                        <View key={s.label} style={styles.statCard}>
                            <Text style={styles.statLabel}>{s.label}</Text>
                            <Text style={styles.statValue}>{s.value}</Text>
                            <Text style={styles.statSub}>{s.sub}</Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Top Investment Properties</Text>
                <View style={styles.table}>
                    <View style={styles.tr}>
                        <Text style={styles.th}>Property</Text>
                        <Text style={styles.th}>District</Text>
                        <Text style={styles.th}>Price</Text>
                        <Text style={styles.th}>Yield</Text>
                        <Text style={styles.th}>ROI</Text>
                        <Text style={styles.th}>Status</Text>
                    </View>
                    {data.topProperties.map((p, i) => (
                        <View key={i} style={styles.tr}>
                            <Text style={styles.td}>{p.name}</Text>
                            <Text style={styles.td}>{p.district}</Text>
                            <Text style={styles.td}>{p.price}</Text>
                            <Text style={styles.td}>{p.yield_}</Text>
                            <Text style={styles.td}>{p.roi}</Text>
                            <Text style={styles.td}>{p.status}</Text>
                        </View>
                    ))}
                </View>

                {data.investmentSignals.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Investment Signals</Text>
                        {data.investmentSignals.map((s, i) => (
                            <Text key={i} style={styles.signalLine}>• {s.badge}: {s.title}</Text>
                        ))}
                    </>
                )}
            </Page>
        </Document>
    );
}

export async function generateDashboardPdfBlob(data: DashboardPdfData): Promise<Blob> {
    return await pdf(<DashboardPdfDocument data={data} />).toBlob();
}
