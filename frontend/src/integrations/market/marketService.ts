/**
 * Market integration helpers (stocks, mutual funds, gold)
 *
 * This module provides lightweight adapters to external market APIs.
 * Configure API keys / endpoints via environment variables in your .env:
 *
 * - VITE_ALPHA_VANTAGE_KEY       (stocks - Alpha Vantage GLOBAL_QUOTE)
 * - VITE_MUTUAL_FUND_API_URL     (mutual funds - custom endpoint)
 * - VITE_MUTUAL_FUND_API_KEY     (optional key for mutual fund API)
 * - VITE_METALS_API_KEY          (gold - Metals-API or similar)
 *
 * The functions return a small `MarketQuote` object or throw on network errors.
 * If keys are missing, the functions return safe mocked values so the UI can still show something.
 */

export type MarketQuote = {
  symbol: string;
  price: number;
  currency?: string;
  timestamp?: string;
  raw?: unknown;
};

const ALPHA_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY as string | undefined;
const MUTUAL_FUND_URL = import.meta.env.VITE_MUTUAL_FUND_API_URL as string | undefined;
const MUTUAL_FUND_KEY = import.meta.env.VITE_MUTUAL_FUND_API_KEY as string | undefined;
const METALS_KEY = import.meta.env.VITE_METALS_API_KEY as string | undefined;

async function fetchJson(url: string, opts?: RequestInit) {
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`Network error ${res.status} ${res.statusText}`);
  return res.json();
}

/** Get a stock quote (uses Alpha Vantage GLOBAL_QUOTE) */
export async function getStockQuote(symbol: string): Promise<MarketQuote> {
  if (ALPHA_KEY) {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${ALPHA_KEY}`;
    const data = await fetchJson(url);
    const q = data?.['Global Quote'] ?? data;
    const priceStr = q?.['05. price'] ?? q?.price ?? q?.close;
    const price = priceStr ? Number(priceStr) : NaN;
    return {
      symbol,
      price: isNaN(price) ? 0 : price,
      currency: 'USD',
      timestamp: new Date().toISOString(),
      raw: data,
    };
  }

  // Mock fallback
  return {
    symbol,
    price: 100 + Math.round(Math.random() * 1000) / 100,
    currency: 'USD',
    timestamp: new Date().toISOString(),
    raw: { mock: true },
  };
}

/** Get a mutual fund NAV/quote. Provide your own API via VITE_MUTUAL_FUND_API_URL which should accept ?id= or similar */
export async function getMutualFundNav(fundId: string): Promise<MarketQuote> {
  if (MUTUAL_FUND_URL) {
    // Support a simple templated URL like https://api.example.com/nav?id={id}
    const url = MUTUAL_FUND_URL.includes('{id}') ? MUTUAL_FUND_URL.replace('{id}', encodeURIComponent(fundId)) : `${MUTUAL_FUND_URL}?id=${encodeURIComponent(fundId)}&api_key=${MUTUAL_FUND_KEY ?? ''}`;
    const data = await fetchJson(url);
    // Best-effort parsing (APIs vary). Try common fields: nav, price, lastPrice
    const price = Number(data?.nav ?? data?.price ?? data?.lastPrice ?? data?.value ?? NaN);
    return {
      symbol: fundId,
      price: isNaN(price) ? 0 : price,
      currency: data?.currency ?? 'INR',
      timestamp: data?.date ?? new Date().toISOString(),
      raw: data,
    };
  }

  // Mock fallback
  return {
    symbol: fundId,
    price: 100 + Math.round(Math.random() * 5000) / 100,
    currency: 'INR',
    timestamp: new Date().toISOString(),
    raw: { mock: true },
  };
}

/** Get gold price (uses Metals-API or similar). We'll return price per troy ounce by default. */
export async function getGoldPrice(baseCurrency = 'USD'): Promise<MarketQuote> {
  if (METALS_KEY) {
    const url = `https://metals-api.com/api/latest?access_key=${METALS_KEY}&base=${encodeURIComponent(baseCurrency)}&symbols=XAU`;
    const data = await fetchJson(url);
    // metals-api returns rates object like { XAU: 0.0006 } representing how many XAU per base currency unit or vice versa depending on API
    // We'll try to find a sensible price
    const rate = data?.rates?.XAU ?? data?.data?.XAU ?? null;
    let price = 0;
    if (rate) {
      // If rate is in XAU per currency, convert to price per XAU
      price = 1 / Number(rate);
    }
    return {
      symbol: 'XAU',
      price: isFinite(price) ? price : 0,
      currency: baseCurrency,
      timestamp: data?.timestamp ? new Date(data.timestamp * 1000).toISOString() : new Date().toISOString(),
      raw: data,
    };
  }

  // Mock fallback (per troy ounce USD)
  return {
    symbol: 'XAU',
    price: 1900 + Math.round(Math.random() * 200),
    currency: baseCurrency,
    timestamp: new Date().toISOString(),
    raw: { mock: true },
  };
}

export default {
  getStockQuote,
  getMutualFundNav,
  getGoldPrice,
};
