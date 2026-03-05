import React from 'react';

const AreaChart = ({ data, color = '#3B82F6', height = 200 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center text-secondary-500 text-sm" style={{ height }}>
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.count), 1);
  const chartHeight = height - 40;
  const chartWidth = 100;
  const padding = 5;

  // Create points for the line chart
  const points = data.map((item, index) => {
    const x = padding + (index / Math.max(data.length - 1, 1)) * (chartWidth - padding * 2);
    const y = padding + chartHeight - ((item.count / maxValue) * (chartHeight - padding * 2));
    return { x, y, ...item };
  });

  // Create the area path
  const areaPath = points.length > 0
    ? `M ${padding} ${padding + chartHeight - padding * 2} ${points.map(p => `L ${p.x} ${p.y}`).join(' ')} L ${chartWidth - padding} ${padding + chartHeight - padding * 2} Z`
    : '';

  // Create the line path
  const linePath = points.length > 0
    ? `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}`
    : '';

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full" style={{ height: chartHeight }}>
        {/* Grid lines */}
        <line x1={padding} y1={padding} x2={padding} y2={chartHeight - padding} stroke="#E5E7EB" strokeWidth="0.5" />
        <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="2" />
        <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#E5E7EB" strokeWidth="0.5" />

        {/* Area fill */}
        <path d={areaPath} fill={color} fillOpacity="0.2" />

        {/* Line */}
        <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="3"
            fill={color}
            stroke="white"
            strokeWidth="1"
          />
        ))}
      </svg>

      {/* X-axis labels */}
      <div className="flex justify-between px-2 mt-1">
        {data.map((item, index) => (
          <span key={index} className="text-xs text-secondary-500 capitalize">
            {item._id ? (item._id.length > 8 ? item._id.substring(0, 8) + '...' : item._id) : 'N/A'}
          </span>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
              <span className="text-sm text-secondary-600 capitalize">{item._id || 'N/A'}</span>
            </div>
            <span className="text-sm font-semibold text-secondary-900">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AreaChart;

