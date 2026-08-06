import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import { PdfWatermark } from "./pdf-watermark";

const styles = StyleSheet.create({
    page: { padding: 48, fontSize: 10, fontFamily: "Helvetica", color: "#111827" },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 32,
        paddingBottom: 20,
        borderBottom: "2pt solid #D28A44",
    },
    brand: { fontSize: 18, fontWeight: 700, color: "#D28A44" },
    invMetaTitle: { fontSize: 22, fontWeight: 700, textAlign: "right" },
    invMetaSub: { fontSize: 10, color: "#6B7280", marginTop: 4, textAlign: "right" },
    section: { marginBottom: 22 },
    sectionTitle: { fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#9CA3AF", marginBottom: 8 },
    row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 7, borderBottom: "1pt solid #F3F4F6" },
    lbl: { fontSize: 10, color: "#6B7280" },
    val: { fontSize: 10, fontWeight: 700 },
    amountBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#FDF6EE",
        border: "1pt solid #D28A44",
        borderRadius: 6,
        padding: 14,
        marginTop: 18,
    },
    amtLbl: { fontSize: 12, fontWeight: 700, color: "#D28A44" },
    amtVal: { fontSize: 18, fontWeight: 700, color: "#D28A44" },
    badge: {
        fontSize: 9,
        fontWeight: 700,
        paddingVertical: 3,
        paddingHorizontal: 8,
        borderRadius: 3,
        backgroundColor: "#5E9F622E",
        color: "#5E9F62",
    },
    footer: { marginTop: 32, paddingTop: 12, borderTop: "1pt solid #F3F4F6", textAlign: "center", fontSize: 8, color: "#9CA3AF" },
});

export type InvoicePdfData = {
    invoiceNumber: string;
    userName: string;
    userEmail: string;
    planName: string;
    billingCycle: string;
    paymentDate: string;
    status: string;
    amountLabel: string;
};

function InvoicePdfDocument({ data }: { data: InvoicePdfData }) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <PdfWatermark />

                <View style={styles.header}>
                    <Text style={styles.brand}>Alpha Estate</Text>
                    <View>
                        <Text style={styles.invMetaTitle}>INVOICE</Text>
                        <Text style={styles.invMetaSub}>{data.invoiceNumber}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Billed To</Text>
                    <View style={styles.row}>
                        <Text style={styles.lbl}>Name</Text>
                        <Text style={styles.val}>{data.userName || "-"}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.lbl}>Email</Text>
                        <Text style={styles.val}>{data.userEmail || "-"}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Invoice Details</Text>
                    <View style={styles.row}>
                        <Text style={styles.lbl}>Invoice No.</Text>
                        <Text style={styles.val}>{data.invoiceNumber}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.lbl}>Plan</Text>
                        <Text style={styles.val}>{data.planName}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.lbl}>Billing Cycle</Text>
                        <Text style={styles.val}>{data.billingCycle}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.lbl}>Payment Date</Text>
                        <Text style={styles.val}>{data.paymentDate}</Text>
                    </View>
                    <View style={{ ...styles.row, borderBottom: "none" }}>
                        <Text style={styles.lbl}>Status</Text>
                        <Text style={styles.badge}>{data.status}</Text>
                    </View>
                </View>

                <View style={styles.amountBox}>
                    <Text style={styles.amtLbl}>Total Amount</Text>
                    <Text style={styles.amtVal}>{data.amountLabel}</Text>
                </View>

                <Text style={styles.footer}>System-generated invoice · Alpha Estate · {new Date().getFullYear()}</Text>
            </Page>
        </Document>
    );
}

export async function generateInvoicePdfBlob(data: InvoicePdfData): Promise<Blob> {
    return await pdf(<InvoicePdfDocument data={data} />).toBlob();
}
