import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import os from "os";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("pdfFile");

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const fileBytes = await file.arrayBuffer();
        const buffer = Buffer.from(fileBytes);

        const tempDir = os.tmpdir();
        const tempFilePath = path.join(tempDir, `${Date.now()}-${file.name}`);

        await writeFile(tempFilePath, buffer);

        const loader = new PDFLoader(tempFilePath, { splitPages: false });
        const docs = await loader.load();

        const extractedText = docs.map((doc) => doc.pageContent).join("\n\n");

        await unlink(tempFilePath);

        return NextResponse.json({ text: extractedText }, { status: 200 });
    } catch (error) {
        console.error("Error extracting text:", error);
        return NextResponse.json({ error: "Failed to process PDF" }, { status: 500 });
    }
}
