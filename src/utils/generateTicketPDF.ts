import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { Bilhete } from '../types';
import logoImg from '../assets/images/royal_express_official_logo_1791024796263.jpg';

export async function generateTicketPDF(bilhete: Bilhete) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 15;
  const contentWidth = pageWidth - margin * 2; // 180mm

  // Brand Colors
  const bordeaux = '#440717';
  const navy = '#111E2E';
  const red = '#A7193D';
  const gold = '#D4AF37';

  // 1. Outer Ticket Border Card
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, margin, contentWidth, 260, 4, 4, 'FD');

  // 2. Header Navy Banner
  doc.setFillColor(17, 30, 46); // #111E2E
  doc.rect(margin, margin, contentWidth, 38, 'F');

  // Decorative Top Accent Line (Gold & Red)
  doc.setFillColor(212, 175, 55); // Gold
  doc.rect(margin, margin, contentWidth, 2, 'F');

  // White Card Plaque holding the Official Royal Express Logo Unchanged
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(220, 220, 220);
  doc.roundedRect(margin + 6, margin + 5, 82, 28, 2, 2, 'FD');

  try {
    doc.addImage(logoImg, 'JPEG', margin + 8, margin + 6, 78, 26);
  } catch (e) {
    console.error('Error adding logo to PDF:', e);
  }

  // Ticket Number Tag (Right header)
  doc.setFillColor(68, 7, 23);
  doc.roundedRect(pageWidth - margin - 55, margin + 10, 50, 18, 2, 2, 'F');
  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('BILHETE Nº', pageWidth - margin - 30, margin + 16, { align: 'center' });
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text(bilhete.numeroBilhete, pageWidth - margin - 30, margin + 23, { align: 'center' });

  // 3. Route Banner Strip (Bordeaux)
  const routeY = margin + 38;
  doc.setFillColor(68, 7, 23); // #440717
  doc.rect(margin, routeY, contentWidth, 18, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  const routeText = `${bilhete.origem.toUpperCase()}  →  ${bilhete.destino.toUpperCase()}`;
  doc.text(routeText, margin + 10, routeY + 11.5);

  // Status Badge in Route Strip
  doc.setFillColor(22, 163, 74); // Emerald Green
  doc.roundedRect(pageWidth - margin - 38, routeY + 4, 30, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text('PAGO', pageWidth - margin - 23, routeY + 10.5, { align: 'center' });

  // 4. Content Layout: Left Details Table, Right QR Code Box
  const contentY = routeY + 24;

  // Generate QR Code data URL
  const validationUrl = `${window.location.origin}/validar/${encodeURIComponent(bilhete.numeroBilhete)}`;
  let qrDataUrl = '';
  try {
    qrDataUrl = await QRCode.toDataURL(validationUrl, {
      margin: 1,
      width: 300,
      color: {
        dark: '#111E2E',
        light: '#FFFFFF'
      }
    });
  } catch (err) {
    console.error('Falha ao gerar QR Code para o PDF:', err);
  }

  // Left Details Table
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  const leftX = margin + 8;
  const labelWidth = 45;
  const valueX = leftX + labelWidth;

  const rows = [
    { label: 'Data de Viagem:', value: bilhete.dataViagem, bold: true },
    { label: 'Hora de Partida:', value: `${bilhete.horaPartida} (${bilhete.duracaoEstimada})`, bold: true },
    { label: 'Lugar Marcado:', value: `LUGAR Nº ${bilhete.lugarNumero < 10 ? '0' + bilhete.lugarNumero : bilhete.lugarNumero}`, bold: true, highlight: true },
    { label: 'Nome do Passageiro:', value: bilhete.passageiro, bold: true },
    { label: 'Telefone:', value: bilhete.telefone },
    { label: 'Nº do BI / Doc:', value: bilhete.numeroBi || 'Não especificado' },
    { label: 'Viatura Designada:', value: `${bilhete.viatura} (${bilhete.viaturaMatricula})` },
    { label: 'Código de Reserva:', value: bilhete.codigoReserva },
    { label: 'Valor da Tarifa:', value: `${bilhete.valor.toLocaleString('pt-AO')} Kz`, bold: true },
    { label: 'Data de Emissão:', value: new Date(bilhete.emitidoEm).toLocaleString('pt-PT') }
  ];

  let currentY = contentY;
  rows.forEach((row, idx) => {
    // Alternating zebra row backgrounds
    if (idx % 2 === 0) {
      doc.setFillColor(248, 249, 250);
      doc.rect(leftX - 3, currentY - 5, 115, 8.5, 'F');
    }

    doc.setTextColor(110, 110, 110);
    doc.setFont('helvetica', 'normal');
    doc.text(row.label, leftX, currentY);

    if (row.highlight) {
      doc.setTextColor(68, 7, 23);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(row.value, valueX, currentY);
      doc.setFontSize(10);
    } else if (row.bold) {
      doc.setTextColor(20, 20, 20);
      doc.setFont('helvetica', 'bold');
      doc.text(row.value, valueX, currentY);
    } else {
      doc.setTextColor(40, 40, 40);
      doc.setFont('helvetica', 'normal');
      doc.text(row.value, valueX, currentY);
    }

    currentY += 9;
  });

  // Right Side: QR Code Container
  const qrBoxX = pageWidth - margin - 58;
  const qrBoxY = contentY - 4;
  const qrBoxWidth = 52;
  const qrBoxHeight = 85;

  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(215, 215, 215);
  doc.roundedRect(qrBoxX, qrBoxY, qrBoxWidth, qrBoxHeight, 3, 3, 'FD');

  doc.setTextColor(17, 30, 46);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('VALIDAÇÃO OFICIAL', qrBoxX + qrBoxWidth / 2, qrBoxY + 8, { align: 'center' });

  if (qrDataUrl) {
    doc.addImage(qrDataUrl, 'PNG', qrBoxX + 6, qrBoxY + 11, 40, 40);
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 100);
  doc.text('Aponte a câmara do telemóvel', qrBoxX + qrBoxWidth / 2, qrBoxY + 56, { align: 'center' });
  doc.text('para validar a autenticidade', qrBoxX + qrBoxWidth / 2, qrBoxY + 60, { align: 'center' });

  doc.setFont('courier', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(68, 7, 23);
  doc.text(bilhete.numeroBilhete, qrBoxX + qrBoxWidth / 2, qrBoxY + 69, { align: 'center' });

  doc.setFillColor(22, 163, 74);
  doc.roundedRect(qrBoxX + 8, qrBoxY + 73, qrBoxWidth - 16, 7, 1.5, 1.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('BILHETE VÁLIDO', qrBoxX + qrBoxWidth / 2, qrBoxY + 77.5, { align: 'center' });

  // 5. Divider with dashed line
  const dividerY = currentY + 6;
  doc.setDrawColor(200, 200, 200);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(margin + 5, dividerY, pageWidth - margin - 5, dividerY);
  doc.setLineDashPattern([], 0); // reset to solid

  // 6. Boarding & Safety Instructions (Instruções ao Passageiro)
  const instructY = dividerY + 8;
  doc.setTextColor(68, 7, 23);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('INFORMAÇÕES IMPORTANTES AO PASSAGEIRO', margin + 8, instructY);

  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  const instructions = [
    '• Compareça no terminal com pelo menos 30 minutos de antecedência ao horário de partida agendado.',
    '• É obrigatória a apresentação deste bilhete digital (em PDF no telemóvel) ou impresso acompanhado de documento de identificação original.',
    '• Bagagem permitida: 1 mala de porão até 25 kg e 1 mala de mão até 5 kg por passageiro.',
    '• O bilhete é pessoal e intransmissível após emissão. Qualquer alteração deverá ser solicitada até 24 horas antes da viagem.',
    '• Linha de Apoio ao Cliente & Terminais: +244 931 324 022 / +244 954 631 145 · Email: comercial@royalexpress.ao'
  ];

  let instructLineY = instructY + 6;
  instructions.forEach((inst) => {
    doc.text(inst, margin + 8, instructLineY);
    instructLineY += 5;
  });

  // 7. Footer Bar (Terminal Gamek & Copyright)
  const footerY = margin + 260 - 18;
  doc.setFillColor(245, 245, 247);
  doc.rect(margin, footerY, contentWidth, 18, 'F');

  doc.setDrawColor(220, 220, 220);
  doc.line(margin, footerY, pageWidth - margin, footerY);

  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Terminal Principal: Gamek, Nosso Centro, Luanda - Angola · www.royalexpress.ao', margin + 8, footerY + 7);
  doc.text('Documento gerado electronicamente · Royal Express Transportes, LDA · Todos os direitos reservados.', margin + 8, footerY + 12);

  // 8. Save/Download File
  const filename = `Bilhete_RoyalExpress_${bilhete.numeroBilhete}.pdf`;
  doc.save(filename);
  return filename;
}
