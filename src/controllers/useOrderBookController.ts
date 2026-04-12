import { useState, useCallback, useEffect } from 'react';
import { Asset, AssetDepth } from '../models/Asset';
import { MarketService } from '../services/MarketService';

export interface OrderBookControllerState {
  bids: AssetDepth[];
  asks: AssetDepth[];
  bestBid: number | null;
  bestAsk: number | null;
  spread: number | null;
  loading: boolean;
  selectedPair: string;
}

export interface OrderBookControllerActions {
  setSelectedPair: (pair: string) => void;
  refreshOrderBook: () => void;
}

export const useOrderBookController = (pair: string = 'BTC/USDT'): OrderBookControllerState & OrderBookControllerActions => {
  const [state, setState] = useState<OrderBookControllerState>({
    bids: [],
    asks: [],
    bestBid: null,
    bestAsk: null,
    spread: null,
    loading: false,
    selectedPair: pair
  });

  const setSelectedPair = useCallback((newPair: string) => {
    setState(prev => ({ ...prev, selectedPair: newPair }));
  }, []);

  const refreshOrderBook = useCallback(() => {
    setState(prev => ({ ...prev, loading: true }));

    const depth = MarketService.getOrderBookDepth(state.selectedPair);
    const bestBid = MarketService.getBestBid(state.selectedPair);
    const bestAsk = MarketService.getBestAsk(state.selectedPair);

    setState(prev => ({
      ...prev,
      ...depth,
      bestBid,
      bestAsk,
      spread: bestBid && bestAsk ? bestAsk - bestBid : null,
      loading: false
    }));
  }, [state.selectedPair]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate price movements
      if (Math.random() > 0.7) {
        const asset = MarketService.getAssetBySymbol(state.selectedPair.split('/')[0]);
        if (asset) {
          const priceChange = (Math.random() - 0.5) * 100;
          MarketService.updateAssetPrice(asset.symbol, asset.price + priceChange);
          refreshOrderBook();
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [refreshOrderBook, state.selectedPair]);

  useEffect(() => {
    refreshOrderBook();
  }, [refreshOrderBook, state.selectedPair]);

  return {
    ...state,
    setSelectedPair,
    refreshOrderBook
  };
};
