// Types used by any page in the price-quotes/ page

export interface FormData {
  customerType: string;
  customerIsVendor: boolean;
  firstYearDiscount: number;
  supportTier: string;
  supportCost: number;
  taxRate1: number;
  taxRate2: number;
  taxRate3: number;
  priceAsset: number;
  priceUser: number;
  assetCount: number;
  userCount: number;
  integrationCost: number;
  integrationSoftware: string;
  subscriptionFee: number;
  transactionFee: number;
  transactionCount: number;
  dataLimit: number;
  dataUsage: number;
  ticketUsage: number;
  [key: string]: any;
}

export interface TableData {
  title: string;
  data: object[];
  headers: string[];
  afterSection?: {
    label: string;
    value: string;
  };
}
