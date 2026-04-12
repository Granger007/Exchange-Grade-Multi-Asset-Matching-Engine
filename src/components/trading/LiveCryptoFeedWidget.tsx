'use client';
import React from 'react';
import { useCryptoWebSocket } from '@/hooks/useCryptoWebSocket';
import { Wifi, WifiOff } from 'lucide-react';

export function LiveCryptoFeedWidget() {
  const { status, currentPrice, priceChange24h, recentTrades, orderBook } = useCryptoWebSocket('BTC/USD');

  return (
    <div className="bg-background/40 backdrop-blur-md rounded-2xl border border-white/10 p-4">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
        <div>
           <h2 className="text-xl font-bold text-white flex items-center gap-2">
              BTC/USD 
              <span className="text-xs bg-white/10 px-2 py-1 rounded text-white/70 font-mono">Perpetual</span>
           </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
           {status === 'connected' ? (
             <span className="text-emerald-400 flex items-center gap-1.5 px-2 py-1 bg-emerald-400/10 rounded border border-emerald-400/20">
               <Wifi className="w-3 h-3 animate-pulse" /> Live WebSocket
             </span>
           ) : (
             <span className="text-orange-400 flex items-center gap-1.5 px-2 py-1 bg-orange-400/10 rounded border border-orange-400/20">
               <WifiOff className="w-3 h-3" /> Connecting...
             </span>
           )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Quick Price Info & Recent Trades */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
           {/* Price block */}
           <div className="bg-black/20 rounded-xl p-4 border border-white/5">
             <div className="text-sm text-white/50 mb-1">Mark Price</div>
             <div className={`text-4xl font-mono tracking-tight font-bold transition-colors duration-200 ${
                recentTrades[0]?.side === 'BUY' ? 'text-emerald-400' : 'text-red-400'
             }`}>
               ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
             </div>
             <div className={`text-sm mt-1 flex items-center gap-1 ${priceChange24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
               {priceChange24h >= 0 ? '▲' : '▼'} {Math.abs(priceChange24h)}% (24h)
             </div>
           </div>

           {/* Live Trades Stream */}
           <div className="flex-1 bg-black/20 rounded-xl p-3 border border-white/5 flex flex-col">
              <h3 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-2">Live Trades</h3>
              <div className="flex justify-between text-[10px] text-white/40 mb-1 px-1">
                <span>Price</span>
                <span>Amount</span>
                <span>Time</span>
              </div>
              <div className="flex-1 overflow-hidden relative">
                 <div className="absolute inset-0 overflow-y-auto custom-scrollbar pr-1">
                   {recentTrades.map((trade, i) => (
                     <div key={trade.id + i} className="flex justify-between items-center text-xs font-mono py-1 hover:bg-white/5 px-1 rounded transition-colors animate-in fade-in slide-in-from-top-2 duration-200">
                        <span className={trade.side === 'BUY' ? 'text-emerald-400' : 'text-red-400'}>
                          {trade.price.toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </span>
                        <span className="text-white/80">{trade.amount.toFixed(4)}</span>
                        <span className="text-white/40">{trade.time.toLocaleTimeString([], { hour12: false, second: '2-digit', fractionalSecondDigits: 1 } as any)}</span>
                     </div>
                   ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Right: Order Book Depth */}
        <div className="w-full lg:w-2/3 bg-black/20 rounded-xl p-4 border border-white/5">
           <h3 className="text-xs font-bold text-white/70 uppercase tracking-wider mb-2">Order Book (Real-time)</h3>
           <div className="flex text-[10px] text-white/40 mb-2">
              <div className="w-1/3">Avg Price</div>
              <div className="w-1/3 text-right">Size</div>
              <div className="w-1/3 text-right">Total</div>
           </div>
           
           <div className="space-y-4">
             {/* Asks (Sells) */}
             <div className="space-y-[1px] flex flex-col-reverse">
               {orderBook.asks.slice(0, 7).map((ask, i) => (
                 <div key={`ask-${i}`} className="flex text-xs font-mono py-0.5 relative group cursor-pointer">
                    <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded"></div>
                    {/* Depth bar */}
                    <div className="absolute top-0 bottom-0 right-0 bg-red-500/10" style={{ width: `${Math.min((ask.total / 20) * 100, 100)}%` }}></div>
                    <div className="w-1/3 text-red-400 z-10 pl-1">{ask.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                    <div className="w-1/3 text-right text-white/80 z-10">{ask.size.toFixed(2)}</div>
                    <div className="w-1/3 text-right text-white/50 z-10 pr-1">{ask.total.toFixed(2)}</div>
                 </div>
               ))}
             </div>

             {/* Spread / Mark Price Indicator */}
             <div className="py-2 flex items-center justify-between border-y border-white/10 bg-white/[0.02]">
                <span className="text-lg font-bold text-white ml-2">${currentPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                <span className="text-xs text-white/40 mr-2 border border-white/10 px-2 py-0.5 rounded-full">Spread: 0.01</span>
             </div>

             {/* Bids (Buys) */}
             <div className="space-y-[1px]">
               {orderBook.bids.slice(0, 7).map((bid, i) => (
                 <div key={`bid-${i}`} className="flex text-xs font-mono py-0.5 relative group cursor-pointer">
                    <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded"></div>
                    {/* Depth bar */}
                    <div className="absolute top-0 bottom-0 right-0 bg-emerald-500/10" style={{ width: `${Math.min((bid.total / 20) * 100, 100)}%` }}></div>
                    <div className="w-1/3 text-emerald-400 z-10 pl-1">{bid.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                    <div className="w-1/3 text-right text-white/80 z-10">{bid.size.toFixed(2)}</div>
                    <div className="w-1/3 text-right text-white/50 z-10 pr-1">{bid.total.toFixed(2)}</div>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
