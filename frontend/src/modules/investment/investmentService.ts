/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/integrations/supabase/client';

type RpcResponse<T = unknown> = { data?: T; error?: { message?: string } | null };
type FromResponse<T = unknown> = { data?: T; error?: unknown };

export type InvestmentRecommendation = {
	id?: string;
	user_id: string;
	recommendation: Record<string, unknown>;
	created_at?: string;
};

export const addRecommendation = async (userId: string, recommendation: Record<string, unknown>) => {
	// Try RPC first (preferred). If RPC isn't deployed or fails, fall back to direct table insert.
	try {
			const rpcResp = await (supabase as unknown as { rpc: (fn: string, p: unknown) => Promise<RpcResponse> }).rpc('add_investment_recommendation', { user_uuid: userId, rec: recommendation });
			const data = rpcResp?.data;
			const error = rpcResp?.error;
			if (!error && data) {
				if (Array.isArray(data)) return data[0] as InvestmentRecommendation;
				return data as InvestmentRecommendation;
			}
			if (error) console.warn('addRecommendation RPC error, falling back to table insert:', (error as { message?: string })?.message ?? error);
	} catch (rpcErr: any) {
		// rpc may throw in some environments — fall back
		console.warn('addRecommendation RPC threw, falling back to table insert:', rpcErr?.message ?? rpcErr);
	}

	// Fallback: insert directly into table
			const insertResp = await (supabase as unknown as { from: (t: string) => any }).from('investment_recommendations').insert({ user_id: userId, recommendation }).select().limit(1).single();
			const insertData = (insertResp as FromResponse)["data"];
			const insertError = (insertResp as FromResponse)["error"];
			if (insertError) {
				console.error('addRecommendation insert error', insertError);
				throw insertError;
			}

			return insertData as InvestmentRecommendation;
};

export const getRecommendations = async (userId: string, limit = 50, offset = 0) => {
	// Try RPC first, then fall back to selecting from the table if RPC isn't available.
	try {
		const rpcResp = await (supabase as unknown as { rpc: (fn: string, p: unknown) => Promise<RpcResponse> }).rpc('get_investment_recommendations', { user_uuid: userId, limit, offset });
		const data = rpcResp?.data;
		const error = rpcResp?.error;
		if (!error && data) return (data ?? []) as InvestmentRecommendation[];
		if (error) console.warn('getRecommendations RPC error, falling back to table select:', (error as { message?: string })?.message ?? error);
	} catch (rpcErr: any) {
		console.warn('getRecommendations RPC threw, falling back to table select:', rpcErr?.message ?? rpcErr);
	}

	// Fallback: query the table directly
			const resp = await (supabase as unknown as { from: (t: string) => any }).from('investment_recommendations').select('*').eq('user_id', userId).order('created_at', { ascending: false }).range(offset, offset + limit - 1);
			const data = (resp as FromResponse)["data"];
			const error = (resp as FromResponse)["error"];
			if (error) {
				console.error('getRecommendations select error', error);
				throw error;
			}

			return (data ?? []) as unknown as InvestmentRecommendation[];
};

export default {
	addRecommendation,
	getRecommendations,
};

// Backwards-compatible named exports requested by UI
export const addInvestmentRecommendation = addRecommendation;
export const getUserInvestmentRecommendations = getRecommendations;

export const deleteRecommendation = async (id: string) => {
	// try to call an RPC first (if you add one later), otherwise delete directly
	try {
		// If an RPC named delete_investment_recommendation is added in DB, this will use it
		const rpcResp = await (supabase as unknown as { rpc: (fn: string, p: unknown) => Promise<RpcResponse> }).rpc('delete_investment_recommendation', { rec_id: id });
		const data = rpcResp?.data;
		const error = rpcResp?.error;
		if (!error && data) return data as unknown as { id: string };
		if (error) console.warn('deleteRecommendation RPC error, falling back:', (error as { message?: string })?.message ?? error);
	} catch (e: any) {
		console.warn('deleteRecommendation RPC threw, falling back:', e?.message ?? e);
	}

		const resp = await (supabase as unknown as { from: (t: string) => any }).from('investment_recommendations').delete().eq('id', id).select().limit(1).single();
		const data = (resp as FromResponse)["data"];
		const error = (resp as FromResponse)["error"];
		if (error) {
			console.error('deleteRecommendation error', error);
			throw error;
		}

		return data as unknown as { id: string };
};

export const deleteInvestmentRecommendation = deleteRecommendation;
