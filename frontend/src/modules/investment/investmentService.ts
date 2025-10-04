import { supabase } from '@/integrations/supabase/client';

export type InvestmentRecommendation = {
	id?: string;
	user_id: string;
	recommendation: Record<string, unknown>;
	created_at?: string;
};

export const addRecommendation = async (userId: string, recommendation: Record<string, unknown>) => {
	// Calls the Supabase RPC function add_investment_recommendation
	const { data, error } = await supabase.rpc('add_investment_recommendation', { user_uuid: userId, rec: recommendation });

	if (error) {
		console.error('addRecommendation error', error);
		throw error;
	}

	// The function returns a single row as array-like result; normalize it
	// If PostgREST wraps the result, data may be an array. Return the first element if so.
	if (Array.isArray(data)) return data[0] as InvestmentRecommendation;
	return data as InvestmentRecommendation;
};

export const getRecommendations = async (userId: string, limit = 50, offset = 0) => {
	// Calls the Supabase RPC function get_investment_recommendations
	const { data, error } = await supabase.rpc('get_investment_recommendations', { user_uuid: userId, limit, offset });

	if (error) {
		console.error('getRecommendations error', error);
		throw error;
	}

	return (data ?? []) as InvestmentRecommendation[];
};

export default {
	addRecommendation,
	getRecommendations,
};
