import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import { PdfWatermark } from "./pdf-watermark";

const styles = StyleSheet.create({
    page: { padding: 32, fontSize: 10, fontFamily: "Helvetica" },
    title: { fontSize: 18, marginBottom: 4, fontWeight: 700 },
    subtitle: { fontSize: 10, color: "#6B7280", marginBottom: 20 },
    sectionTitle: { fontSize: 13, marginTop: 18, marginBottom: 8, color: "#D28A44", fontWeight: 700 },
    scoreRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 4 },
    scoreValue: { fontSize: 28, fontWeight: 700 },
    verdictBadge: { fontSize: 10, fontWeight: 700, paddingVertical: 3, paddingHorizontal: 8, borderRadius: 3 },
    description: { fontSize: 9, color: "#6B7280", marginTop: 6, lineHeight: 1.4 },
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
    statValue: { fontSize: 12, fontWeight: 700 },
    table: { border: "1pt solid #E5E7EB" },
    tr: { flexDirection: "row", borderBottom: "1pt solid #E5E7EB" },
    th: { flex: 1, padding: 4, fontSize: 8, fontWeight: 700, backgroundColor: "#F3F4F6" },
    td: { flex: 1, padding: 4, fontSize: 8 },
});

export type DealAnalyzerPdfData = {
    userName: string;
    dateLabel: string;
    district: string;
    propertyType: string;
    saleType: string;
    score: number;
    verdictLabel: string;
    verdictColor: string;
    verdictBg: string;
    description: string;
    assessmentStats: Array<{ label: string; value: string }>;
    marketStats: Array<{ label: string; value: string }>;
    priceVsMarket: Array<{ label: string; userDeal: string; marketAvg: string }>;
    priceTrend: Array<{ month: string; price: string }>;
    comparables: Array<{ propertyType: string; district: string; pricePerSqm: string; status: string }>;
};

function DealAnalyzerPdfDocument({ data }: { data: DealAnalyzerPdfData }) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <PdfWatermark />
                <Text style={styles.title}>Deal Analyzer Report</Text>
                <Text style={styles.subtitle}>
                    {data.userName} · {data.dateLabel} · {data.district} · {data.propertyType} · {data.saleType}
                </Text>

                <Text style={styles.sectionTitle}>AI Deal Assessment</Text>
                <View style={styles.scoreRow}>
                    <Text style={styles.scoreValue}>{data.score}</Text>
                    <Text style={{ ...styles.verdictBadge, color: data.verdictColor, backgroundColor: data.verdictBg }}>
                        {data.verdictLabel}
                    </Text>
                </View>
                <Text style={styles.description}>{data.description}</Text>

                <Text style={styles.sectionTitle}>Deal Summary</Text>
                <View style={styles.statGrid}>
                    {data.assessmentStats.map((s) => (
                        <View key={s.label} style={styles.statCard}>
                            <Text style={styles.statLabel}>{s.label}</Text>
                            <Text style={styles.statValue}>{s.value}</Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Comparable Market Data</Text>
                <View style={styles.statGrid}>
                    {data.marketStats.map((m) => (
                        <View key={m.label} style={styles.statCard}>
                            <Text style={styles.statLabel}>{m.label}</Text>
                            <Text style={styles.statValue}>{m.value}</Text>
                        </View>
                    ))}
                </View>

                {data.priceVsMarket.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Price vs Market Comparison</Text>
                        <View style={styles.table}>
                            <View style={styles.tr}>
                                <Text style={styles.th}>Period</Text>
                                <Text style={styles.th}>Your Deal</Text>
                                <Text style={styles.th}>Market Avg</Text>
                            </View>
                            {data.priceVsMarket.map((row, i) => (
                                <View key={i} style={styles.tr}>
                                    <Text style={styles.td}>{row.label}</Text>
                                    <Text style={styles.td}>{row.userDeal}</Text>
                                    <Text style={styles.td}>{row.marketAvg}</Text>
                                </View>
                            ))}
                        </View>
                    </>
                )}

                {data.priceTrend.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>District Price Trend — Last 12 Months</Text>
                        <View style={styles.table}>
                            <View style={styles.tr}>
                                <Text style={styles.th}>Month</Text>
                                <Text style={styles.th}>Avg Price / SQM</Text>
                            </View>
                            {data.priceTrend.map((row, i) => (
                                <View key={i} style={styles.tr}>
                                    <Text style={styles.td}>{row.month}</Text>
                                    <Text style={styles.td}>{row.price}</Text>
                                </View>
                            ))}
                        </View>
                    </>
                )}

                <Text style={styles.sectionTitle}>Recent Comparable Transactions</Text>
                <View style={styles.table}>
                    <View style={styles.tr}>
                        <Text style={styles.th}>Property Type</Text>
                        <Text style={styles.th}>District</Text>
                        <Text style={styles.th}>Price / SQM</Text>
                        <Text style={styles.th}>Status</Text>
                    </View>
                    {data.comparables.length === 0 ? (
                        <View style={styles.tr}>
                            <Text style={styles.td}>No data found</Text>
                        </View>
                    ) : (
                        data.comparables.map((row, i) => (
                            <View key={i} style={styles.tr}>
                                <Text style={styles.td}>{row.propertyType}</Text>
                                <Text style={styles.td}>{row.district}</Text>
                                <Text style={styles.td}>{row.pricePerSqm}</Text>
                                <Text style={styles.td}>{row.status}</Text>
                            </View>
                        ))
                    )}
                </View>
            </Page>
        </Document>
    );
}

export async function generateDealAnalyzerPdfBlob(data: DealAnalyzerPdfData): Promise<Blob> {
    return await pdf(<DealAnalyzerPdfDocument data={data} />).toBlob();
}
