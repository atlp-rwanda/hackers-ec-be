import React from "react";
import { renderToStream } from "@react-pdf/renderer";

export async function generatePDF(
	element: React.ReactElement,
): Promise<Buffer> {
	const stream = await renderToStream(element);
	return new Promise((resolve, reject) => {
		const chunks: Uint8Array[] = [];
		stream.on("data", (chunk) => chunks.push(chunk));
		stream.on("end", () => resolve(Buffer.concat(chunks)));
		stream.on("error", reject);
	});
}
