# Trading Dashboard

A professional trading platform frontend built with Next.js, TypeScript, and TailwindCSS featuring glassmorphism design. This application is designed to integrate seamlessly with a Java Spring Boot backend.

## Features

### 🎨 **Design System**
- **Glassmorphism UI** with blur effects and transparent cards
- **Dark theme** optimized for trading environments
- **Responsive layout** for desktop and mobile devices
- **Smooth animations** and hover effects

### 📊 **Trading Features**
- **Cryptocurrency tracking** with real-time price updates
- **Stock market monitoring** with interactive charts
- **Equity investments** management with risk scoring
- **Portfolio overview** with performance analytics
- **Risk monitoring system** with early warning alerts
- **Market overview** cards for major indices

### 🛠️ **Technical Architecture**
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **TailwindCSS** with custom glassmorphism utilities
- **Recharts** for interactive data visualization
- **Lucide React** for modern icons

### 🔗 **Backend Integration Ready**
- **REST API structure** prepared for Java Spring Boot
- **Placeholder API endpoints** for development
- **Type-safe interfaces** for API responses
- **Error handling** and loading states

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Main dashboard
│   ├── crypto/           # Cryptocurrency page
│   ├── stocks/           # Stock markets page
│   ├── equity/           # Equity investments page
│   ├── portfolio/        # Portfolio overview page
│   ├── risk/             # Risk monitoring page
│   └── notifications/    # Notifications center
├── components/            # Reusable React components
│   ├── GlassCard.tsx     # Glassmorphism card wrapper
│   ├── Sidebar.tsx       # Collapsible navigation
│   ├── Navbar.tsx        # Sticky top navigation
│   ├── MarketCard.tsx    # Market overview cards
│   ├── PortfolioChart.tsx # Portfolio performance charts
│   ├── CryptoTable.tsx   # Cryptocurrency data table
│   ├── StockTable.tsx    # Stock market data table
│   ├── EquityTable.tsx   # Equity investments table
│   ├── RiskAlerts.tsx    # Risk monitoring panel
│   └── NotificationPanel.tsx # Floating notifications
└── lib/
    └── api.ts            # API client and interfaces
```

## API Integration

The frontend is structured to work with the following REST API endpoints:

### Market Data
- `GET /api/crypto` - Cryptocurrency data
- `GET /api/stocks` - Stock market data
- `GET /api/equity` - Equity investments
- `GET /api/portfolio` - Portfolio overview
- `GET /api/risk-alerts` - Risk monitoring alerts
- `GET /api/notifications` - User notifications

### Trading Operations
- `POST /api/trades` - Execute trades
- `GET /api/trades/history` - Trade history

### Configuration
- `PUT /api/portfolio` - Update portfolio settings
- `DELETE /api/risk-alerts/{id}` - Dismiss risk alerts
- `PUT /api/notifications/{id}/read` - Mark notifications as read

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd trading-dashboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:3000`

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Backend Integration

### Java Spring Boot Setup

The frontend expects the following API response formats:

#### Crypto Data Response
```json
{
  "data": [
    {
      "id": "1",
      "name": "Bitcoin",
      "symbol": "BTC",
      "price": 43567,
      "change24h": 1234,
      "volume": "28.5B",
      "marketCap": "852B"
    }
  ],
  "message": "Success",
  "status": 200
}
```

#### Portfolio Data Response
```json
{
  "data": {
    "totalValue": 72000,
    "dailyChange": 2340,
    "dailyChangePercent": 3.4,
    "assetAllocation": {
      "crypto": 35,
      "stocks": 40,
      "equity": 25
    },
    "performance": [
      {"date": "Jan", "value": 45000},
      {"date": "Feb", "value": 52000}
    ]
  },
  "message": "Success",
  "status": 200
}
```

## Component Architecture

### GlassCard Component
Reusable glassmorphism wrapper with optional hover effects and accent colors.

```tsx
<GlassCard hover accent="green" className="p-6">
  <Content />
</GlassCard>
```

### API Client
Type-safe API client with error handling:

```tsx
import { apiClient } from '@/lib/api';

const cryptoData = await apiClient.getCryptoData();
const portfolioData = await apiClient.getPortfolioData();
```

## Styling

### Glassmorphism Classes
```css
.glass-card {
  backdrop-blur-lg;
  bg-white/5;
  border border-white/10;
  rounded-2xl;
}

.glass-card-hover {
  transition-all duration-300;
  hover:bg-white/10;
  hover:border-white/20;
  hover:shadow-xl;
}
```

### Accent Colors
- **Primary Green**: `#10b981` - Profit indicators
- **Primary Pink**: `#ec4899` - Risk alerts
- **Primary Purple**: `#a855f7` - Secondary actions
- **Primary Blue**: `#3b82f6` - Primary actions

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality
- TypeScript for type safety
- ESLint for code consistency
- Component-based architecture
- Responsive design principles

## Production Considerations

### Performance
- Image optimization with Next.js
- Code splitting with dynamic imports
- Efficient chart rendering with Recharts
- Optimized bundle size

### Security
- Environment variable protection
- API error handling
- Input validation
- XSS prevention

## License

This project is licensed under the MIT License.
