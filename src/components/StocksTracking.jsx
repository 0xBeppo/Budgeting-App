import React, { useState, useEffect } from 'react';
import { updateStock, getStocks, getFinancialData, addStock, deleteStock, fetchStockPrice } from '../services/api';
import { TrendingUp, AlertCircle, Save, X, Loader2, Plus, Trash2, RefreshCw } from 'lucide-react';

const StocksTracking = () => {
    const [stocks, setStocks] = useState([]);
    const [totalPortfolioValue, setTotalPortfolioValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editValues, setEditValues] = useState({});
    const [updateLoading, setUpdateLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newStock, setNewStock] = useState({
        ticker: '',
        shares: '',
        currentPrice: '',
        objectivePrice: '',
        objectiveYear: new Date().getFullYear() + 1
    });

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [stocksData, financialData] = await Promise.all([
                getStocks(),
                getFinancialData()
            ]);

            setStocks(stocksData);

            // Calculate total assets for weight calculation
            const totalAssets = financialData.assets.reduce((acc, curr) => acc + curr.amount, 0);
            setTotalPortfolioValue(totalAssets);

        } catch (err) {
            console.error("Error fetching data:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const calculateIRR = (currentPrice, objectivePrice, objectiveYear) => {
        const currentYear = new Date().getFullYear();
        let years = objectiveYear - currentYear;

        // If target is this year, treat it as 1 year for simplicity, 
        // or calculate simple return if we want to be more precise about "immediate" gain.
        // Let's use a minimum of 0.1 years to avoid division by zero or infinity, 
        // effectively treating it as "short term".
        if (years <= 0) years = 1;

        if (currentPrice <= 0) return 0;

        // Formula: ((Objective / Current) ^ (1 / Years)) - 1
        const irr = (Math.pow(objectivePrice / currentPrice, 1 / years) - 1) * 100;
        return irr.toFixed(2);
    };

    const handleEdit = (stock) => {
        setEditingId(stock.id);
        setEditValues({
            objectivePrice: stock.objectivePrice,
            objectiveYear: stock.objectiveYear
        });
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditValues({});
    };

    const handleSave = async (stock) => {
        setUpdateLoading(true);
        try {
            const updatedStock = {
                ...stock,
                objectivePrice: Number(editValues.objectivePrice),
                objectiveYear: Number(editValues.objectiveYear)
            };
            await updateStock(updatedStock);
            await fetchData(); // Refresh data
            setEditingId(null);
        } catch (error) {
            console.error('Error updating stock:', error);
            alert('Error al actualizar la acción');
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!newStock.ticker || !newStock.shares || !newStock.currentPrice || !newStock.objectivePrice) {
            alert('Por favor, completa todos los campos');
            return;
        }

        setUpdateLoading(true);
        try {
            const stockToAdd = {
                ticker: newStock.ticker.toUpperCase(),
                shares: Number(newStock.shares),
                currentPrice: Number(newStock.currentPrice),
                objectivePrice: Number(newStock.objectivePrice),
                objectiveYear: Number(newStock.objectiveYear)
            };
            await addStock(stockToAdd);
            await fetchData();
            setShowAddModal(false);
            setNewStock({
                ticker: '',
                shares: '',
                currentPrice: '',
                objectivePrice: '',
                objectiveYear: new Date().getFullYear() + 1
            });
        } catch (error) {
            console.error('Error adding stock:', error);
            alert('Error al añadir la acción');
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleTickerBlur = async () => {
        if (!newStock.ticker || newStock.currentPrice) return;

        const price = await fetchStockPrice(newStock.ticker.toUpperCase());
        if (price) {
            setNewStock(prev => ({
                ...prev,
                currentPrice: price
            }));
        }
    };

    const handleRefreshPrices = async () => {
        setLoading(true);
        try {
            const updatedStocks = await Promise.all(stocks.map(async (stock) => {
                const price = await fetchStockPrice(stock.ticker);
                if (price && price !== stock.currentPrice) {
                    const updatedStock = { ...stock, currentPrice: price };
                    await updateStock(updatedStock);
                    return updatedStock;
                }
                return stock;
            }));

            // Refresh all data to ensure consistency
            await fetchData();
            alert('Precios actualizados correctamente');
        } catch (error) {
            console.error('Error refreshing prices:', error);
            alert('Error al actualizar precios');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (stockId) => {
        if (!confirm('¿Estás seguro de que quieres eliminar esta acción?')) {
            return;
        }

        setUpdateLoading(true);
        try {
            await deleteStock(stockId);
            await fetchData();
        } catch (error) {
            console.error('Error deleting stock:', error);
            alert('Error al eliminar la acción');
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-accent-primary" size={48} />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <header className="mb-12 text-center md:text-left">
                <h1 className="text-5xl md:text-6xl font-bold mb-3 tracking-tight">
                    <span className="text-gradient">Seguimiento de Acciones</span>
                </h1>
                <p className="text-gray-400 text-xl">Monitoriza tu cartera de inversión</p>
            </header>

            <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/10 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-500/20 rounded-xl">
                            <TrendingUp className="text-blue-400" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Cartera</h2>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Añadir Acción
                        </button>
                        <button
                            onClick={fetchData}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
                        >
                            Actualizar Datos
                        </button>
                        <button
                            onClick={handleRefreshPrices}
                            className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                            title="Actualizar precios online"
                        >
                            <RefreshCw size={18} />
                        </button>
                    </div>
                </div>

                {error ? (
                    <div className="text-center text-red-400 py-8">
                        <AlertCircle className="mx-auto mb-2" size={32} />
                        <p className="font-bold">Error cargando datos:</p>
                        <p>{error}</p>
                    </div>
                ) : !stocks || stocks.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                        <AlertCircle className="mx-auto mb-2" size={32} />
                        <p>No hay acciones para mostrar.</p>
                        <p className="text-sm mt-2">Asegúrate de que el servidor esté corriendo y tenga datos.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-gray-400 border-b border-white/10">
                                    <th className="py-3 px-4 font-medium">Empresa</th>
                                    <th className="py-3 px-4 font-medium">Peso (%)</th>
                                    <th className="py-3 px-4 font-medium">Precio Actual</th>
                                    <th className="py-3 px-4 font-medium">Precio Objetivo</th>
                                    <th className="py-3 px-4 font-medium">Año Objetivo</th>
                                    <th className="py-3 px-4 font-medium">TIR Esperada</th>
                                    <th className="py-3 px-4 font-medium">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="text-white">
                                {stocks.map((stock) => {
                                    const weight = totalPortfolioValue > 0
                                        ? ((stock.currentPrice * stock.shares) / totalPortfolioValue) * 100
                                        : 0;

                                    const isEditing = editingId === stock.id;
                                    const irr = calculateIRR(
                                        stock.currentPrice,
                                        isEditing ? editValues.objectivePrice : stock.objectivePrice,
                                        isEditing ? editValues.objectiveYear : stock.objectiveYear
                                    );

                                    return (
                                        <tr key={stock.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-3 px-4 font-medium">{stock.ticker}</td>
                                            <td className="py-3 px-4">{weight.toFixed(2)}%</td>
                                            <td className="py-3 px-4">{stock.currentPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</td>
                                            <td className="py-3 px-4">
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        value={editValues.objectivePrice}
                                                        onChange={(e) => setEditValues({ ...editValues, objectivePrice: e.target.value })}
                                                        className="w-24 bg-black/20 border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-blue-500"
                                                    />
                                                ) : (
                                                    stock.objectivePrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        value={editValues.objectiveYear}
                                                        onChange={(e) => setEditValues({ ...editValues, objectiveYear: e.target.value })}
                                                        className="w-20 bg-black/20 border border-white/10 rounded px-2 py-1 text-white focus:outline-none focus:border-blue-500"
                                                    />
                                                ) : (
                                                    stock.objectiveYear
                                                )}
                                            </td>
                                            <td className={`py-3 px-4 font-bold ${Number(irr) >= 10 ? 'text-green-400' : Number(irr) > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                {irr}%
                                            </td>
                                            <td className="py-3 px-4">
                                                {isEditing ? (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleSave(stock)}
                                                            disabled={updateLoading}
                                                            className="p-1 hover:bg-green-500/20 rounded text-green-400 transition-colors"
                                                        >
                                                            <Save size={18} />
                                                        </button>
                                                        <button
                                                            onClick={handleCancel}
                                                            disabled={updateLoading}
                                                            className="p-1 hover:bg-red-500/20 rounded text-red-400 transition-colors"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEdit(stock)}
                                                            className="text-sm text-blue-400 hover:text-blue-300 hover:underline"
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(stock.id)}
                                                            disabled={updateLoading}
                                                            className="p-1 hover:bg-red-500/20 rounded text-red-400 transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Stock Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-md w-full">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-white">Añadir Nueva Acción</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-1 hover:bg-white/10 rounded transition-colors"
                            >
                                <X size={24} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                    Ticker
                                </label>
                                <input
                                    type="text"
                                    value={newStock.ticker}
                                    onChange={(e) => setNewStock({ ...newStock, ticker: e.target.value, currentPrice: '' })}
                                    onBlur={handleTickerBlur}
                                    placeholder="AAPL"
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">El precio se actualizará automáticamente si hay conexión API.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                    Número de Acciones
                                </label>
                                <input
                                    type="number"
                                    value={newStock.shares}
                                    onChange={(e) => setNewStock({ ...newStock, shares: e.target.value })}
                                    placeholder="10"
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                    Precio Actual (€)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={newStock.currentPrice}
                                    onChange={(e) => setNewStock({ ...newStock, currentPrice: e.target.value })}
                                    placeholder="150.00"
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                    Precio Objetivo (€)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={newStock.objectivePrice}
                                    onChange={(e) => setNewStock({ ...newStock, objectivePrice: e.target.value })}
                                    placeholder="200.00"
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                    Año Objetivo
                                </label>
                                <input
                                    type="number"
                                    value={newStock.objectiveYear}
                                    onChange={(e) => setNewStock({ ...newStock, objectiveYear: e.target.value })}
                                    placeholder="2026"
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleAdd}
                                    disabled={updateLoading}
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                >
                                    {updateLoading ? 'Añadiendo...' : 'Añadir'}
                                </button>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    disabled={updateLoading}
                                    className="flex-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StocksTracking;
