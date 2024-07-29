import React from "react";
import {
	Document,
	Page,
	Text,
	View,
	Image,
	StyleSheet,
} from "@react-pdf/renderer";
import { generatePDF } from "../utils/pdfGenerator";
import { cartItem } from "../types/cart";
import { UserModelAttributes } from "../types/model";

interface InvoiceData {
	products: cartItem[];
	clientAddress: UserModelAttributes;
	companyAddress: string;
	logoUrl?: string;
	invoiceNumber: string;
	date: string;
}

const styles = StyleSheet.create({
	page: { padding: 30, fontFamily: "Helvetica" },
	header: {
		flexDirection: "row",
		marginBottom: 30,
		alignItems: "center",
		justifyContent: "space-between",
	},
	logo: { width: 60, height: 60 },
	title: { fontSize: 24, fontWeight: "bold" },
	invoiceInfo: { flexDirection: "column", alignItems: "flex-end" },
	invoiceInfoText: { fontSize: 10, marginBottom: 5 },
	addressSection: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 30,
	},
	addressBlock: { width: "45%" },
	addressTitle: { fontSize: 12, fontWeight: "bold", marginBottom: 5 },
	address: { fontSize: 10, lineHeight: 1.5 },
	table: { flexGrow: 1 },
	tableHeader: {
		flexDirection: "row",
		borderBottomColor: "#bff0fd",
		backgroundColor: "#bff0fd",
		borderBottomWidth: 1,
		alignItems: "center",
		height: 24,
		textAlign: "center",
		fontStyle: "bold",
	},
	tableRow: {
		flexDirection: "row",
		borderBottomColor: "#bff0fd",
		borderBottomWidth: 1,
		alignItems: "center",
		height: 24,
	},
	tableHeaderCell: { width: "20%", fontSize: 10 },
	tableCell: { width: "20%", textAlign: "center", fontSize: 10 },
	productImage: { width: 20, height: 20, borderRadius: 10 },
	total: { marginTop: 30, flexDirection: "row", justifyContent: "flex-end" },
	totalText: { fontWeight: "bold", fontSize: 14 },
	totalAmount: { fontWeight: "bold", fontSize: 14, marginLeft: 10 },
});

const InvoiceDocument: React.FC<{ data: InvoiceData }> = ({ data }) => (
	<Document>
		<Page size="A4" style={styles.page}>
			{/* Header */}
			<View style={styles.header}>
				<Image style={styles.logo} src={data.logoUrl} />
				<View style={styles.invoiceInfo}>
					<Text style={styles.title}>Invoice</Text>
					<Text style={styles.invoiceInfoText}>
						Date: {new Date(Date.now()).toLocaleString()}
					</Text>
				</View>
			</View>

			{/* Addresses */}
			<View style={styles.addressSection}>
				<View style={styles.addressBlock}>
					<Text style={styles.addressTitle}>Bill To:</Text>
					<Text style={styles.address}>
						Fullname: {data.clientAddress.firstName}{" "}
						{data.clientAddress.lastName}
					</Text>
					<Text style={styles.address}>Email: {data.clientAddress.email}</Text>
					<Text style={styles.address}>
						Phone Number: {data.clientAddress.phoneNumber}
					</Text>
					<Text style={styles.address}>
						Address: {data.clientAddress.addressLine1},{" "}
						{data.clientAddress.addressLine2}
					</Text>
				</View>
				<View style={styles.addressBlock}>
					<Text style={styles.addressTitle}>From:</Text>
					<Text style={styles.address}>ShopTrove</Text>
					<Text style={styles.address}>Address: {data.companyAddress}</Text>
					<Text style={styles.address}>Email:info@shoptrove.com</Text>
					<Text style={styles.address}>Phone Number: +250 788888888</Text>
				</View>
			</View>

			{/* Product Table */}
			<View style={styles.table}>
				<View style={styles.tableHeader}>
					<Text style={styles.tableHeaderCell}>Image</Text>
					<Text style={styles.tableHeaderCell}>Name</Text>
					<Text style={styles.tableHeaderCell}>Price</Text>
					<Text style={styles.tableHeaderCell}>Quantity</Text>
					<Text style={styles.tableHeaderCell}>Total</Text>
				</View>
				{data.products.map((product, index) => (
					<View style={styles.tableRow} key={index}>
						<View style={styles.tableCell}>
							<Image style={styles.productImage} src={product.image} />
						</View>
						<Text style={styles.tableCell}>{product.name}</Text>
						<Text style={styles.tableCell}>
							{(
								product.price -
								(product.price * product.discount) / 100
							).toFixed(2)}{" "}
							Rwf
						</Text>
						<Text style={styles.tableCell}>{product.quantity}</Text>
						<Text style={styles.tableCell}>
							{(
								(product.price - (product.price * product.discount) / 100) *
								product.quantity
							).toFixed(2)}{" "}
							Rwf
						</Text>
					</View>
				))}
			</View>

			{/* Total */}
			<View style={styles.total}>
				<Text style={styles.totalText}>Total:</Text>
				<Text style={styles.totalAmount}>
					{data.products
						.reduce((sum, product) => {
							const discountedPrice =
								product.price - (product.price * product.discount) / 100;
							return sum + discountedPrice * product.quantity;
						}, 0)
						.toFixed(2)}{" "}
					Rwf
				</Text>
			</View>
		</Page>
	</Document>
);

export async function generateInvoice(data: InvoiceData): Promise<Buffer> {
	return await generatePDF(<InvoiceDocument data={data} />);
}
