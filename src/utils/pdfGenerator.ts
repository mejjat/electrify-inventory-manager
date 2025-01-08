import jsPDF from "jspdf";

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  minQuantity: number;
  category: string;
  reference: string;
}

export const generateInventoryPDF = (inventory: InventoryItem[]) => {
  const doc = new jsPDF();
  let yPos = 20;

  // Add colorful header
  doc.setFillColor(138, 92, 246); // Purple
  doc.rect(0, 0, doc.internal.pageSize.width, 40, "F");
  
  // Add title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text("StockElec155 Inventory Report", 20, 25);

  // Add date
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);

  yPos = 60;

  // Add table headers with background
  doc.setFillColor(243, 244, 246); // Light gray
  doc.rect(15, yPos - 5, doc.internal.pageSize.width - 30, 10, "F");
  
  doc.setTextColor(31, 41, 55); // Dark gray
  doc.setFontSize(12);
  doc.text("Name", 20, yPos);
  doc.text("Quantity", 80, yPos);
  doc.text("Reference", 120, yPos);
  doc.text("Category", 160, yPos);
  yPos += 15;

  // Add items with alternating backgrounds
  doc.setFontSize(10);
  inventory.forEach((item, index) => {
    if (yPos > 280) {
      doc.addPage();
      yPos = 20;
    }

    // Alternate row colors
    if (index % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(15, yPos - 5, doc.internal.pageSize.width - 30, 10, "F");
    }

    // Set text color based on stock level
    if (item.quantity <= item.minQuantity) {
      doc.setTextColor(239, 68, 68); // Red for low stock
    } else if (item.quantity >= item.minQuantity * 2) {
      doc.setTextColor(34, 197, 94); // Green for high stock
    } else {
      doc.setTextColor(31, 41, 55); // Default color
    }

    doc.text(item.name.substring(0, 25), 20, yPos);
    doc.text(item.quantity.toString(), 80, yPos);
    doc.text(item.reference.substring(0, 15), 120, yPos);
    doc.text(item.category.substring(0, 15), 160, yPos);
    yPos += 10;
  });

  // Add footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setTextColor(156, 163, 175);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  return doc;
};