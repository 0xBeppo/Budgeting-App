import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const AssetModal = ({ isOpen, onClose, onSave, initialData, type, categoryName }) => {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().slice(0, 7));
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setName(initialData.name);
                setAmount(initialData.amount.toString());
                // For editing, we don't set date as we only edit the name/current amount reference
            } else {
                setName('');
                setAmount('');
                setDate(new Date().toISOString().slice(0, 7));
            }
            setError('');
        }
    }, [isOpen, initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('El nombre es obligatorio');
            return;
        }

        if (!initialData && (!amount || isNaN(parseFloat(amount)))) {
            setError('La cantidad es obligatoria y debe ser un número');
            return;
        }

        onSave({
            name,
            amount: initialData ? undefined : parseFloat(amount),
            date: initialData ? undefined : date
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
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
                    className="bg-[#1a1b26] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-xl relative"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">
                            {initialData ? 'Editar' : 'Añadir'} {type === 'assets' ? 'Activo' : 'Pasivo'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Categoría</label>
                            <div className="text-white font-medium px-3 py-2 bg-white/5 rounded-lg border border-white/5">
                                {categoryName}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Nombre</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ej. Cuenta Ahorro"
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                                autoFocus
                            />
                        </div>

                        {!initialData && (
                            <>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Fecha Inicial</label>
                                    <input
                                        type="month"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Cantidad Inicial</label>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                                    />
                                </div>
                            </>
                        )}

                        {error && (
                            <p className="text-red-400 text-sm">{error}</p>
                        )}

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors font-medium"
                            >
                                {initialData ? 'Guardar Cambios' : 'Añadir'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AssetModal;
