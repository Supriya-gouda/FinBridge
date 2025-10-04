import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, TrendingUp, Calculator, Clock, Target, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SimulationResult {
  totalAmount: number;
  totalInvested: number;
  totalReturns: number;
  yearlyData: { year: number; amount: number; invested: number }[];
}

interface InvestmentSimulation {
  monthlyAmount: number;
  years: number;
  expectedReturn: number;
}

interface EMISimulation {
  loanAmount: number;
  interestRate: number;
  tenure: number;
}

interface GoalSimulation {
  targetAmount: number;
  timeframe: number;
  currentSavings: number;
}

const FinancialSimulator = () => {
  const [activeTab, setActiveTab] = useState<"sip" | "emi" | "goal" | "retirement">("sip");
  const navigate = useNavigate();

  // SIP Simulation State
  const [sipParams, setSipParams] = useState<InvestmentSimulation>({
    monthlyAmount: 5000,
    years: 10,
    expectedReturn: 12
  });

  // EMI Simulation State
  const [emiParams, setEmiParams] = useState<EMISimulation>({
    loanAmount: 1000000,
    interestRate: 8.5,
    tenure: 20
  });

  // Goal Simulation State
  const [goalParams, setGoalParams] = useState<GoalSimulation>({
    targetAmount: 500000,
    timeframe: 5,
    currentSavings: 50000
  });

  // Calculate SIP Returns
  const calculateSIP = (params: InvestmentSimulation): SimulationResult => {
    const monthlyRate = params.expectedReturn / 100 / 12;
    const totalMonths = params.years * 12;
    const totalInvested = params.monthlyAmount * totalMonths;
    
    // Future Value of Annuity formula
    const futureValue = params.monthlyAmount * (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate));
    
    const yearlyData = [];
    for (let year = 1; year <= params.years; year++) {
      const months = year * 12;
      const invested = params.monthlyAmount * months;
      const amount = params.monthlyAmount * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
      yearlyData.push({ year, amount: Math.round(amount), invested });
    }

    return {
      totalAmount: Math.round(futureValue),
      totalInvested,
      totalReturns: Math.round(futureValue - totalInvested),
      yearlyData
    };
  };

  // Calculate EMI
  const calculateEMI = (params: EMISimulation) => {
    const monthlyRate = params.interestRate / 100 / 12;
    const totalMonths = params.tenure * 12;
    
    const emi = (params.loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                (Math.pow(1 + monthlyRate, totalMonths) - 1);
    
    const totalPayment = emi * totalMonths;
    const totalInterest = totalPayment - params.loanAmount;

    return {
      emi: Math.round(emi),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest)
    };
  };

  // Calculate Goal Planning
  const calculateGoalPlanning = (params: GoalSimulation) => {
    const requiredAmount = params.targetAmount - params.currentSavings;
    const monthlyRequired = requiredAmount / (params.timeframe * 12);
    
    // With 8% return assumption
    const monthlyRate = 0.08 / 12;
    const totalMonths = params.timeframe * 12;
    
    const sipRequired = requiredAmount / (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate));

    return {
      requiredAmount,
      monthlyRequired: Math.round(monthlyRequired),
      sipRequired: Math.round(sipRequired)
    };
  };

  const sipResult = calculateSIP(sipParams);
  const emiResult = calculateEMI(emiParams);
  const goalResult = calculateGoalPlanning(goalParams);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Financial Simulator</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Risk-Free Financial Planning</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Practice making financial decisions without real money. See the long-term impact of your choices.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="sip">
              <TrendingUp className="w-4 h-4 mr-2" />
              SIP Calculator
            </TabsTrigger>
            <TabsTrigger value="emi">
              <DollarSign className="w-4 h-4 mr-2" />
              EMI Calculator
            </TabsTrigger>
            <TabsTrigger value="goal">
              <Target className="w-4 h-4 mr-2" />
              Goal Planning
            </TabsTrigger>
            <TabsTrigger value="retirement">
              <Clock className="w-4 h-4 mr-2" />
              Retirement
            </TabsTrigger>
          </TabsList>

          {/* SIP Calculator */}
          <TabsContent value="sip">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-6">SIP Investment Simulator</h3>
                
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="monthly-amount">Monthly Investment Amount</Label>
                    <Input
                      id="monthly-amount"
                      type="number"
                      value={sipParams.monthlyAmount}
                      onChange={(e) => setSipParams(prev => ({ ...prev, monthlyAmount: Number(e.target.value) }))}
                      className="mt-2"
                    />
                    <p className="text-sm text-muted-foreground mt-1">₹{sipParams.monthlyAmount.toLocaleString()}</p>
                  </div>

                  <div>
                    <Label>Investment Period (Years): {sipParams.years}</Label>
                    <Slider
                      value={[sipParams.years]}
                      onValueChange={(value) => setSipParams(prev => ({ ...prev, years: value[0] }))}
                      max={30}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Expected Annual Return (%): {sipParams.expectedReturn}</Label>
                    <Slider
                      value={[sipParams.expectedReturn]}
                      onValueChange={(value) => setSipParams(prev => ({ ...prev, expectedReturn: value[0] }))}
                      max={20}
                      min={5}
                      step={0.5}
                      className="mt-2"
                    />
                  </div>

                  <Card className="p-4 bg-muted/30">
                    <h4 className="font-semibold mb-3">Investment Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Invested</p>
                        <p className="font-bold text-blue-600">₹{sipResult.totalInvested.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Returns</p>
                        <p className="font-bold text-green-600">₹{sipResult.totalReturns.toLocaleString()}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground">Final Amount</p>
                        <p className="font-bold text-2xl text-primary">₹{sipResult.totalAmount.toLocaleString()}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-6">Growth Projection</h3>
                
                <div className="h-64 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sipResult.yearlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                      <Line 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        name="Total Value"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="invested" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Total Invested"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Badge variant="outline" className="p-2 flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    Total Value
                  </Badge>
                  <Badge variant="outline" className="p-2 flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    Invested Amount
                  </Badge>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* EMI Calculator */}
          <TabsContent value="emi">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-6">EMI Calculator</h3>
                
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="loan-amount">Loan Amount</Label>
                    <Input
                      id="loan-amount"
                      type="number"
                      value={emiParams.loanAmount}
                      onChange={(e) => setEmiParams(prev => ({ ...prev, loanAmount: Number(e.target.value) }))}
                      className="mt-2"
                    />
                    <p className="text-sm text-muted-foreground mt-1">₹{emiParams.loanAmount.toLocaleString()}</p>
                  </div>

                  <div>
                    <Label>Interest Rate (% per annum): {emiParams.interestRate}</Label>
                    <Slider
                      value={[emiParams.interestRate]}
                      onValueChange={(value) => setEmiParams(prev => ({ ...prev, interestRate: value[0] }))}
                      max={15}
                      min={6}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Loan Tenure (Years): {emiParams.tenure}</Label>
                    <Slider
                      value={[emiParams.tenure]}
                      onValueChange={(value) => setEmiParams(prev => ({ ...prev, tenure: value[0] }))}
                      max={30}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-6">EMI Breakdown</h3>
                
                <div className="space-y-6">
                  <div className="text-center p-6 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Monthly EMI</p>
                    <p className="text-3xl font-bold text-primary">₹{emiResult.emi.toLocaleString()}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Principal</p>
                      <p className="font-bold text-blue-600">₹{emiParams.loanAmount.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Total Interest</p>
                      <p className="font-bold text-red-600">₹{emiResult.totalInterest.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Payment</p>
                    <p className="font-bold text-orange-600">₹{emiResult.totalPayment.toLocaleString()}</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Goal Planning */}
          <TabsContent value="goal">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-6">Goal Planning Calculator</h3>
                
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="target-amount">Target Amount</Label>
                    <Input
                      id="target-amount"
                      type="number"
                      value={goalParams.targetAmount}
                      onChange={(e) => setGoalParams(prev => ({ ...prev, targetAmount: Number(e.target.value) }))}
                      className="mt-2"
                    />
                    <p className="text-sm text-muted-foreground mt-1">₹{goalParams.targetAmount.toLocaleString()}</p>
                  </div>

                  <div>
                    <Label htmlFor="current-savings">Current Savings</Label>
                    <Input
                      id="current-savings"
                      type="number"
                      value={goalParams.currentSavings}
                      onChange={(e) => setGoalParams(prev => ({ ...prev, currentSavings: Number(e.target.value) }))}
                      className="mt-2"
                    />
                    <p className="text-sm text-muted-foreground mt-1">₹{goalParams.currentSavings.toLocaleString()}</p>
                  </div>

                  <div>
                    <Label>Time Frame (Years): {goalParams.timeframe}</Label>
                    <Slider
                      value={[goalParams.timeframe]}
                      onValueChange={(value) => setGoalParams(prev => ({ ...prev, timeframe: value[0] }))}
                      max={20}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-6">Goal Achievement Plan</h3>
                
                <div className="space-y-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Amount Still Needed</p>
                    <p className="text-2xl font-bold text-blue-600">₹{goalResult.requiredAmount.toLocaleString()}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Monthly Savings</p>
                      <p className="font-bold text-orange-600">₹{goalResult.monthlyRequired.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Without returns</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Monthly SIP</p>
                      <p className="font-bold text-green-600">₹{goalResult.sipRequired.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">With 8% returns</p>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-3">Smart Strategy</h4>
                    <div className="space-y-2 text-sm">
                      <p>• Start with SIP of ₹{goalResult.sipRequired.toLocaleString()}/month</p>
                      <p>• Invest in diversified equity funds for higher returns</p>
                      <p>• Review and increase SIP by 10% annually</p>
                      <p>• Keep emergency fund separate from this goal</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Retirement Planning */}
          <TabsContent value="retirement">
            <Card className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full gradient-primary flex items-center justify-center">
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Retirement Planning Simulator</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                This advanced feature will help you plan for your retirement with inflation-adjusted calculations.
              </p>
              <Badge variant="secondary" className="mb-4">Coming Soon</Badge>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Time Machine Mode Teaser */}
        <Card className="mt-8 p-6 gradient-hero relative overflow-hidden shadow-glow">
          <div className="absolute inset-0 bg-dots-pattern opacity-10" />
          <div className="relative z-10 text-center">
            <h3 className="text-xl font-bold text-primary-foreground mb-2">🔮 Time Machine Mode</h3>
            <p className="text-primary-foreground/90 mb-4">
              See how your financial decisions today will impact your life 10, 20, or 30 years from now!
            </p>
            <Button variant="secondary" disabled>
              Coming Soon
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default FinancialSimulator;