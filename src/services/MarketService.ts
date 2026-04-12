import { Asset, AssetDepth } from '../models/Asset';

export class MarketService {
  private static assets: Asset[] = [];
  private static orderBookDepth: AssetDepth[] = [];

  static getAllAssets(): Asset[] {
    return [...this.assets];
  }

  static getAssetBySymbol(symbol: string): Asset | null {
    return this.assets.find(asset => asset.symbol === symbol) || null;
  }

  static getOrderBookDepth(pair: string): { bids: AssetDepth[], asks: AssetDepth[] } {
    const depths = this.orderBookDepth.filter(depth => depth.pair === pair);
    
    return {
      bids: depths.filter(d => d.type === 'BID').sort((a, b) => b.price - a.price),
      asks: depths.filter(d => d.type === 'ASK').sort((a, b) => a.price - b.price)
    };
  }

  static getBestBid(pair: string): number | null {
    const bids = this.getOrderBookDepth(pair).bids;
    return bids.length > 0 ? bids[0].price : null;
  }

  static getBestAsk(pair: string): number | null {
    const asks = this.getOrderBookDepth(pair).asks;
    return asks.length > 0 ? asks[0].price : null;
  }

  static updateAssetPrice(symbol: string, price: number): void {
    const asset = this.getAssetBySymbol(symbol);
    if (asset) {
      const oldPrice = asset.price;
      asset.price = price;
      asset.change24h = price - oldPrice;
      asset.changePercent24h = ((price - oldPrice) / oldPrice) * 100;
      asset.lastUpdated = Date.now();
    }
  }

  static addOrderBookDepth(depth: AssetDepth): void {
    this.orderBookDepth.push(depth);
  }

  // Mock data initialization
  static initializeMockData(): void {
    const mockAssets: Asset[] = [
      {
        id: 'BTC',
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 64050.25,
        change24h: 1250.50,
        changePercent24h: 1.99,
        volume24h: 28500000000,
        marketCap: 1250000000000,
        lastUpdated: Date.now()
      },
      {
        id: 'ETH',
        symbol: 'ETH',
        name: 'Ethereum',
        price: 3450.75,
        change24h: -85.25,
        changePercent24h: -2.41,
        volume24h: 1560000000,
        marketCap: 415000000000,
        lastUpdated: Date.now()
      },
      {
        id: 'SOL',
        symbol: 'SOL',
        name: 'Solana',
        price: 145.30,
        change24h: 8.75,
        changePercent24h: 6.41,
        volume24h: 285000000,
        marketCap: 65000000000,
        lastUpdated: Date.now()
      }
    ];

    this.assets.push(...mockAssets);

    // Mock order book depth
    const mockDepths: AssetDepth[] = [
      { pair: 'BTC/USDT', price: 64000, quantity: 1.5, type: 'BID' },
      { pair: 'BTC/USDT', price: 64010, quantity: 0.8, type: 'BID' },
      { pair: 'BTC/USDT', price: 64020, quantity: 2.1, type: 'BID' },
      { pair: 'BTC/USDT', price: 64050, quantity: 1.2, type: 'ASK' },
      { pair: 'BTC/USDT', price: 64060, quantity: 0.9, type: 'ASK' },
      { pair: 'BTC/USDT', price: 64070, quantity: 1.8, type: 'ASK' }
    ];

    this.orderBookDepth.push(...mockDepths);
  }
}
