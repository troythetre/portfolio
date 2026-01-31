import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface Deal {
  name: string;
  method: 'manual' | 'document';
  time: string;
  payment?: string;
  phone?: string;
  email?: string;
  deliverables?: { amount: string; type: string }[];
  benchmarks?: { amount: string; benchmark: string }[];
}

interface DealsContextType {
  deals: Deal[];
  addDeal: (deal: Deal) => void;
}

const DealsContext = createContext<DealsContextType | undefined>(undefined);

export const DealsProvider = ({ children }: { children: ReactNode }) => {
  const [deals, setDeals] = useState<Deal[]>([]);

  const addDeal = (deal: Deal) => setDeals((prev) => [...prev, deal]);

  return (
    <DealsContext.Provider value={{ deals, addDeal }}>
      {children}
    </DealsContext.Provider>
  );
};

export const useDeals = () => {
  const context = useContext(DealsContext);
  if (!context) throw new Error('useDeals must be used within DealsProvider');
  return context;
};