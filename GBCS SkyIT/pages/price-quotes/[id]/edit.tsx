import {
  Alert,
  Badge,
  Button,
  Checkbox,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import FormSection from "../../../components/price-quotes/FormSection";
import SharedWithPopover from "../../../components/price-quotes/SharedWithPopover";
import TablePage from "../../../components/price-quotes/TablePage";
import { BASEURL } from "../../../constants";
import {
  CUSTOMER_TYPES,
  EMPLOYEES,
  SUPPORT_TIERS,
} from "../../../constants/price-quotes";
import { formatCurrency } from "../../../helpers/price-quotes/formatCurrency";
import generateTableData from "../../../helpers/price-quotes/generateTableData";
import { getMainTotals } from "../../../helpers/price-quotes/getMainTotals";

export default function PriceQuotes() {
  const router = useRouter();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQuote = async () => {
    try {
      const res = await axios.get(`/api/price-quotes/${router.query.id}`, {
        withCredentials: true,
      });
      setQuote(res.data);
      form.setValues(res.data.formData);
    } catch (err) {
      console.error("Failed to fetch quote:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (router.isReady && router.query.id) fetchQuote();
  }, [router.isReady, router.query.id]);

  const currencyNumberInputProps = {
    min: 0,
    parser: (value) => value.replace(/\$\s?|(,*)/g, ""),
    formatter: (value) =>
      !Number.isNaN(parseFloat(value))
        ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : "$ ",
    step: 0.05,
    precision: 2,
  };

  const percentageNumberInputProps = {
    min: 0,
    max: 100,
    parser: (value) => value,
    formatter: (value) => (!Number.isNaN(parseFloat(value)) ? `${value}%` : ""),
    step: 0.05,
    precision: 2,
  };

  const employeeInitialValues = () =>
    EMPLOYEES.reduce((acc, employee) => {
      acc[employee.key + "Discovery"] = employee.discovery;
      acc[employee.key + "Implementation"] = employee.implementation;
      acc[employee.key + "Rate"] = employee.rate;
      return acc;
    }, {});

  const form = useForm({
    initialValues: {
      customerType: "v3",
      customerIsVendor: false,
      firstYearDiscount: 10,
      supportTier: "p1",
      supportCost: 150,
      taxRate1: 5.0,
      taxRate2: 0.0,
      taxRate3: 0.0,
      priceAsset: 20,
      priceUser: 30,
      assetCount: 10000,
      userCount: 1000,
      integrationCost: 500,
      integrationSoftware: "",
      subscriptionFee: 25,
      transactionFee: 70,
      transactionCount: 500,
      dataLimit: 1,
      dataUsage: 0.3,
      ticketUsage: 3,
      ...employeeInitialValues(),
    },
  });

  const MAIN_TOTALS = getMainTotals(
    form.values,
    quote?.hiddenRows,
    quote?.hiddenTables
  );

  useEffect(() => {
    const saveQuote = async () => {
      try {
        await axios.put(
          `/api/price-quotes/${router.query.id}`,
          {
            formData: form.values,
          },
          { withCredentials: true }
        );
        console.log("Auto-saved quote");
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    };
    if (quote) saveQuote();
  }, [form.values]);

  return (
    <form
      onSubmit={form.onSubmit(async () => {
        try {
          await axios.put(`/api/price-quotes/${router.query.id}`, {
            status: "approved",
          });
          alert("Quote approved.");
        } catch (err) {
          console.error("Error approving quote:", err);
        }
      })}
      className="relative"
    >
      <Group position="apart">
        <Title mb={0}>Price Quotes</Title>
        <Button
          onClick={async () => {
            try {
              const res = await axios.post(`/api/export-quote-excel`, {
                tableData: generateTableData(form.values, MAIN_TOTALS),
                quoteId: router.query.id,
              });
              window.open(res.data.downloadURL);
            } catch (err) {
              console.error("Export failed:", err);
            }
          }}
        >
          Export CSV
        </Button>
        <SharedWithPopover
          teamId={quote?.teamId}
          sharedWith={quote?.sharedWith}
          onSubmit={async (values) => {
            await axios.put(`/api/price-quotes/${router.query.id}`, values);
          }}
        />
        <Checkbox
          label="Customer is Vendor"
          {...form.getInputProps("customerIsVendor", { type: "checkbox" })}
        />
      </Group>
      <Stack>
        {/* This is the main form with seperate sections */}
        <FormSection title="General">
          <Select
            label="Customer Type"
            data={CUSTOMER_TYPES}
            {...form.getInputProps("customerType")}
          />
          <NumberInput
            label="First Year Discount"
            {...percentageNumberInputProps}
            {...form.getInputProps("firstYearDiscount")}
          />
          <Select
            label="Support Tier"
            data={SUPPORT_TIERS}
            {...form.getInputProps("supportTier")}
          />
          <NumberInput
            label="Support Cost"
            {...currencyNumberInputProps}
            {...form.getInputProps("supportCost")}
          />
          <NumberInput
            label="Tax Rate 1"
            {...percentageNumberInputProps}
            {...form.getInputProps("taxRate1")}
          />
          <NumberInput
            label="Tax Rate 2"
            description="Provincial Tax Rate"
            {...percentageNumberInputProps}
            {...form.getInputProps("taxRate2")}
          />
          <NumberInput
            label="Tax Rate 3"
            {...percentageNumberInputProps}
            {...form.getInputProps("taxRate3")}
          />
        </FormSection>
        <FormSection title="User System">
          <NumberInput
            label="Price/Asset"
            {...currencyNumberInputProps}
            {...form.getInputProps("priceAsset")}
          />
          <NumberInput
            label="Price/User"
            {...currencyNumberInputProps}
            {...form.getInputProps("priceUser")}
          />
          <NumberInput
            label="Number of Assets"
            {...form.getInputProps("assetCount")}
          />
          <NumberInput
            label="Number of Users"
            {...form.getInputProps("userCount")}
          />
          <NumberInput
            label="Integration Cost"
            {...currencyNumberInputProps}
            {...form.getInputProps("integrationCost")}
          />
          <TextInput
            label="Integration Software"
            placeholder="ie. GPS"
            required
            {...form.getInputProps("integrationSoftware")}
          />
        </FormSection>
        <FormSection title="Vendor System">
          <NumberInput
            label="Subscription Fee"
            description="Calculated Monthly"
            {...currencyNumberInputProps}
            {...form.getInputProps("subscriptionFee")}
          />
          <NumberInput
            label="Transaction Fee"
            {...currencyNumberInputProps}
            {...form.getInputProps("transactionFee")}
          />
          <NumberInput
            label="Number of Transactions"
            {...form.getInputProps("transactionCount")}
          />
        </FormSection>
        <FormSection title="Overage Fees">
          <NumberInput
            label="Data Limit/Asset"
            {...form.getInputProps("dataLimit")}
          />
          <NumberInput
            label="Data"
            description="100MB over"
            {...currencyNumberInputProps}
            {...form.getInputProps("dataUsage")}
          />
          <NumberInput
            label="Ticket Support"
            {...currencyNumberInputProps}
            {...form.getInputProps("ticketUsage")}
          />
        </FormSection>
        <FormSection title="Work Hours">
          {EMPLOYEES.map(({ role, key }) => (
            <Paper withBorder p="lg" key={key}>
              <Stack>
                <Title order={3}>{role}</Title>
                <NumberInput
                  label="Discovery"
                  {...form.getInputProps(key + "Discovery")}
                />
                <NumberInput
                  label="Implementation"
                  {...form.getInputProps(key + "Implementation")}
                />
                <NumberInput
                  label="Rate/hr"
                  {...currencyNumberInputProps}
                  {...form.getInputProps(key + "Rate")}
                />
              </Stack>
            </Paper>
          ))}
        </FormSection>
        {/* This is the fixed MAIN_TOTALS display */}
        <Group
          my="lg"
          mx="auto"
          p="xl"
          className="sticky bottom-2 backdrop-blur-lg rounded-xl shadow-xl"
          noWrap
        >
          <Alert
            title="One Time Total"
            color="blue"
            variant="filled"
            className="relative overflow-visible"
          >
            <Title>{formatCurrency(MAIN_TOTALS.oneTimeTotal)}</Title>
            <Badge
              color="red"
              className={`absolute -bottom-3 left-[50%] translate-x-[-50%] transition opacity-0 ${
                (quote?.hiddenRows.find(({ tableIndex }) => tableIndex === 0) ||
                  quote?.hiddenTables.includes(0)) &&
                "opacity-100"
              }
`}
              variant="filled"
            >
              Hidden {quote?.hiddenTables.includes(0) ? "Page" : "Rows"}
            </Badge>
          </Alert>
          <Alert
            title="Monthly Total"
            color="gray"
            variant="filled"
            className="relative overflow-visible"
          >
            <Title>{formatCurrency(MAIN_TOTALS.monthlyTotal)}</Title>
            <Badge
              color="red"
              className={`absolute -bottom-3 left-[50%] translate-x-[-50%] transition opacity-0 ${
                (quote?.hiddenRows.find(({ tableIndex }) => tableIndex === 1) ||
                  quote?.hiddenTables.includes(1)) &&
                "opacity-100"
              }
`}
              variant="filled"
            >
              Hidden {quote?.hiddenTables.includes(1) ? "Page" : "Rows"}
            </Badge>
          </Alert>
        </Group>
        <TablePage /> {/* PDF Pages */}
        {/* Don't show "Generate PDF" button if all pages are hidden */}
        {/* Since nothing would be generated */}
        <Button
          size="md"
          variant="outline"
          className="self-center"
          onClick={async () => {
            try {
              await axios.put(
                `${BASEURL}/api/proposal/update-price-quote/${router.query.id}`,
                {
                  itemName: form.values.integrationSoftware,
                  quantity: form.values.assetCount,
                  price: form.values.priceAsset,
                  description: form.values.customerType,
                  role: "user",
                },
                { withCredentials: true }
              );
              alert("Quote saved successfully.");
            } catch (err) {
              if (err.response) {
                // Backend responded with an error
                console.error("Server error:", err.response.data);
                alert(
                  `Failed to save quote: ${
                    err.response.data.message || "Unknown error"
                  }`
                );
              } else if (err.request) {
                // Request made but no response received
                console.error("No response received:", err.request);
                alert(
                  "No response from server. Check your network or backend."
                );
              } else {
                // Something else caused the error
                console.error("Unexpected error:", err.message);
                alert("Unexpected error occurred.");
              }
            }
          }}
        >
          Save Quote
        </Button>
        {quote?.hiddenTables.length <
        generateTableData(form.values, MAIN_TOTALS).length ? (
          quote?.sharedWith?.find(
            ({ email, role }) =>
              email === auth.currentUser?.email && role === "admin"
          ) ? (
            <Button type="submit" className="self-center" size="lg">
              Approve and Generate
            </Button>
          ) : quote?.status === "pending approval" ? (
            <Button size="lg" className="self-center" disabled onclick="f()">
              {alert(
                "managment team suggests you to review your quote " +
                  quote.id +
                  " before it can be approved"
              )}
              Approval Requested
            </Button>
          ) : quote?.status === "approved" ? (
            <Button
              type="submit"
              className="self-center"
              size="lg"
              onclick="f2()"
            >
              {alert("Your price quote " + quote.id + " have been approved")}
              Generate PDF
            </Button>
          ) : (
            <Button
              className="self-center"
              size="lg"
              onClick={async () => {
                try {
                  await axios.put(`/api/price-quotes/${router.query.id}`, {
                    status: "pending approval",
                  });
                  alert("Approval request submitted.");
                } catch (err) {
                  console.error("Error requesting approval:", err);
                  alert("Failed to request approval.");
                }
              }}
            >
              Request Approval
            </Button>
          )
        ) : (
          <Button disabled size="lg" className="self-center">
            All pages hidden
          </Button>
        )}
      </Stack>
    </form>
  );
}