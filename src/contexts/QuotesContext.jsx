import { createContext, useContext, useState } from 'react';

const QuotesContext = createContext(null);

const mockRecentQuotes = [
  {
    id: 'Q-2401',
    customer: { name: 'Omar T.', initials: 'OT', avatarColor: '#3B82F6' },
    vehicle: 'Kia Sportage',
    service: 'A/C repair',
    amount: 1850,
    status: 'sent',
    sentAt: 'Jul 12, 2026',
  },
  {
    id: 'Q-2402',
    customer: { name: 'Youssef H.', initials: 'YH', avatarColor: '#3B82F6' },
    vehicle: 'Honda Civic',
    service: 'Oil + filter',
    amount: 470,
    status: 'accepted',
    sentAt: 'Jul 11, 2026',
  },
  {
    id: 'Q-2403',
    customer: { name: 'Mostafa R.', initials: 'MR', avatarColor: '#3B82F6' },
    vehicle: 'Chevrolet Optra',
    service: 'Suspension',
    amount: 2400,
    status: 'accepted',
    sentAt: 'Jul 10, 2026',
  },
  {
    id: 'Q-2404',
    customer: { name: 'Laila S.', initials: 'LS', avatarColor: '#3B82F6' },
    vehicle: 'Toyota Yaris',
    service: 'Battery',
    amount: 1100,
    status: 'rejected',
    sentAt: 'Jul 09, 2026',
  },
];

// Default line items for a new quote
const defaultLineItems = [
  { id: 1, label: 'Oil change (labor + 5W-30)', amount: 250 },
  { id: 2, label: 'Oil filter replacement', amount: 120 },
  { id: 3, label: 'Air filter (worn out)', amount: 190 },
];

export function QuotesProvider({ children }) {
  const [recentQuotes, setRecentQuotes] = useState(mockRecentQuotes);
  const [lineItems, setLineItems] = useState(defaultLineItems);

  // ---- Line item CRUD ----
  const addLineItem = () => {
    setLineItems((prev) => [...prev, { id: Date.now(), label: '', amount: 0 }]);
  };

  const updateLineItem = (id, field, value) => {
    setLineItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, [field]: field === 'amount' ? Number(value) || 0 : value }
          : item
      )
    );
  };

  const removeLineItem = (id) => {
    setLineItems((prev) => prev.filter((item) => item.id !== id));
  };

  // ---- Send quote to customer ----
  const sendQuote = ({ customer, vehicle }) => {
    const total = lineItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    const newQuote = {
      id: `Q-${2400 + recentQuotes.length + 1}`,
      customer: {
        name: customer || 'Walk-in customer',
        initials:
          customer
            ?.split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) ?? 'WC',
        avatarColor: '#3B82F6',
      },
      vehicle: vehicle || '—',
      service:
        lineItems
          .map((i) => i.label)
          .filter(Boolean)
          .join(', ') || 'Custom quote',
      amount: total,
      status: 'sent',
      sentAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };
    setRecentQuotes((prev) => [newQuote, ...prev]);
    // Reset line items
    setLineItems(defaultLineItems);
    return newQuote;
  };

  const total = lineItems.reduce((sum, item) => sum + (item.amount || 0), 0);

  const value = {
    recentQuotes,
    lineItems,
    total,
    addLineItem,
    updateLineItem,
    removeLineItem,
    sendQuote,
  };

  return <QuotesContext.Provider value={value}>{children}</QuotesContext.Provider>;
}

export function useQuotes() {
  const ctx = useContext(QuotesContext);
  if (!ctx) throw new Error('useQuotes must be used inside a <QuotesProvider>');
  return ctx;
}
