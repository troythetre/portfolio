import { FormData } from "../../types/price-quotes";
import { EMPLOYEES, HIDDEN_VALUES } from "../../constants/price-quotes";

export const getMainTotals = (
  data: FormData,
  hiddenRows: { tableIndex: number; rowIndex: number }[],
  hiddenTables: number[]
): {
  oneTimeTotal: number;
  monthlyTotal: number;
} => {
  let oneTimeTotal = 0;
  let monthlyTotal = 0;
  if (!hiddenRows || !hiddenTables) return { oneTimeTotal, monthlyTotal };

  Object.entries(HIDDEN_VALUES).forEach(([key, value]) => {
    if (
      hiddenRows.find(
        ({ tableIndex, rowIndex }) =>
          tableIndex === value.tableIndex && rowIndex === value.rowIndex
      ) ||
      hiddenTables.includes(value.tableIndex)
    )
      return;
    if (key === "discovery")
      return (oneTimeTotal += EMPLOYEES.reduce((acc, employee) => {
        return (
          acc + data[employee.key + "Discovery"] * data[employee.key + "Rate"]
        );
      }, 0));
    if (key === "implementation")
      return (oneTimeTotal += EMPLOYEES.reduce((acc, employee) => {
        return (
          acc +
          data[employee.key + "Implementation"] * data[employee.key + "Rate"]
        );
      }, 0));
    if (key === "software") return (oneTimeTotal += data.integrationCost);
    if (key === "supportCost") return (monthlyTotal += data.supportCost);
    if (data.customerIsVendor) {
      if (key === "vendorMonthlyFee")
        return (monthlyTotal += data.subscriptionFee);
      if (key === "vendorTransactionFee")
        return (monthlyTotal += data.transactionFee * data.transactionCount);
    } else {
      if (key === "systemAssets")
        return (monthlyTotal += data.priceAsset * data.assetCount);
      if (key === "systemUsers")
        return (monthlyTotal += data.priceUser * data.userCount);
    }
  });

  return {
    oneTimeTotal,
    monthlyTotal,
  };
};
