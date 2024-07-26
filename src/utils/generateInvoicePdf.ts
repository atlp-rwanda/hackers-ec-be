import { generateInvoice } from "../services/invoiceService";

const generateInvoicePdf = async (invoiceData: any): Promise<Buffer> => {
	let invoicePdf: Buffer;
	try {
		invoicePdf = await generateInvoice(invoiceData);
	} catch (pdfError) {
		console.error("Error generating PDF:", pdfError);
		throw new Error("Failed to generate invoice PDF");
	}
	return invoicePdf;
};

export default generateInvoicePdf;
