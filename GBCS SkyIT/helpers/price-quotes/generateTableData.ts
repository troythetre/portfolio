import { EMPLOYEES } from "../../constants/price-quotes";
import { FormData, TableData } from "../../types/price-quotes";
import { formatCurrency } from "./formatCurrency";

// Local functions only used by generateTableData
const addTax = (value: number, taxRates: number[]): number =>
  value + (value * (taxRates[0] + taxRates[1] + taxRates[2])) / 100;
const subtractDiscount = (value: number, firstYearDiscount: number): number =>
  value - (value * firstYearDiscount) / 100;
const numberStrings = ["One", "Two", "Three", "Four", "Five"];

// Should return an array of objects, each object representing one table
export default function generateTableData(
  data: FormData,
  MAIN_TOTALS: any
): TableData[] {
  if (!MAIN_TOTALS || !data) return [];
  return [
    {
      title: "One Time Fees",
      headers: ["Item", "Total Cost"],
      data: [
        {
          item: "Discovery: Labour",
          totalCost: formatCurrency(
            EMPLOYEES.reduce(
              (total: number, employee: any) =>
                total +
                data[employee.key + "Discovery"] * data[employee.key + "Rate"],
              0
            )
          ),
        },
        {
          item: "Implementation: Labour",
          totalCost: formatCurrency(
            EMPLOYEES.reduce(
              (total: number, employee: any) =>
                total +
                data[employee.key + "Implementation"] *
                  data[employee.key + "Rate"],
              0
            )
          ),
        },
        {
          item: `${data.integrationSoftware} Integration`,
          totalCost: formatCurrency(data.integrationCost),
        },
      ],
      afterSection: {
        label: "One Time Total",
        value: formatCurrency(MAIN_TOTALS.oneTimeTotal),
      },
    },
    {
      title: "Ongoing Fees (Monthly)",
      headers: ["Item", "Units/Hours", "Rate", "Total Cost"],
      data: [
        {
          item: "System: Assets",
          units: data.assetCount,
          rate: formatCurrency(data.priceAsset),
          totalCost: formatCurrency(
            data.customerIsVendor ? 0 : data.priceAsset * data.assetCount
          ),
        },
        {
          item: "System: Users",
          units: data.userCount,
          rate: formatCurrency(data.priceUser),
          totalCost: formatCurrency(
            data.customerIsVendor ? 0 : data.priceUser * data.userCount
          ),
        },
        {
          item: "Vendor: Monthly Fee",
          units: null,
          rate: null,
          totalCost: formatCurrency(
            data.customerIsVendor ? data.subscriptionFee : 0
          ),
        },
        {
          item: "Vendor: Transaction Fee",
          units: data.transactionCount,
          rate: formatCurrency(data.transactionFee),
          totalCost: formatCurrency(
            data.customerIsVendor
              ? data.transactionFee * data.transactionCount
              : 0
          ),
        },
        {
          item: `Support: ${data.supportTier.toUpperCase()}`,
          units: null,
          rate: null,
          totalCost: formatCurrency(data.supportCost),
        },
      ],
      afterSection: {
        label: "Monthly Total",
        value: formatCurrency(MAIN_TOTALS.monthlyTotal),
      },
    },
    {
      title: "Total Price",
      headers: [
        "Description",
        "Without Tax",
        "With Tax",
        ...(data.firstYearDiscount > 0
          ? ["With First-Year Discount", "With Discount + Tax"]
          : []),
      ],
      data: [
        {
          description: "One Time Fee",
          withoutTax: formatCurrency(
            MAIN_TOTALS.oneTimeTotal + 12 * MAIN_TOTALS.monthlyTotal
          ),
          withTax: formatCurrency(
            addTax(MAIN_TOTALS.oneTimeTotal + 12 * MAIN_TOTALS.monthlyTotal, [
              data.taxRate1,
              data.taxRate2,
              data.taxRate3,
            ])
          ),
          ...(data.firstYearDiscount > 0
            ? {
                withFirstYearDiscount: formatCurrency(
                  subtractDiscount(
                    MAIN_TOTALS.oneTimeTotal,
                    data.firstYearDiscount
                  )
                ),
                withDiscountTax: formatCurrency(
                  addTax(
                    subtractDiscount(
                      MAIN_TOTALS.oneTimeTotal,
                      data.firstYearDiscount
                    ),
                    [data.taxRate1, data.taxRate2, data.taxRate3]
                  )
                ),
              }
            : {}),
        },
        {
          description: "Monthly Fee",
          withoutTax: formatCurrency(MAIN_TOTALS.monthlyTotal),
          withTax: formatCurrency(
            addTax(MAIN_TOTALS.monthlyTotal, [
              data.taxRate1,
              data.taxRate2,
              data.taxRate3,
            ])
          ),
          ...(data.firstYearDiscount > 0
            ? {
                withFirstYearDiscount: formatCurrency(MAIN_TOTALS.monthlyTotal),
                withDiscountTax: formatCurrency(
                  addTax(MAIN_TOTALS.monthlyTotal, [
                    data.taxRate1,
                    data.taxRate2,
                    data.taxRate3,
                  ])
                ),
              }
            : {}),
        },
        {},
        ...[...Array(5).keys()].map((i) => ({
          description: `${numberStrings[i]} Year${i === 0 ? "" : "s"}`,
          withoutTax: formatCurrency(
            MAIN_TOTALS.oneTimeTotal + (i + 1) * 12 * MAIN_TOTALS.monthlyTotal
          ),
          withTax: formatCurrency(
            addTax(
              MAIN_TOTALS.oneTimeTotal +
                (i + 1) * 12 * MAIN_TOTALS.monthlyTotal,
              [data.taxRate1, data.taxRate2, data.taxRate3]
            )
          ),
          ...(data.firstYearDiscount > 0
            ? {
                withFirstYearDiscount: formatCurrency(
                  subtractDiscount(
                    MAIN_TOTALS.oneTimeTotal + 12 * MAIN_TOTALS.monthlyTotal,
                    data.firstYearDiscount
                  ) +
                    i * 12 * MAIN_TOTALS.monthlyTotal
                ),
                withDiscountTax: formatCurrency(
                  addTax(
                    subtractDiscount(
                      MAIN_TOTALS.oneTimeTotal + 12 * MAIN_TOTALS.monthlyTotal,
                      data.firstYearDiscount
                    ) +
                      i * 12 * MAIN_TOTALS.monthlyTotal,
                    [data.taxRate1, data.taxRate2, data.taxRate3]
                  )
                ),
              }
            : {}),
        })),
      ],
    },
  ];
}
