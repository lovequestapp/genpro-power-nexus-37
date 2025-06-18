import React from 'react';
import { TrendingUp, TrendingDown, Users, CreditCard, DollarSign, RefreshCw, AlertCircle, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock Stripe data
const stripeMock = {
  revenue: 154320,
  revenueChange: 8.2,
  revenueTrend: 'up',
  customers: 312,
  payouts: [
    { id: 'po_1', amount: 12000, date: '2024-07-10' },
    { id: 'po_2', amount: 8000, date: '2024-07-03' },
  ],
  transactions: [
    { id: 'txn_1', customer: 'Sarah Johnson', amount: 1200, status: 'succeeded', date: '2024-07-09' },
    { id: 'txn_2', customer: 'Michael Chen', amount: 3500, status: 'pending', date: '2024-07-08' },
    { id: 'txn_3', customer: 'Emily Rodriguez', amount: 2000, status: 'refunded', date: '2024-07-07' },
    { id: 'txn_4', customer: 'David Lee', amount: 500, status: 'succeeded', date: '2024-07-06' },
  ],
  refunds: 2,
  disputes: 1,
  revenueChart: [
    { date: 'Jun 10', revenue: 3200 },
    { date: 'Jun 15', revenue: 4200 },
    { date: 'Jun 20', revenue: 5100 },
    { date: 'Jun 25', revenue: 6100 },
    { date: 'Jul 1', revenue: 7200 },
    { date: 'Jul 5', revenue: 8300 },
    { date: 'Jul 10', revenue: 9000 },
  ],
};

const colorMap = {
  green: 'from-green-100 to-green-200',
  blue: 'from-blue-100 to-blue-200',
  purple: 'from-purple-100 to-purple-200',
  red: 'from-red-100 to-red-200',
};
const blurMap = {
  green: 'from-green-200/30',
  blue: 'from-blue-200/30',
  purple: 'from-purple-200/30',
  red: 'from-red-200/30',
};

function StripeCard({ title, value, icon, trend, change, subtitle, color }) {
  return (
    <div className={`rounded-2xl p-6 bg-gradient-to-br from-white/70 to-white/30 shadow-xl border border-white/30 backdrop-blur-lg flex flex-col gap-2 min-w-[180px] relative overflow-hidden`}> 
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-3 rounded-full bg-gradient-to-br ${colorMap[color] || ''} shadow-lg`}>{icon}</div>
        <span className="text-lg font-bold text-gray-900">{title}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-extrabold text-gray-900">{value}</span>
        {trend && (
          <span className={`flex items-center gap-1 text-sm font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>{trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}{change}%</span>
        )}
      </div>
      {subtitle && <span className="text-xs text-gray-500 mt-1">{subtitle}</span>}
      <div className={`absolute right-0 bottom-0 w-24 h-24 bg-gradient-to-br ${blurMap[color] || ''} to-transparent rounded-full blur-2xl`} />
    </div>
  );
}

function StripeDashboardCards() {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <StripeCard
        title="Total Revenue"
        value={`$${stripeMock.revenue.toLocaleString()}`}
        icon={<DollarSign className="w-6 h-6 text-green-600" />}
        trend={stripeMock.revenueTrend}
        change={stripeMock.revenueChange}
        color="green"
        subtitle="Last 30 days"
      />
      <StripeCard
        title="Active Customers"
        value={stripeMock.customers}
        icon={<Users className="w-6 h-6 text-blue-600" />}
        trend={null}
        change={null}
        color="blue"
        subtitle="All time"
      />
      <StripeCard
        title="Upcoming Payout"
        value={`$${stripeMock.payouts[0].amount.toLocaleString()}`}
        icon={<CreditCard className="w-6 h-6 text-purple-600" />}
        trend={null}
        change={null}
        color="purple"
        subtitle={`On ${stripeMock.payouts[0].date}`}
      />
      <StripeCard
        title="Refunds/Disputes"
        value={`${stripeMock.refunds} / ${stripeMock.disputes}`}
        icon={<AlertCircle className="w-6 h-6 text-red-600" />}
        trend={null}
        change={null}
        color="red"
        subtitle="This month"
      />
    </div>
  );
}

function StripeRevenueChart() {
  return (
    <div className="rounded-2xl p-6 bg-gradient-to-br from-white/70 to-white/30 shadow-xl border border-white/30 backdrop-blur-lg mb-10">
      <h3 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-600" /> Revenue Trend</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={stripeMock.revenueChart}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function StripeTransactions() {
  return (
    <div className="rounded-2xl p-6 bg-gradient-to-br from-white/70 to-white/30 shadow-xl border border-white/30 backdrop-blur-lg mb-10">
      <h3 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2"><RefreshCw className="w-5 h-5 text-blue-600" /> Recent Transactions</h3>
      <div className="divide-y divide-gray-200">
        {stripeMock.transactions.map(txn => (
          <div key={txn.id} className="flex items-center justify-between py-3">
            <div>
              <div className="font-semibold text-gray-900">{txn.customer}</div>
              <div className="text-xs text-gray-500">{txn.date}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`font-bold ${txn.status === 'succeeded' ? 'text-green-600' : txn.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>{txn.status}</span>
              <span className="font-semibold text-gray-900">${txn.amount.toLocaleString()}</span>
              <button className="ml-2 px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-bold hover:bg-blue-200 transition-all flex items-center gap-1"><ArrowRight className="w-3 h-3" /> Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StripeDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Stripe Dashboard</h1>
      <p className="text-gray-500 mb-6">View your Stripe revenue, transactions, customers, and payouts in real time.</p>
      <StripeDashboardCards />
      <StripeRevenueChart />
      <StripeTransactions />
    </div>
  );
} 