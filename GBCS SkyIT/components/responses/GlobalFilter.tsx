import { useState, useEffect } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { TextInput } from "@mantine/core";

export default function GlobalFilter({
  globalFilter,
  setGlobalFilter,
}: {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}) {
  const [value, setValue] = useState(globalFilter);
  const [debounced] = useDebouncedValue(value, 200);

  useEffect(() => {
    setGlobalFilter(debounced);
  }, [debounced, setGlobalFilter]);

  return (
    <TextInput
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Filter all columns"
    />
  );
}
