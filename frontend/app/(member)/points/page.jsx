'use client';

import { useQuery } from '@tanstack/react-query';
import { pointsApi } from '@/lib/api/points';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';

export default function PointsPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['points'],
    queryFn: () => pointsApi.getPoints(1),
  });

  if (isLoading) {
    return (
      <div className="space-y-6 p-8 max-w-5xl mx-auto">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map(i => <Card key={i} className="p-6 border-gray-800"><Skeleton className="h-16 w-full" /></Card>)}
        </div>
        <Card className="p-6 border-gray-800"><Skeleton className="h-64 w-full" /></Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <div className="p-6 rounded-md border border-red-500/20 bg-red-500/10 text-red-500">
          <h3 className="font-semibold mb-2">Failed to load points</h3>
          <p className="text-sm opacity-80">{error?.message || 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  const { balance = 0, earned = 0, spent = 0, transactions = [] } = data?.data || {};

  return (
    <div className="space-y-8 p-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Points History</h1>
        <p className="text-gray-400">Track your learning progress and rewards.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gray-900 border-gray-800 flex flex-col justify-center">
          <span className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-semibold">Current Balance</span>
          <span className="text-5xl font-mono font-bold text-red-500">{balance.toLocaleString()}</span>
        </Card>
        
        <Card className="p-6 bg-gray-900 border-gray-800 flex flex-col justify-center">
          <span className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-semibold">Total Earned</span>
          <span className="text-4xl font-mono font-bold text-gray-200">{earned.toLocaleString()}</span>
        </Card>

        <Card className="p-6 bg-gray-900 border-gray-800 flex flex-col justify-center">
          <span className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-semibold">Total Spent/Lost</span>
          <span className="text-4xl font-mono font-bold text-gray-500">{spent.toLocaleString()}</span>
        </Card>
      </div>

      <Card className="border-gray-800 bg-gray-900/50 overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-gray-100">Transaction History</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-900/80 border-b border-gray-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Description</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                    <td className="px-6 py-4 text-gray-400 whitespace-nowrap font-mono text-xs">
                      {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {tx.description}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={tx.type === 'EARNED' ? 'success' : tx.type === 'SPENT' ? 'default' : 'destructive'} className="text-[10px]">
                        {tx.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold">
                      <span className={tx.type === 'EARNED' ? 'text-green-400' : 'text-red-400'}>
                        {tx.type === 'EARNED' ? '+' : '-'}{tx.amount}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
