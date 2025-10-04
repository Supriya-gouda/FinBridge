export interface InvestmentSimulation {
	monthlyAmount: number;
	years: number;
	expectedReturn: number; // annual percent
}

export interface SimulationResult {
	totalAmount: number;
	totalInvested: number;
	totalReturns: number;
	yearlyData: { year: number; amount: number; invested: number }[];
}

/**
 * Simulate SIP returns using monthly contributions, duration (years) and expected annual return (%).
 * Uses monthly compounding and future value of annuity formula.
 */
export const simulateSIP = (params: InvestmentSimulation): SimulationResult => {
	const monthlyRate = params.expectedReturn / 100 / 12;
	const totalMonths = Math.max(0, Math.floor(params.years * 12));
	const totalInvested = params.monthlyAmount * totalMonths;

	// If monthlyRate is 0, FV is simply invested amount
	let futureValue: number;
	if (Math.abs(monthlyRate) < 1e-12) {
		futureValue = totalInvested;
	} else {
		// Future Value of an ordinary annuity compounded monthly, with contributions at month end
		futureValue = params.monthlyAmount * (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate));
	}

	const yearlyData: { year: number; amount: number; invested: number }[] = [];
	const years = Math.max(0, Math.floor(params.years));
	for (let year = 1; year <= years; year++) {
		const months = year * 12;
		const invested = params.monthlyAmount * months;
		let amount: number;
		if (Math.abs(monthlyRate) < 1e-12) {
			amount = invested;
		} else {
			amount = params.monthlyAmount * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
		}
		yearlyData.push({ year, amount: Math.round(amount), invested });
	}

	return {
		totalAmount: Math.round(futureValue),
		totalInvested,
		totalReturns: Math.round(futureValue - totalInvested),
		yearlyData
	};
};

export default { simulateSIP };
