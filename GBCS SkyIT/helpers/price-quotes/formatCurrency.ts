export const formatCurrency = (value: number): string => `$${value.toFixed(2)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
