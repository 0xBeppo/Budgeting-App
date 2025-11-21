import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const NetWorthModal = ({ isOpen, onClose, assets, liabilities, netWorthYTD }) => {
    const [chartData, setChartData] = useState([]);
    const [stats, setStats] = useState({ current: 0, max: 0, min: 0 });

    useEffect(() => {
        if (isOpen && assets && liabilities) {
            calculateNetWorthHistory();
        }
    }, [isOpen, assets, liabilities]);

    const calculateNetWorthHistory = () => {
        const allAssetItems = assets.flatMap(cat => cat.items);
        const allLiabilityItems = liabilities.flatMap(cat => cat.items);

        // Get all unique months from the history
        const monthsSet = new Set();
        [...allAssetItems, ...allLiabilityItems].forEach(item => {
            if (item.history && item.history.length > 0) {
                item.history.forEach(h => monthsSet.add(h.date));
            }
        });

        const months = Array.from(monthsSet).sort();

        // Calculate net worth for each month
        const history = months.map(month => {
            let totalAssets = 0;
            let totalLiabilities = 0;

            // Sum assets for this month
            allAssetItems.forEach(item => {
                if (item.history && item.history.length > 0) {
                    const monthData = item.history.find(h => h.date === month);
                    if (monthData) {
                        totalAssets += monthData.amount;
                    }
                }
            });

            // Sum liabilities for this month
            allLiabilityItems.forEach(item => {
                if (item.history && item.history.length > 0) {
                    const monthData = item.history.find(h => h.date === month);
                    if (monthData) {
                        totalLiabilities += monthData.amount;
                    }
                }
            });

            return {
                date: month,
                amount: totalAssets - totalLiabilities
            };
        });

        setChartData(history);

        // Calculate stats
        if (history.length > 0) {
            const amounts = history.map(h => h.amount);
            const current = amounts[amounts.length - 1];
            const max = Math.max(...amounts);
            const min = Math.min(...amounts);
            setStats({ current, max, min });
        }
    };

    const formatCurrency = (value) => {
        try {
            if (typeof value !== 'number' || isNaN(value)) return '0 €';
            return new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(value);
        } catch (e) {
            console.error('Error formatting currency:', e);
            return '0 €';
        }
    };

    if (!isOpen) return null;

    const color = '#8b5cf6'; // Purple/violet color for net worth
    const gradientId = 'colorGradient-networth';

    const isPositiveYTD = netWorthYTD >= 0;
    const ytdColor = isPositiveYTD ? 'text-emerald-400' : 'text-red-400';
    const YTDIcon = isPositiveYTD ? TrendingUp : TrendingDown;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#1a1b26] border border-white/10 rounded-2xl p-6 w-full max-w-4xl shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 blur-[100px] rounded-full pointer-events-none" />

                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">Patrimonio Total</h2>
                                    <p className="text-gray-400">Evolución del patrimonio neto</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-6">
                                {/* Chart */}
                                <div className="h-[300px] w-full relative z-10 bg-white/5 rounded-xl p-4 border border-white/5">
                                    {chartData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                                <XAxis
                                                    dataKey="date"
                                                    stroke="#6b7280"
                                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tickFormatter={(value) => {
                                                        try {
                                                            if (!value) return '';
                                                            const date = new Date(value);
                                                            if (isNaN(date.getTime())) return value;
                                                            return date.toLocaleDateString('es-ES', { month: 'short' });
                                                        } catch (e) {
                                                            return value;
                                                        }
                                                    }}
                                                />
                                                <YAxis
                                                    stroke="#6b7280"
                                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tickFormatter={(value) => {
                                                        if (typeof value !== 'number') return '';
                                                        return `${value / 1000}k`;
                                                    }}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: '#1f2937',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        borderRadius: '0.75rem',
                                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                                    }}
                                                    itemStyle={{ color: '#fff' }}
                                                    formatter={(value) => [formatCurrency(value), 'Patrimonio Neto']}
                                                    labelStyle={{ color: '#9ca3af', marginBottom: '0.25rem' }}
                                                    labelFormatter={(label) => {
                                                        try {
                                                            if (!label) return '';
                                                            const date = new Date(label);
                                                            if (isNaN(date.getTime())) return label;
                                                            return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
                                                        } catch (e) {
                                                            return label;
                                                        }
                                                    }}
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="amount"
                                                    stroke={color}
                                                    strokeWidth={3}
                                                    fill={`url(#${gradientId})`}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-500">
                                            No hay datos históricos disponibles
                                        </div>
                                    )}
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                        <p className="text-xs text-gray-500 mb-1">Valor Actual</p>
                                        <div className="flex flex-col">
                                            <p className="text-lg font-semibold text-white">{formatCurrency(stats.current)}</p>
                                            <div className={`flex items-center gap-1 text-xs font-medium ${ytdColor}`}>
                                                <YTDIcon size={12} />
                                                <span>{Math.abs(netWorthYTD).toFixed(1)}% YTD</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                        <p className="text-xs text-gray-500 mb-1">Máximo</p>
                                        <p className="text-lg font-semibold text-white">
                                            {formatCurrency(stats.max)}
                                        </p>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                        <p className="text-xs text-gray-500 mb-1">Mínimo</p>
                                        <p className="text-lg font-semibold text-white">
                                            {formatCurrency(stats.min)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NetWorthModal;
