/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/integrations/supabase/client';

type RpcResponse<T = unknown> = { data?: T; error?: { message?: string } | null };

export type UserAlert = {
  id?: string;
  user_id: string;
  type: string;
  title: string;
  description?: string;
  amount?: number;
  due_date?: string;
  priority?: 'high'|'medium'|'low';
  enabled?: boolean;
  frequency?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
};

export const addAlert = async (alert: Omit<UserAlert, 'id' | 'created_at'>) => {
  try {
    const rpcResp = await (supabase as unknown as { rpc: (fn: string, p: unknown) => Promise<RpcResponse<UserAlert>> }).rpc('add_user_alert', alert);
    const data = rpcResp?.data;
    const error = rpcResp?.error;
    if (!error && data) return Array.isArray(data) ? (data[0] as UserAlert) : (data as UserAlert);
    if (error) console.warn('addAlert RPC error, falling back:', (error as { message?: string })?.message ?? error);
  } catch (e) {
    console.warn('addAlert RPC threw, falling back:', (e instanceof Error ? e.message : String(e)));
  }

  const insertResp = await (supabase as any).from('user_alerts').insert(alert).select().limit(1).single();
  const insertData = (insertResp as any)?.data;
  const insertError = (insertResp as any)?.error;
  if (insertError) throw insertError;
  return Array.isArray(insertData) ? (insertData[0] as UserAlert) : (insertData as UserAlert);
};

export const getUserAlerts = async (userId: string, limit = 50, offset = 0) => {
  try {
    const rpcResp = await (supabase as unknown as { rpc: (fn: string, p: unknown) => Promise<RpcResponse<UserAlert[]>> }).rpc('get_user_alerts', { user_uuid: userId, limit, offset });
    const data = rpcResp?.data;
    const error = rpcResp?.error;
    if (!error && data) return (data as UserAlert[]) ?? [];
    if (error) console.warn('getUserAlerts RPC error, falling back:', (error as { message?: string })?.message ?? error);
  } catch (e) {
    console.warn('getUserAlerts RPC threw, falling back:', (e instanceof Error ? e.message : String(e)));
  }

  const resp = await (supabase as any).from('user_alerts').select('*').eq('user_id', userId).order('created_at', { ascending: false }).range(offset, offset + limit - 1);
  const data = (resp as any)?.data;
  const error = (resp as any)?.error;
  if (error) throw error;
  return (data ?? []) as UserAlert[];
};

export default { addAlert, getUserAlerts };
