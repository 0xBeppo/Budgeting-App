export const financialData = {
  patrimonioTotal: 145000, // Calculated sum (approx)
  assets: [
    {
      id: 'cash',
      label: 'Efectivo Disponible',
      amount: 15000,
      type: 'liquid',
      items: [
        {
          id: 1,
          name: 'Cuenta Corriente BBVA',
          amount: 5000,
          lastUpdated: '2024-12',
          history: [
            { date: '2024-01', amount: 4200 },
            { date: '2024-02', amount: 4300 },
            { date: '2024-03', amount: 4100 },
            { date: '2024-04', amount: 4500 },
            { date: '2024-05', amount: 4600 },
            { date: '2024-06', amount: 4400 },
            { date: '2024-07', amount: 4800 },
            { date: '2024-08', amount: 4700 },
            { date: '2024-09', amount: 4900 },
            { date: '2024-10', amount: 5100 },
            { date: '2024-11', amount: 4950 },
            { date: '2024-12', amount: 5000 },
          ]
        },
        {
          id: 2,
          name: 'Cuenta Ahorro ING',
          amount: 10000,
          lastUpdated: '2024-12',
          history: [
            { date: '2024-01', amount: 8000 },
            { date: '2024-02', amount: 8200 },
            { date: '2024-03', amount: 8400 },
            { date: '2024-04', amount: 8600 },
            { date: '2024-05', amount: 8800 },
            { date: '2024-06', amount: 9000 },
            { date: '2024-07', amount: 9200 },
            { date: '2024-08', amount: 9400 },
            { date: '2024-09', amount: 9600 },
            { date: '2024-10', amount: 9800 },
            { date: '2024-11', amount: 9900 },
            { date: '2024-12', amount: 10000 },
          ]
        },
      ]
    },
    {
      id: 'investments',
      label: 'Inversiones',
      amount: 85000,
      type: 'investment',
      items: [
        {
          id: 3,
          name: 'Fondo Indexado S&P 500',
          amount: 45000,
          lastUpdated: '2024-12',
          history: [
            { date: '2024-01', amount: 38000 },
            { date: '2024-02', amount: 39000 },
            { date: '2024-03', amount: 38500 },
            { date: '2024-04', amount: 40000 },
            { date: '2024-05', amount: 41000 },
            { date: '2024-06', amount: 40500 },
            { date: '2024-07', amount: 42000 },
            { date: '2024-08', amount: 43000 },
            { date: '2024-09', amount: 42500 },
            { date: '2024-10', amount: 44000 },
            { date: '2024-11', amount: 44500 },
            { date: '2024-12', amount: 45000 },
          ]
        },
        {
          id: 4,
          name: 'Acciones Tesla',
          amount: 15000,
          lastUpdated: '2024-12',
          history: [
            { date: '2024-01', amount: 12000 },
            { date: '2024-02', amount: 11000 },
            { date: '2024-03', amount: 13000 },
            { date: '2024-04', amount: 12500 },
            { date: '2024-05', amount: 14000 },
            { date: '2024-06', amount: 13500 },
            { date: '2024-07', amount: 15000 },
            { date: '2024-08', amount: 14500 },
            { date: '2024-09', amount: 16000 },
            { date: '2024-10', amount: 15500 },
            { date: '2024-11', amount: 14800 },
            { date: '2024-12', amount: 15000 },
          ]
        },
        {
          id: 5,
          name: 'Bitcoin',
          amount: 25000,
          lastUpdated: '2024-12',
          history: [
            { date: '2024-01', amount: 18000 },
            { date: '2024-02', amount: 20000 },
            { date: '2024-03', amount: 22000 },
            { date: '2024-04', amount: 21000 },
            { date: '2024-05', amount: 23000 },
            { date: '2024-06', amount: 22500 },
            { date: '2024-07', amount: 24000 },
            { date: '2024-08', amount: 23500 },
            { date: '2024-09', amount: 25000 },
            { date: '2024-10', amount: 24500 },
            { date: '2024-11', amount: 26000 },
            { date: '2024-12', amount: 25000 },
          ]
        },
      ]
    },
    {
      id: 'properties',
      label: 'Propiedades',
      amount: 250000,
      type: 'property',
      items: [
        {
          id: 6,
          name: 'Apartamento Centro',
          amount: 250000,
          lastUpdated: '2024-12',
          history: [
            { date: '2024-01', amount: 240000 },
            { date: '2024-02', amount: 240000 },
            { date: '2024-03', amount: 242000 },
            { date: '2024-04', amount: 242000 },
            { date: '2024-05', amount: 245000 },
            { date: '2024-06', amount: 245000 },
            { date: '2024-07', amount: 248000 },
            { date: '2024-08', amount: 248000 },
            { date: '2024-09', amount: 250000 },
            { date: '2024-10', amount: 250000 },
            { date: '2024-11', amount: 250000 },
            { date: '2024-12', amount: 250000 },
          ]
        },
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
        {
          id: 7,
          name: 'Tarjeta de Crédito',
          amount: 2000,
          lastUpdated: '2024-12',
          history: [
            { date: '2024-01', amount: 500 },
            { date: '2024-02', amount: 800 },
            { date: '2024-03', amount: 1200 },
            { date: '2024-04', amount: 1000 },
            { date: '2024-05', amount: 1500 },
            { date: '2024-06', amount: 1300 },
            { date: '2024-07', amount: 1800 },
            { date: '2024-08', amount: 1600 },
            { date: '2024-09', amount: 2000 },
            { date: '2024-10', amount: 1900 },
            { date: '2024-11', amount: 2100 },
            { date: '2024-12', amount: 2000 },
          ]
        },
        {
          id: 8,
          name: 'Préstamo Coche (Restante año)',
          amount: 3000,
          lastUpdated: '2024-12',
          history: [
            { date: '2024-01', amount: 6000 },
            { date: '2024-02', amount: 5750 },
            { date: '2024-03', amount: 5500 },
            { date: '2024-04', amount: 5250 },
            { date: '2024-05', amount: 5000 },
            { date: '2024-06', amount: 4750 },
            { date: '2024-07', amount: 4500 },
            { date: '2024-08', amount: 4250 },
            { date: '2024-09', amount: 4000 },
            { date: '2024-10', amount: 3750 },
            { date: '2024-11', amount: 3500 },
            { date: '2024-12', amount: 3000 },
          ]
        },
      ]
    },
    {
      id: 'long-term',
      label: 'Deudas a Largo Plazo',
      amount: 200000,
      type: 'long-term',
      items: [
        {
          id: 9,
          name: 'Hipoteca Apartamento',
          amount: 200000,
          lastUpdated: '2024-12',
          history: [
            { date: '2024-01', amount: 210000 },
            { date: '2024-02', amount: 209000 },
            { date: '2024-03', amount: 208000 },
            { date: '2024-04', amount: 207000 },
            { date: '2024-05', amount: 206000 },
            { date: '2024-06', amount: 205000 },
            { date: '2024-07', amount: 204000 },
            { date: '2024-08', amount: 203000 },
            { date: '2024-09', amount: 202000 },
            { date: '2024-10', amount: 201000 },
            { date: '2024-11', amount: 200500 },
            { date: '2024-12', amount: 200000 },
          ]
        },
      ]
    }
  ]
};
