import React, { useState, useEffect } from 'react';
import { getMonthlyBudget, updateMonthlyBudget } from '../services/api';
import BudgetSummary from './BudgetSummary';
import BudgetCategoryList from './BudgetCategoryList';
import ExpenseForm from './ExpenseForm';
import BudgetAnalysisModal from './BudgetAnalysisModal';
import { Loader2 } from 'lucide-react';

const MonthlyBudget = () => {
    const [budgetData, setBudgetData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAnalysisModal, setShowAnalysisModal] = useState(false);

    useEffect(() => {
        const fetchBudget = async () => {
            try {
                const data = await getMonthlyBudget();
                setBudgetData(data);
            } catch (err) {
                setError('Error al cargar el presupuesto.');
            } finally {
                setLoading(false);
            }
        };
        fetchBudget();
    }, []);

    const handleUpdateTarget = async (categoryId, newTarget) => {
        if (!budgetData) return;

        const updatedCategories = budgetData.categories.map(cat =>
            cat.id === categoryId ? { ...cat, target: newTarget } : cat
        );

        const updatedBudget = { ...budgetData, categories: updatedCategories };
        setBudgetData(updatedBudget); // Optimistic update

        try {
            await updateMonthlyBudget(updatedBudget);
        } catch (err) {
            console.error('Error updating target:', err);
            // Revert or show error (omitted for brevity)
        }
    };

    const handleUpdateIncome = async (newIncome) => {
        if (!budgetData) return;

        const updatedBudget = { ...budgetData, income: newIncome };
        setBudgetData(updatedBudget); // Optimistic update

        try {
            await updateMonthlyBudget(updatedBudget);
        } catch (err) {
            console.error('Error updating income:', err);
        }
    };

    const handleAddExpense = async (expense) => {
        if (!budgetData) return;

        const newExpenses = [...budgetData.expenses, { ...expense, id: Date.now() }];

        // Update spent amount for the category
        const newCategories = budgetData.categories.map(cat => {
            if (cat.id === expense.categoryId) {
                return { ...cat, spent: cat.spent + expense.amount };
            }
            return cat;
        });

        const updatedBudget = {
            ...budgetData,
            expenses: newExpenses,
            categories: newCategories
        };

        setBudgetData(updatedBudget); // Optimistic update

        try {
            await updateMonthlyBudget(updatedBudget);
        } catch (err) {
            console.error('Error adding expense:', err);
        }
    };

    const handleAddCategory = async (type) => {
        if (!budgetData) return;

        const newCategory = {
            id: Date.now(),
            name: 'Nueva Categoría',
            target: 0,
            spent: 0,
            color: '#9CA3AF', // Default gray
            type: type
        };

        const updatedCategories = [...budgetData.categories, newCategory];
        const updatedBudget = { ...budgetData, categories: updatedCategories };
        setBudgetData(updatedBudget); // Optimistic update

        try {
            await updateMonthlyBudget(updatedBudget);
        } catch (err) {
            console.error('Error adding category:', err);
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        if (!budgetData) return;

        const updatedCategories = budgetData.categories.filter(cat => cat.id !== categoryId);
        const updatedBudget = { ...budgetData, categories: updatedCategories };
        setBudgetData(updatedBudget); // Optimistic update

        try {
            await updateMonthlyBudget(updatedBudget);
        } catch (err) {
            console.error('Error deleting category:', err);
        }
    };

    const handleEditCategoryName = async (categoryId, newName) => {
        if (!budgetData) return;

        const updatedCategories = budgetData.categories.map(cat =>
            cat.id === categoryId ? { ...cat, name: newName } : cat
        );

        const updatedBudget = { ...budgetData, categories: updatedCategories };
        setBudgetData(updatedBudget); // Optimistic update

        try {
            await updateMonthlyBudget(updatedBudget);
        } catch (err) {
            console.error('Error updating category name:', err);
        }
    };

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

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <header className="mb-12 text-center md:text-left">
                <h1 className="text-5xl md:text-6xl font-bold mb-3 tracking-tight">
                    <span className="text-gradient">Presupuesto Mensual</span>
                </h1>
                <p className="text-gray-400 text-xl">Gestiona tu presupuesto base cero</p>
            </header>

            <BudgetSummary
                income={budgetData.income}
                categories={budgetData.categories}
                expenses={budgetData.expenses}
                onUpdateIncome={handleUpdateIncome}
                onBudgetClick={() => setShowAnalysisModal(true)}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <BudgetCategoryList
                        categories={budgetData.categories}
                        onUpdateTarget={handleUpdateTarget}
                        onAddCategory={handleAddCategory}
                        onDeleteCategory={handleDeleteCategory}
                        onEditCategoryName={handleEditCategoryName}
                    />
                </div>
                <div>
                    <ExpenseForm
                        categories={budgetData.categories}
                        onAddExpense={handleAddExpense}
                    />
                </div>
            </div>

            <BudgetAnalysisModal
                isOpen={showAnalysisModal}
                onClose={() => setShowAnalysisModal(false)}
                categories={budgetData.categories}
            />
        </div>
    );
};

export default MonthlyBudget;
