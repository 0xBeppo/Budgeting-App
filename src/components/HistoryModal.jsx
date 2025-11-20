import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Save, Edit2, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { updateCategory, getFinancialData } from '../services/api';
import { calculateYTD } from '../utils/financeUtils';

const HistoryModal = ({ isOpen, onClose, item, categoryId, type, onUpdate }) => {
    const [history, setHistory] = useState([]);
    const [newDate, setNewDate] = useState(new Date().toISOString().slice(0, 7));
    const [newAmount, setNewAmount] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editAmount, setEditAmount] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (item && item.history) {
            // Sort history by date descending
            const sortedHistory = [...item.history].sort((a, b) => new Date(b.date) - new Date(a.date));
            setHistory(sortedHistory);
            setNewAmount(item.amount.toString());
        }
    }, [item]);

    if (!isOpen || !item) return null;

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

    const handleAddEntry = async () => {
        if (!newDate || !newAmount) return;

        const amount = parseFloat(newAmount);
        if (isNaN(amount)) return;

        const newEntry = { date: newDate, amount };

        // Check if entry for this date already exists
        const existingIndex = history.findIndex(h => h.date === newDate);
        let updatedHistory;

        if (existingIndex >= 0) {
            updatedHistory = [...history];
            updatedHistory[existingIndex] = newEntry;
        } else {
            updatedHistory = [...history, newEntry];
        }

        // Sort by date ascending for the chart
        updatedHistory.sort((a, b) => new Date(a.date) - new Date(b.date));

        await saveChanges(updatedHistory);
    };

    const handleDeleteEntry = async (dateToDelete) => {
        const updatedHistory = history.filter(h => h.date !== dateToDelete);
        await saveChanges(updatedHistory);
    };

    const handleEditStart = (entry) => {
        setEditingId(entry.date);
        setEditAmount(entry.amount.toString());
    };

    const handleEditSave = async (date) => {
        const amount = parseFloat(editAmount);
        if (isNaN(amount)) return;

        const updatedHistory = history.map(h =>
            h.date === date ? { ...h, amount } : h
        );

        await saveChanges(updatedHistory);
        setEditingId(null);
    };

    const saveChanges = async (updatedHistory) => {
        setLoading(true);
        try {
            // 1. Fetch current category data to ensure we have the latest state
            const data = await getFinancialData();
            const categoryList = type === 'assets' ? data.assets : data.liabilities;
            const currentCategory = categoryList.find(c => c.id === categoryId);

            if (!currentCategory) throw new Error('Category not found');

            // 2. Update the specific item within the category
            const updatedItems = currentCategory.items.map(i => {
                if (i.id === item.id) {
                    // Update history and set current amount to the latest history entry
                    const sortedHistory = [...updatedHistory].sort((a, b) => new Date(a.date) - new Date(b.date));
                    const latestAmount = sortedHistory.length > 0 ? sortedHistory[sortedHistory.length - 1].amount : 0;

                    return {
                        ...i,
                        history: sortedHistory,
                        amount: latestAmount,
                        lastUpdated: new Date().toISOString().split('T')[0]
                    };
                }
                return i;
            });

            // 3. Recalculate category total amount
            const newCategoryAmount = updatedItems.reduce((sum, i) => sum + i.amount, 0);

            const updatedCategory = {
                ...currentCategory,
                amount: newCategoryAmount,
                items: updatedItems
            };

            // 4. Save to API
            await updateCategory(type, updatedCategory);

            // 5. Update local state and trigger refresh
            setHistory(updatedHistory.sort((a, b) => new Date(b.date) - new Date(a.date)));
            if (onUpdate) onUpdate();

        } catch (error) {
            console.error('Error saving changes:', error);
            alert('Error al guardar los cambios');
        } finally {
            setLoading(false);
        }
    };

    const isAsset = type === 'assets';
    const color = isAsset ? '#10b981' : '#f43f5e';
    const gradientColor = isAsset ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)';
    const gradientId = `colorGradient-${item.id}`;

    // Prepare data for chart (sorted ascending)
    const chartData = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));

    const maxAmount = history.length > 0 ? Math.max(...history.map(h => h.amount)) : 0;
    const minAmount = history.length > 0 ? Math.min(...history.map(h => h.amount)) : 0;

    // Calculate YTD
    const { percentage: ytdPercentage } = calculateYTD(item.amount, history);
    const isPositiveYTD = ytdPercentage >= 0;

    // Determine if the change is "good"
    // For Assets: Positive % is good (Green)
    // For Liabilities: Positive % is bad (Red)
    const isGoodYTD = isAsset ? isPositiveYTD : !isPositiveYTD;
    const ytdColor = isGoodYTD ? 'text-emerald-400' : 'text-red-400';
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
                            <div className={`absolute top-0 right-0 w-64 h-64 ${isAsset ? 'bg-emerald-500/10' : 'bg-rose-500/10'} blur-[100px] rounded-full pointer-events-none`} />

                            <div className="flex justify-between items-start mb-6 relative z-10">
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

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                                {/* Left Column: Chart and Stats */}
                                <div className="lg:col-span-2 flex flex-col gap-6">
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

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                            <p className="text-xs text-gray-500 mb-1">Valor Actual</p>
                                            <div className="flex flex-col">
                                                <p className="text-lg font-semibold text-white">{formatCurrency(item.amount)}</p>
                                                <div className={`flex items-center gap-1 text-xs font-medium ${ytdColor}`}>
                                                    <YTDIcon size={12} />
                                                    <span>{Math.abs(ytdPercentage).toFixed(1)}% YTD</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                            <p className="text-xs text-gray-500 mb-1">Máximo</p>
                                            <p className="text-lg font-semibold text-white">
                                                {formatCurrency(maxAmount)}
                                            </p>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                            <p className="text-xs text-gray-500 mb-1">Mínimo</p>
                                            <p className="text-lg font-semibold text-white">
                                                {formatCurrency(minAmount)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Manage History */}
                                <div className="bg-white/5 rounded-xl border border-white/5 flex flex-col overflow-hidden h-[450px]">
                                    <div className="p-4 border-b border-white/5 bg-white/5">
                                        <h3 className="font-medium text-white mb-3">Añadir / Editar Registro</h3>
                                        <div className="flex flex-col gap-3">
                                            <input
                                                type="month"
                                                value={newDate}
                                                onChange={(e) => setNewDate(e.target.value)}
                                                className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm w-full focus:outline-none focus:border-violet-500"
                                            />
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    placeholder="Cantidad"
                                                    value={newAmount}
                                                    onChange={(e) => setNewAmount(e.target.value)}
                                                    className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm w-full focus:outline-none focus:border-violet-500"
                                                />
                                                <button
                                                    onClick={handleAddEntry}
                                                    disabled={loading}
                                                    className="bg-violet-600 hover:bg-violet-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50 shrink-0"
                                                >
                                                    <Plus size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                                        {history.map((entry) => (
                                            <div key={entry.date} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg group transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-gray-400 text-sm font-mono">{entry.date}</span>
                                                    {editingId === entry.date ? (
                                                        <input
                                                            type="number"
                                                            value={editAmount}
                                                            onChange={(e) => setEditAmount(e.target.value)}
                                                            className="bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-sm w-24 focus:outline-none focus:border-violet-500"
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        <span className="text-white font-medium">{formatCurrency(entry.amount)}</span>
                                                    )}
                                                </div>

                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {editingId === entry.date ? (
                                                        <button
                                                            onClick={() => handleEditSave(entry.date)}
                                                            disabled={loading}
                                                            className="p-1.5 text-emerald-400 hover:bg-emerald-400/10 rounded transition-colors"
                                                        >
                                                            <Save size={16} />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleEditStart(entry)}
                                                            className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteEntry(entry.date)}
                                                        disabled={loading}
                                                        className="p-1.5 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
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

export default HistoryModal;
