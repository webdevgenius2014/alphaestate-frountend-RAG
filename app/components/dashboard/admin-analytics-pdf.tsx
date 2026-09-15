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
    statValue: { fontSize: 15, fontWeight: 700 },
    kvRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, borderBottom: "1pt solid #F3F4F6" },
    kvLabel: { fontSize: 9 },
    kvValue: { fontSize: 9, fontWeight: 700 },
    table: { border: "1pt solid #E5E7EB" },
    tr: { flexDirection: "row", borderBottom: "1pt solid #E5E7EB" },
    th: { flex: 1, padding: 4, fontSize: 8, fontWeight: 700, backgroundColor: "#F3F4F6" },
    td: { flex: 1, padding: 4, fontSize: 8 },
});

export type AdminAnalyticsPdfData = {
    userName: string;
    dateLabel: string;
    filters: { period: string; district: string; propertyType: string };
    stats: Array<{ label: string; value: string }>;
    platformGrowth: Array<{ month: string; totalUsers: number; activeSubscribers: number }>;
    districtPerformance: Array<{ district: string; avgRoi: number }>;
    subscriptionPerformance: Array<{ planName: string; count: number; percentage: number }>;
    investmentMovement: { months: string[]; series: Array<{ district: string; data: number[] }> } | null;
    appreciationPotential: {
        summary?: { avgPriceSqm?: number } | null;
        districts: Array<{ name: string; avgRoi: number; totalTransactions: number }>;
    } | null;
    aiMetrics: Array<{ label: string; value: string }>;
    usage: Array<{ tool: string; count: number }>;
};

function AdminAnalyticsPdfDocument({ data }: { data: AdminAnalyticsPdfData }) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <PdfWatermark />
                <Text style={styles.title}>Analytics Export</Text>
                <Text style={styles.subtitle}>
                    {data.userName} · {data.dateLabel}
                    {data.filters.period ? ` · ${data.filters.period}` : ""}
                    {data.filters.district ? ` · ${data.filters.district}` : ""}
                    {data.filters.propertyType ? ` · ${data.filters.propertyType}` : ""}
                </Text>

                <Text style={styles.sectionTitle}>Overview</Text>
                <View style={styles.statGrid}>
                    {data.stats.map((s) => (
                        <View key={s.label} style={styles.statCard}>
                            <Text style={styles.statLabel}>{s.label}</Text>
                            <Text style={styles.statValue}>{s.value}</Text>
                        </View>
                    ))}
                </View>

                {data.platformGrowth.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Platform Growth Trends</Text>
                        <View style={styles.table}>
                            <View style={styles.tr}>
                                <Text style={styles.th}>Month</Text>
                                <Text style={styles.th}>Total Users</Text>
                                <Text style={styles.th}>Active Subscribers</Text>
                            </View>
                            {data.platformGrowth.map((row, i) => (
                                <View key={i} style={styles.tr}>
                                    <Text style={styles.td}>{row.month}</Text>
                                    <Text style={styles.td}>{row.totalUsers.toLocaleString()}</Text>
                                    <Text style={styles.td}>{row.activeSubscribers.toLocaleString()}</Text>
                                </View>
                            ))}
                        </View>
                    </>
                )}

                {data.districtPerformance.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>District Performance Analytics</Text>
                        <View style={styles.table}>
                            <View style={styles.tr}>
                                <Text style={styles.th}>District</Text>
                                <Text style={styles.th}>Avg ROI</Text>
                            </View>
                            {data.districtPerformance.map((row, i) => (
                                <View key={i} style={styles.tr}>
                                    <Text style={styles.td}>{row.district}</Text>
                                    <Text style={styles.td}>{row.avgRoi}%</Text>
                                </View>
                            ))}
                        </View>
                    </>
                )}

                {data.subscriptionPerformance.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Subscription Performance</Text>
                        <View style={styles.table}>
                            <View style={styles.tr}>
                                <Text style={styles.th}>Plan</Text>
                                <Text style={styles.th}>Subscribers</Text>
                                <Text style={styles.th}>Share</Text>
                            </View>
                            {data.subscriptionPerformance.map((row, i) => (
                                <View key={i} style={styles.tr}>
                                    <Text style={styles.td}>{row.planName}</Text>
                                    <Text style={styles.td}>{row.count.toLocaleString()}</Text>
                                    <Text style={styles.td}>{row.percentage}%</Text>
                                </View>
                            ))}
                        </View>
                    </>
                )}

                {data.investmentMovement && data.investmentMovement.months.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Investment Movement</Text>
                        <View style={styles.table}>
                            <View style={styles.tr}>
                                <Text style={styles.th}>Month</Text>
                                {data.investmentMovement.series.map((s, i) => (
                                    <Text key={i} style={styles.th}>{s.district}</Text>
                                ))}
                            </View>
                            {data.investmentMovement.months.map((month, mi) => (
                                <View key={mi} style={styles.tr}>
                                    <Text style={styles.td}>{month}</Text>
                                    {data.investmentMovement!.series.map((s, si) => (
                                        <Text key={si} style={styles.td}>
                                            AED {Math.round((s.data[mi] ?? 0) / 1_000_000).toLocaleString()}M
                                        </Text>
                                    ))}
                                </View>
                            ))}
                        </View>
                    </>
                )}

                {data.appreciationPotential && data.appreciationPotential.districts.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Appreciation Potential</Text>
                        {data.appreciationPotential.summary?.avgPriceSqm != null && (
                            <Text style={{ fontSize: 8, color: "#6B7280", marginBottom: 6 }}>
                                Avg Price/sqm: {data.appreciationPotential.summary.avgPriceSqm.toLocaleString()}
                            </Text>
                        )}
                        <View style={styles.table}>
                            <View style={styles.tr}>
                                <Text style={styles.th}>District</Text>
                                <Text style={styles.th}>Avg ROI</Text>
                                <Text style={styles.th}>Transactions</Text>
                            </View>
                            {data.appreciationPotential.districts.map((row, i) => (
                                <View key={i} style={styles.tr}>
                                    <Text style={styles.td}>{row.name}</Text>
                                    <Text style={styles.td}>{row.avgRoi}%</Text>
                                    <Text style={styles.td}>{row.totalTransactions.toLocaleString()}</Text>
                                </View>
                            ))}
                        </View>
                    </>
                )}

                <Text style={styles.sectionTitle}>AI Intelligence Performance</Text>
                {data.aiMetrics.map((m) => (
                    <View key={m.label} style={styles.kvRow}>
                        <Text style={styles.kvLabel}>{m.label}</Text>
                        <Text style={styles.kvValue}>{m.value}</Text>
                    </View>
                ))}

                {data.usage.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Report & Deal Analyzer Usage</Text>
                        <View style={styles.table}>
                            <View style={styles.tr}>
                                <Text style={styles.th}>Tool</Text>
                                <Text style={styles.th}>Usage</Text>
                            </View>
                            {data.usage.map((row, i) => (
                                <View key={i} style={styles.tr}>
                                    <Text style={styles.td}>{row.tool}</Text>
                                    <Text style={styles.td}>{row.count.toLocaleString()}</Text>
                                </View>
                            ))}
                        </View>
                    </>
                )}
            </Page>
        </Document>
    );
}

export async function generateAdminAnalyticsPdfBlob(data: AdminAnalyticsPdfData): Promise<Blob> {
    return await pdf(<AdminAnalyticsPdfDocument data={data} />).toBlob();
}
