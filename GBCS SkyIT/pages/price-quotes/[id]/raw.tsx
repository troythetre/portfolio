import TablePage from "../../../components/price-quotes/TablePage";

export default function Raw() {
  return <TablePage />;
}

Raw.getLayout = (page: any) => <div>{page}</div>;
