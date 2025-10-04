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

/* eslint-disable @typescript-eslint/no-explicit-any */
export default { simulateSIP };

/**
 * Attempt to run a simulation for a saved recommendation object.
 * The recommendation object shape may be one of:
 *  - { params: { monthlyAmount, years, expectedReturn }, result: ... }
 *  - { recommendation: { params: { ... } } }
 * If SIP params are found, delegate to simulateSIP and return the result.
 */
type RecLike = { params?: Partial<InvestmentSimulation> } | { recommendation?: { params?: Partial<InvestmentSimulation> } } | Partial<InvestmentSimulation>;

export const simulateRecommendation = (rec: RecLike | null | undefined): SimulationResult | null => {
	if (!rec) return null;

		const maybeParams: unknown = (rec as unknown && typeof rec === 'object') ? ((rec as any).params ?? (rec as any).recommendation?.params ?? (rec as any).recommendation ?? null) : null;
		if (!maybeParams || typeof maybeParams !== 'object') return null;

		const getField = <T extends number | undefined>(obj: unknown, ...keys: string[]): T => {
			for (const k of keys) {
				if (obj && typeof obj === 'object' && k in (obj as any)) {
					const v = (obj as any)[k];
					if (typeof v === 'number') return v as T;
				}
			}
			return undefined as T;
		};

		const monthlyAmount = getField<number | undefined>(maybeParams, 'monthlyAmount', 'monthly_amount', 'monthly', 'amount');
		const years = getField<number | undefined>(maybeParams, 'years', 'duration', 'tenure');
		const expectedReturn = getField<number | undefined>(maybeParams, 'expectedReturn', 'expected_return', 'expected');

	if (typeof monthlyAmount === 'number' && typeof years === 'number' && typeof expectedReturn === 'number') {
		return simulateSIP({ monthlyAmount, years, expectedReturn });
	}

	return null;
};
