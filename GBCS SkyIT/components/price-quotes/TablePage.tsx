import { Stack, Title, Text, ActionIcon } from "@mantine/core";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { Eye, EyeOff } from "tabler-icons-react";
import { db } from "../../firebase";
import generateTableData from "../../helpers/price-quotes/generateTableData";
import { getMainTotals } from "../../helpers/price-quotes/getMainTotals";

export default function TablePage() {
  const router = useRouter();
  const docRef = doc(db, `priceQuotes/${router.query.id}`);
  const [quote] = useDocument(docRef);

  // The column the user is hovering on is stored in state,
  // So that the td cells in the rows can be styled
  const [hoveredColumn, setHoveredColumn] = useState(null);

  // Fetch Price Quote Document consisting of:
  // - hidden columns
  // - hidden rows
  // - hidden tables (which are actually hidden pages)
  // - a createdAt timestamp
  // - and the data for all of the tables (cols and rows)
  const tableData = useMemo(() => quote?.data()?.formData, [quote]);

  // Columns and rows are stored as objects with the table index
  // Ex: { tableIndex: 0, colIndex: 1 }
  // A function is required to see if the column/row is hidden
  const columnIsHidden = (selectedColumn): boolean =>
    !!quote
      ?.data()
      ?.hiddenColumns.find(
        (column) =>
          column.tableIndex === selectedColumn.tableIndex &&
          column.columnIndex === selectedColumn.columnIndex
      );

  const rowIsHidden = (selectedRow): boolean =>
    !!quote
      ?.data()
      ?.hiddenRows.find(
        (row) =>
          row.tableIndex === selectedRow.tableIndex &&
          row.rowIndex === selectedRow.rowIndex
      );

  // There is no table data yet, so we can't show any of the pages
  if (!tableData || Object.keys(tableData).length === 0) return null;

  return (
    <>
      {generateTableData(
        tableData,
        getMainTotals(
          tableData,
          quote?.data()?.hiddenRows,
          quote?.data()?.hiddenTables
        )
      ).map((table, tableIndex) => {
        // This function maps over each table, generating one page to fit that table
        const tableIsHidden = quote?.data()?.hiddenTables.includes(tableIndex);
        const rawVersion = router.pathname.endsWith("/raw");

        // If that table is hidden, DO NOT display the page in the raw version
        if (rawVersion && tableIsHidden) return null;

        return (
          <div
            key={tableIndex}
            className={`${tableIsHidden ? "bg-white/25" : "bg-white"
              } w-[612pt] h-[${tableIsHidden ? "20px" : "792pt"
              }] shadow-lg font-['Inter'] relative text-black mx-auto py-16 px-20 transition ${!rawVersion && "rounded-md mb-4"
              }`}
          >
            {/* Icon used to hide individual pages/table */}
            <ActionIcon
              className={`absolute -top-4 -right-4 ${rawVersion && "hidden"}`}
              size="lg"
              variant="filled"
              onClick={async () => {
                if (tableIsHidden) {
                  await updateDoc(docRef, {
                    hiddenTables: arrayRemove(tableIndex),
                  });
                } else {
                  await updateDoc(docRef, {
                    hiddenTables: arrayUnion(tableIndex),
                  });
                }
              }}
              color="red"
            >
              {tableIsHidden ? <Eye /> : <EyeOff />}
            </ActionIcon>
            {/* Table Pages */}

            <Stack
              className={
                tableIsHidden && "opacity-25 pointer-events-none select-none"
              }
            >
              <Title order={4} align="center" className="text-black">
                {table.title}
              </Title>
              <table
                key={tableIndex}
                className="table-auto min-w-full text-black border-collapse text-sm shadow-sm"
              >
                {/* IMPORTANT: Border in unstyled by default on tables, */}
                {/* so you must use the TW border-solid class to add borders */}
                {/* Generate Headers and make them interactive to hide columns */}
                <thead className="">
                  <tr>
                    {table.headers.map((header, colIndex) => {
                      const currentColumn = {
                        tableIndex,
                        columnIndex: colIndex,
                      };
                      return (
                        <th
                          key={colIndex}
                          className={`p-1.5 border-0 border-b border-gray-400 bg-gray-300 transition cursor-pointer border-solid ${columnIsHidden(currentColumn) && "opacity-50"
                            } ${JSON.stringify(hoveredColumn) ===
                            JSON.stringify(currentColumn) &&
                            "border border-green-500 bg-green-200"
                            } ${columnIsHidden(currentColumn) &&
                            rawVersion &&
                            "hidden"
                            }`}
                          onMouseEnter={() => {
                            setHoveredColumn(currentColumn);
                          }}
                          onMouseLeave={() => {
                            setHoveredColumn(null);
                          }}
                          onClick={async () => {
                            if (columnIsHidden(currentColumn)) {
                              await updateDoc(docRef, {
                                hiddenColumns: arrayRemove(currentColumn),
                              });
                            } else {
                              await updateDoc(docRef, {
                                hiddenColumns: arrayUnion(currentColumn),
                              });
                            }
                          }}
                        >
                          {header}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                {/* Generate Rows and make them interactive to hide rows */}
                <tbody>
                  {table.data.map((row, index) => {
                    const currentRow = {
                      tableIndex,
                      rowIndex: index,
                    };
                    return (
                      <tr
                        key={index}
                        className={`odd:bg-white even:bg-gray-100 text-gray-600 border-solid border-0 border-b border-gray-200 hover:bg-blue-100 hover:scale-105 hover:ring-1 ring-blue-400 transition cursor-pointer ${rowIsHidden(currentRow) && "opacity-50"
                          } ${rawVersion && rowIsHidden(currentRow) && "hidden"
                          } ${Object.keys(row).length === 0 && "h-5"}`}
                        onClick={async () => {
                          if (rowIsHidden(currentRow)) {
                            await updateDoc(docRef, {
                              hiddenRows: arrayRemove(currentRow),
                            });
                          } else {
                            await updateDoc(docRef, {
                              hiddenRows: arrayUnion(currentRow),
                            });
                          }
                        }}
                      >
                        {Object.keys(row).map((key, index) => (
                          <td
                            key={index}
                            className={`p-1.5 border-solid border-0 ${hoveredColumn?.columnIndex === index &&
                              hoveredColumn?.tableIndex === tableIndex &&
                              "bg-green-100 border-x border-green-500"
                              } ${columnIsHidden({
                                tableIndex,
                                columnIndex: index,
                              }) && "opacity-50"
                              } ${columnIsHidden({
                                tableIndex,
                                columnIndex: index,
                              }) &&
                              rawVersion &&
                              "hidden"
                              }
`}
                          >
                            {row[key]}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {/* Show One Time or Monthly Total after the table */}
              {table.afterSection && (
                <Stack
                  spacing={0}
                  align="flex-end"
                  className="text-sky-600 mb-3"
                >
                  <Text>{table.afterSection.label}</Text>
                  <Title order={2}>{table.afterSection.value}</Title>
                </Stack>
              )}
            </Stack>
          </div>
        );
      })}
    </>
  );
}
