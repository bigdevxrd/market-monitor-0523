'use client';

interface PieChartProps {
  data: unknown;
  title?: string;
  className?: string;
}

export function PieChart({ title, className }: PieChartProps) {
  return (
    <div className={`w-full h-64 bg-neutral-50 rounded-lg flex items-center justify-center ${className}`}>
      <div className="text-center">
        <p className="text-neutral-600">{title || 'Pie Chart'}</p>
        <p className="text-sm text-neutral-400">Chart visualization coming soon</p>
      </div>
    </div>
  );
}
