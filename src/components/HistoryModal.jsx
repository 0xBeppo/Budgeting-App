import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const HistoryModal = ({ isOpen, onClose, item, type }) => {
    if (!isOpen || !item) return null;

    const formatCurrency = (value) => {
        try {
            if (typeof value !== 'number' || isNaN(value)) return '0 €';
            return new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: 'EUR',
                maximumFractionDigits: 0
            }).format(value);
        } catch (e) {
            console.error('Error formatting currency:', e);
            return '0 €';
        }
    };

    const isAsset = type === 'assets';
    const color = isAsset ? '#10b981' : '#f43f5e';
    const gradientColor = isAsset ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)';
    const gradientId = `colorGradient-${item.id}`;

    const hasHistory = item.history && Array.isArray(item.history) && item.history.length > 0;

    let maxAmount = 0;
    let minAmount = 0;

    if (hasHistory) {
        const amounts = item.history.map(h => Number(h.amount)).filter(a => !isNaN(a));
        if (amounts.length > 0) {
            maxAmount = Math.max(...amounts);
            minAmount = Math.min(...amounts);
        }
    }

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
                            className="bg-[#1a1b26] border border-white/10 rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative overflow-hidden"
                        >
                            {/* Background decoration */}
                            <div className={`absolute top-0 right-0 w-64 h-64 ${isAsset ? 'bg-emerald-500/10' : 'bg-rose-500/10'} blur-[100px] rounded-full pointer-events-none`} />

                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">{item.name}</h2>
                                    <p className="text-gray-400">Histórico de evolución</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="h-[300px] w-full relative z-10">
                                {hasHistory ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={item.history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                                                formatter={(value) => [formatCurrency(value), 'Valor']}
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

                            <div className="mt-6 grid grid-cols-3 gap-4 relative z-10">
                                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                    <p className="text-xs text-gray-500 mb-1">Valor Actual</p>
                                    <p className="text-lg font-semibold text-white">{formatCurrency(item.amount)}</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                    <p className="text-xs text-gray-500 mb-1">Máximo (Año)</p>
                                    <p className="text-lg font-semibold text-white">
                                        {formatCurrency(maxAmount)}
                                    </p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                    <p className="text-xs text-gray-500 mb-1">Mínimo (Año)</p>
                                    <p className="text-lg font-semibold text-white">
                                        {formatCurrency(minAmount)}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default HistoryModal;
