import { Table, Text } from "@mantine/core";
import { TableInstance } from "react-table";
// React Table Component
export default function ResponseTable({
  tableInstance,
}: {
  tableInstance: TableInstance;
}) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <Table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup, index) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={index}>
            {headerGroup.headers.map((column, col_index) => (
              <th {...column.getHeaderProps()} key={col_index}>
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, index) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} key={index}>
              {row.cells.map((cell, cell_index) => {
                return (
                  <td {...cell.getCellProps()} key={cell_index}>
                    <Text lineClamp={1}>{cell.render("Cell")}</Text>
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
