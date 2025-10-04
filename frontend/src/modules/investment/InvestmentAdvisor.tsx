import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { simulateSIP, InvestmentSimulation, SimulationResult } from './investmentSimulator';
import investmentService from './investmentService';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const InvestmentAdvisor = () => {
	const [params, setParams] = useState<InvestmentSimulation>({ monthlyAmount: 5000, years: 10, expectedReturn: 12 });
	const [result, setResult] = useState<SimulationResult | null>(null);
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();

		// We'll query supabase for the current user when saving

	const runSimulation = () => {
		const res = simulateSIP(params);
		setResult(res);
	};

	const saveRecommendation = async () => {
			if (!result) {
				toast({ title: 'Nothing to save', description: 'Run a simulation first.' });
				return;
			}

			setLoading(true);
			try {
				const { data, error } = await supabase.auth.getUser();
				if (error) throw error;
				const userId = data?.user?.id;
				if (!userId) {
					toast({ title: 'Not signed in', description: 'Please sign in to save recommendations.' });
					return;
				}

				const rec = { params, result };
				const inserted = await investmentService.addRecommendation(userId, rec);
				toast({ title: 'Saved', description: `Recommendation saved (${inserted.id})` });
			} catch (err: any) {
				toast({ title: 'Error', description: err.message ?? 'Failed to save recommendation' });
			} finally {
				setLoading(false);
			}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-3xl mx-auto grid gap-6">
				<Card className="p-6">
					<h3 className="text-xl font-bold mb-4">Investment Advisor</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<Label>Monthly SIP (₹)</Label>
							<Input type="number" value={params.monthlyAmount} onChange={(e) => setParams(p => ({ ...p, monthlyAmount: Number(e.target.value) }))} />
						</div>
						<div>
							<Label>Duration (years)</Label>
							<Input type="number" value={params.years} onChange={(e) => setParams(p => ({ ...p, years: Number(e.target.value) }))} />
						</div>
						<div>
							<Label>Expected Annual Return (%)</Label>
							<Input type="number" value={params.expectedReturn} onChange={(e) => setParams(p => ({ ...p, expectedReturn: Number(e.target.value) }))} />
						</div>
					</div>

					<div className="flex gap-2 mt-4">
						<Button onClick={runSimulation}>Simulate</Button>
						<Button variant="ghost" onClick={saveRecommendation} disabled={loading || !result}>{loading ? 'Saving...' : 'Save Recommendation'}</Button>
					</div>
				</Card>

				{result && (
					<Card className="p-6">
						<h4 className="font-semibold mb-2">Simulation Result</h4>
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<p className="text-muted-foreground">Total Invested</p>
								<p className="font-bold">₹{result.totalInvested.toLocaleString()}</p>
							</div>
							<div>
								<p className="text-muted-foreground">Total Returns</p>
								<p className="font-bold text-green-600">₹{result.totalReturns.toLocaleString()}</p>
							</div>
							<div className="col-span-2">
								<p className="text-muted-foreground">Final Amount</p>
								<p className="text-2xl font-bold">₹{result.totalAmount.toLocaleString()}</p>
							</div>
						</div>

						<div className="mt-4">
							<h5 className="font-medium mb-2">Yearly Progress</h5>
							<div className="grid grid-cols-3 gap-2 text-xs">
								{result.yearlyData.map(y => (
									<div key={y.year} className="p-2 border rounded">
										<div className="text-muted-foreground">Year {y.year}</div>
										<div className="font-bold">₹{y.amount.toLocaleString()}</div>
										<div className="text-xs">Invested ₹{y.invested.toLocaleString()}</div>
									</div>
								))}
							</div>
						</div>
					</Card>
				)}
			</div>
		</div>
	);
};

export default InvestmentAdvisor;
