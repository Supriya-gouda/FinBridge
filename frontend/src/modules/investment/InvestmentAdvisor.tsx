import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { simulateSIP, simulateRecommendation, InvestmentSimulation, SimulationResult } from './investmentSimulator';
import investmentService, { getUserInvestmentRecommendations, addInvestmentRecommendation, InvestmentRecommendation } from './investmentService';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import alertsService from '@/modules/alerts/alertsService';

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

		// Recommendations state
		const [recs, setRecs] = useState<InvestmentRecommendation[]>([]);
		const [recSimResults, setRecSimResults] = useState<Record<string, SimulationResult | null>>({});

		const loadRecommendations = async () => {
			try {
				const { data, error } = await supabase.auth.getUser();
				if (error) throw error;
				const userId = data?.user?.id;
				if (!userId) return;
				const items = await getUserInvestmentRecommendations(userId);
				setRecs(items);
			} catch (err: unknown) {
				console.warn('loadRecommendations failed', err);
			}
		};

			// load on mount
			useEffect(() => { loadRecommendations(); }, []);

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
								const inserted = await addInvestmentRecommendation(userId, rec);
								toast({ title: 'Saved', description: `Recommendation saved (${inserted.id})` });

								// create a linked alert so the user is notified (e.g., in SmartAlerts)
								try {
									await alertsService.addAlert({
										user_id: userId,
										type: 'investment',
										title: 'New Investment Recommendation Saved',
										description: `A recommendation was saved: ${inserted.id}`,
										priority: 'medium',
										enabled: true,
										frequency: 'once',
										metadata: { recommendation_id: inserted.id }
									});
								} catch (alertErr) {
									console.warn('Failed to create linked alert', alertErr);
								}

								// refresh list
								await loadRecommendations();
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : String(err ?? 'Failed to save recommendation');
				toast({ title: 'Error', description: message });
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

				{/* Recommendations list */}
				<Card className="p-6">
					<h4 className="font-semibold mb-2">Saved Recommendations</h4>
					<div className="mb-4 flex gap-2">
						<Button onClick={loadRecommendations}>Refresh</Button>
					</div>
					{recs.length === 0 ? (
						<p className="text-sm text-muted-foreground">No recommendations yet.</p>
					) : (
						<div className="space-y-3">
							{recs.map((r, idx) => {
								const key = r.id ?? String(idx);
								const sim = recSimResults[key];
								return (
									<div key={key} className="p-3 border rounded">
										<div className="flex items-start justify-between">
											<div>
												<div className="text-xs text-muted-foreground">{r.created_at ? new Date(r.created_at).toLocaleString() : ''}</div>
												<div className="font-medium">Recommendation</div>
											</div>
											<div>
												<Button size="sm" onClick={() => {
													const res = simulateRecommendation(r.recommendation ?? r);
													setRecSimResults(prev => ({ ...prev, [key]: res }));
												}}>Simulate</Button>
												<Button size="sm" variant="destructive" className="ml-2" onClick={async () => {
													if (!r.id) return;
													try {
														await (await import('./investmentService')).deleteRecommendation(r.id);
														toast({ title: 'Deleted', description: 'Recommendation removed' });
														await loadRecommendations();
													} catch (e) {
														console.warn('Failed to delete recommendation', e);
														toast({ title: 'Error', description: 'Failed to delete recommendation' });
													}
												}}>Delete</Button>
											</div>
										</div>
										<pre className="text-xs mt-2 max-h-40 overflow-auto">{JSON.stringify(r.recommendation ?? r, null, 2)}</pre>
										{sim && (
											<div className="mt-3 p-2 bg-gray-50 rounded">
												<div className="text-sm font-medium">Simulated Outcome</div>
												<div className="text-xs">Final Amount: ₹{sim.totalAmount.toLocaleString()}</div>
												<div className="text-xs">Total Invested: ₹{sim.totalInvested.toLocaleString()}</div>
												<div className="text-xs">Total Returns: ₹{sim.totalReturns.toLocaleString()}</div>
											</div>
										)}
									</div>
								);
							})}
						</div>
					)}
				</Card>
			</div>
		</div>
	);
};

export default InvestmentAdvisor;
