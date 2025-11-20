export const calculateYTD = (currentAmount, history) => {
    if (!history || history.length === 0) {
        return { percentage: 0, difference: 0 };
    }

    // Get current year
    const currentYear = new Date().getFullYear();

    // Filter history for current year
    const currentYearHistory = history.filter(h => new Date(h.date).getFullYear() === currentYear);

    if (currentYearHistory.length === 0) {
        return { percentage: 0, difference: 0 };
    }

    // Sort by date ascending
    const sortedHistory = [...currentYearHistory].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Get the first entry of the year (baseline)
    const baselineAmount = sortedHistory[0].amount;

    if (baselineAmount === 0) {
        return { percentage: 0, difference: currentAmount };
    }

    const difference = currentAmount - baselineAmount;
    const percentage = (difference / baselineAmount) * 100;

    return {
        percentage,
        difference
    };
};

export const calculateAggregatedYTD = (items) => {
    const currentYear = new Date().getFullYear();
    let totalCurrent = 0;
    let totalBaseline = 0;

    items.forEach(item => {
        // Add current amount
        totalCurrent += item.amount;

        // Find baseline for this item
        if (item.history && item.history.length > 0) {
            const currentYearHistory = item.history.filter(h => new Date(h.date).getFullYear() === currentYear);

            if (currentYearHistory.length > 0) {
                // Sort by date ascending
                const sortedHistory = [...currentYearHistory].sort((a, b) => new Date(a.date) - new Date(b.date));
                totalBaseline += sortedHistory[0].amount;
            } else {
                // If no history for this year, assume no change (baseline = current) or 0? 
                // Let's assume baseline = current if no history exists for the year to avoid skewing with 0s if it's just missing data
                // BUT if it's a new asset bought this year, it should have history.
                // If we assume 0, it might show 100% growth which is technically true for new assets.
                // Let's stick to the plan: "If the item has no history in the current year, YTD will be shown as 0%."
                // This implies we treat baseline as current for neutral impact, OR we just ignore it.
                // Let's treat baseline as current amount so it contributes 0 change.
                totalBaseline += item.amount;
            }
        } else {
            totalBaseline += item.amount;
        }
    });

    if (totalBaseline === 0) return 0;

    return ((totalCurrent - totalBaseline) / totalBaseline) * 100;
};
