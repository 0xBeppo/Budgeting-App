import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

const ExpenseForm = ({ categories, onAddExpense }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!description || !amount || !categoryId || !date) return;

        onAddExpense({
            description,
            amount: parseFloat(amount),
            categoryId: parseInt(categoryId),
            date
        });

        // Reset form
        setDescription('');
        setAmount('');
        setCategoryId('');
        setDate(new Date().toISOString().split('T')[0]);
    };

    return (
        <div className="glass-panel p-6">
            <h2 className="text-2xl font-bold mb-6 text-white">Añadir Gasto</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Descripción</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-accent-primary"
                        placeholder="Ej: Compra semanal"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Cantidad (€)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-accent-primary"
                            placeholder="0.00"
                            step="0.01"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Fecha</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-accent-primary"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Categoría</label>
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-accent-primary"
                        required
                    >
                        <option value="">Seleccionar categoría</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-accent-primary hover:bg-accent-secondary text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors"
                >
                    <PlusCircle size={20} />
                    Añadir Gasto
                </button>
            </form>
        </div>
    );
};

export default ExpenseForm;
