import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import xlsx from "node-xlsx";

export const exportQuoteExcel = functions.https.onCall(
  async ({ tableData, quoteId }, _context) => {
    const excelDataTables = tableData.map((table: any) => {
      const { data, headers } = table;
      const excelTable = table.afterSection
        ? [
          [...headers],
          ...data.map((row: any) => [...Object.values(row)]),
          [...Object.values(table.afterSection)],
        ]
        : [[...headers], ...data.map((row: any) => [...Object.values(row)])];
      return excelTable;
    });

    const buffer = xlsx.build(
      excelDataTables.map((table: any, index: number) => ({
        name: tableData[index].title,
        data: table,
      }))
    );

    const file = admin
      .storage()
      .bucket()
      .file(quoteId + ".xlsx");
    await file.save(buffer, {
      contentType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      metadata: {
        cacheControl: "public, max-age=31536000",
      },
    });
    return file.name;
  }
);
