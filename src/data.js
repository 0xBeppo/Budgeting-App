export const financialData = {
  patrimonioTotal: 145000, // Calculated sum (approx)
  assets: [
    {
      id: 'cash',
      label: 'Efectivo Disponible',
      amount: 15000,
      type: 'liquid',
      items: [
        { id: 1, name: 'Cuenta Corriente BBVA', amount: 5000 },
        { id: 2, name: 'Cuenta Ahorro ING', amount: 10000 },
      ]
    },
    {
      id: 'investments',
      label: 'Inversiones',
      amount: 85000,
      type: 'investment',
      items: [
        { id: 3, name: 'Fondo Indexado S&P 500', amount: 45000 },
        { id: 4, name: 'Acciones Tesla', amount: 15000 },
        { id: 5, name: 'Bitcoin', amount: 25000 },
      ]
    },
    {
      id: 'properties',
      label: 'Propiedades',
      amount: 250000,
      type: 'property',
      items: [
        { id: 6, name: 'Apartamento Centro', amount: 250000 },
      ]
    }
  ],
  liabilities: [
    {
      id: 'short-term',
      label: 'Deudas a Corto Plazo',
      amount: 5000,
      type: 'short-term',
      items: [
        { id: 7, name: 'Tarjeta de Crédito', amount: 2000 },
        { id: 8, name: 'Préstamo Coche (Restante año)', amount: 3000 },
      ]
    },
    {
      id: 'long-term',
      label: 'Deudas a Largo Plazo',
      amount: 200000,
      type: 'long-term',
      items: [
        { id: 9, name: 'Hipoteca Apartamento', amount: 200000 },
      ]
    }
  ]
};
