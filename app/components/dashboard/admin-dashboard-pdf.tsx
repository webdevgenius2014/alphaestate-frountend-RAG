import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";

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
    kvRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, borderBottom: "1pt solid #F3F4F6" },
    kvLabel: { fontSize: 9 },
    kvValue: { fontSize: 9, fontWeight: 700 },
    table: { border: "1pt solid #E5E7EB" },
    tr: { flexDirection: "row", borderBottom: "1pt solid #E5E7EB" },
    th: { flex: 1, padding: 4, fontSize: 8, fontWeight: 700, backgroundColor: "#F3F4F6" },
    td: { flex: 1, padding: 4, fontSize: 8 },
    serviceRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, borderBottom: "1pt solid #F3F4F6" },
});

export type AdminDashboardPdfData = {
    userName: string;
    dateLabel: string;
    stats: Array<{ label: string; value: string; change: string }>;
    operationalItems: Array<{ label: string; value: string }>;
    aiMetrics: Array<{ label: string; value: string }>;
    recentActivity: Array<{ userName?: string; action: string; module: string; time: string }>;
    liveActivity: Array<{ label: string; value: string }>;
    systemServices: Array<{ name: string; status: string; sub: string }>;
};

function AdminDashboardPdfDocument({ data }: { data: AdminDashboardPdfData }) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>Admin Dashboard Export</Text>
                <Text style={styles.subtitle}>{data.userName} · {data.dateLabel}</Text>

                <Text style={styles.sectionTitle}>Top Stats</Text>
                <View style={styles.statGrid}>
                    {data.stats.map((s) => (
                        <View key={s.label} style={styles.statCard}>
                            <Text style={styles.statLabel}>{s.label}</Text>
                            <Text style={styles.statValue}>{s.value}</Text>
                            <Text style={styles.statSub}>{s.change}</Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Operational Intelligence</Text>
                {data.operationalItems.map((item) => (
                    <View key={item.label} style={styles.kvRow}>
                        <Text style={styles.kvLabel}>{item.label}</Text>
                        <Text style={styles.kvValue}>{item.value}</Text>
                    </View>
                ))}

                <Text style={styles.sectionTitle}>AI Intelligence Performance</Text>
                {data.aiMetrics.map((m) => (
                    <View key={m.label} style={styles.kvRow}>
                        <Text style={styles.kvLabel}>{m.label}</Text>
                        <Text style={styles.kvValue}>{m.value}</Text>
                    </View>
                ))}

                <Text style={styles.sectionTitle}>Today's Activity</Text>
                {data.liveActivity.map((item) => (
                    <View key={item.label} style={styles.kvRow}>
                        <Text style={styles.kvLabel}>{item.label}</Text>
                        <Text style={styles.kvValue}>{item.value}</Text>
                    </View>
                ))}

                <Text style={styles.sectionTitle}>Recent Platform Activity</Text>
                <View style={styles.table}>
                    <View style={styles.tr}>
                        <Text style={styles.th}>User</Text>
                        <Text style={styles.th}>Action</Text>
                        <Text style={styles.th}>Module</Text>
                        <Text style={styles.th}>Time</Text>
                    </View>
                    {data.recentActivity.map((row, i) => (
                        <View key={i} style={styles.tr}>
                            <Text style={styles.td}>{row.userName ?? "-"}</Text>
                            <Text style={styles.td}>{row.action}</Text>
                            <Text style={styles.td}>{row.module}</Text>
                            <Text style={styles.td}>{row.time}</Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>System Monitoring</Text>
                {data.systemServices.map((svc) => (
                    <View key={svc.name} style={styles.serviceRow}>
                        <Text style={styles.kvLabel}>{svc.name}</Text>
                        <Text style={styles.kvValue}>{svc.status}</Text>
                    </View>
                ))}
            </Page>
        </Document>
    );
}

export async function generateAdminDashboardPdfBlob(data: AdminDashboardPdfData): Promise<Blob> {
    return await pdf(<AdminDashboardPdfDocument data={data} />).toBlob();
}
