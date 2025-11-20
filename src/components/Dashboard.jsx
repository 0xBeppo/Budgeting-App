import React, { useEffect, useState } from 'react';
import { getFinancialData } from '../services/api';
import SummaryCard from './SummaryCard';
import FinancialList from './FinancialList';
import AssetChart from './AssetChart';
import { Wallet, ArrowDownCircle, ArrowUpCircle, Loader2 } from 'lucide-react';

const Dashboard = () => {
    const [data, setData] = useState({ assets: [], liabilities: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const result = await getFinancialData();
            setData(result);
        } catch (err) {
            setError('Error al cargar los datos. Asegúrate de que el servidor esté funcionando (npm run server).');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-accent-primary" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-400">
                <p>{error}</p>
            </div>
        );
    }

    const { assets, liabilities } = data;

    const totalAssets = assets.reduce((acc, curr) => acc + curr.amount, 0);
    const totalLiabilities = liabilities.reduce((acc, curr) => acc + curr.amount, 0);
    const patrimonioTotal = totalAssets - totalLiabilities;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <header className="mb-12 text-center md:text-left">
                <h1 className="text-5xl md:text-6xl font-bold mb-3 tracking-tight">
                    <span className="text-gradient">Mi Patrimonio</span>
                </h1>
                <p className="text-gray-400 text-xl">Resumen financiero personal</p>
            </header>

            {/* Net Worth Summary Card */}
            <div className="mb-12 max-w-lg mx-auto">
                <SummaryCard
                    title="Patrimonio Total"
                    amount={patrimonioTotal}
                    type="net-worth"
                    icon={Wallet}
                />
            </div>
            <div className="mb-12 max-w-lg mx-auto">
                {/**Add here the Chart */}
                <AssetChart data={assets} />
            </div>

            {/* Summary Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <SummaryCard
                    title="Activos Totales"
                    amount={totalAssets}
                    type="asset"
                    icon={ArrowUpCircle}
                />
                <SummaryCard
                    title="Pasivos Totales"
                    amount={totalLiabilities}
                    type="liability"
                    icon={ArrowDownCircle}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:col-span-3 gap-8">
                {/* Left Column: Assets & Chart */}
                <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FinancialList
                        title="Activos"
                        items={assets}
                        type="assets"
                        onUpdate={fetchData}
                    />
                    <FinancialList
                        title="Pasivos"
                        items={liabilities}
                        type="liabilities"
                        onUpdate={fetchData}
                    />
                </div>

                {/* Right Column: Liabilities */}
                <div className="xl:col-span-1">
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
