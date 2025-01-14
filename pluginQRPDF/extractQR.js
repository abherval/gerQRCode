const { PDFDocument } = require('pdf-lib');
const jsQR = require('jsqr');
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

async function extractQRFromPDF(pdfPath) {
    // Ler o arquivo PDF
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const qrCodes = [];

    // Iterar por cada página
    const pages = pdfDoc.getPages();
    for (const page of pages) {
        const { width, height } = page.getSize();
        const canvas = createCanvas(width, height);
        const context = canvas.getContext('2d');

        // Renderizar a página no canvas
        const imageBytes = await page.renderToImage();
        const img = await loadImage(imageBytes);
        context.drawImage(img, 0, 0, width, height);

        // Converter o canvas para uma imagem
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        // Decodificar os códigos QR da imagem
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
        if (qrCode) {
            qrCodes.push(qrCode.data);
        }
    }

    return qrCodes;
}

// Exemplo de uso
const pdfPath = 'example.pdf'; // Substitua pelo caminho do seu arquivo PDF
extractQRFromPDF(pdfPath).then(qrCodes => {
    qrCodes.forEach((qrCode, index) => {
        console.log(`QR Code ${index + 1}: ${qrCode}`);
    });
});