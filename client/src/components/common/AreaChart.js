import React from 'react';

const AreaChart = ({ data, color = '#3B82F6', height = 200 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center text-secondary-500 text-sm">
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.count), 1);
  const width = 100;
  const padding = 10;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Create points for the area chart
  const points = data.map((item, index) => {
    const x = padding + (index / Math.max(data.length - 1, 1)) * chartWidth;
    const y = padding + chartHeight - (item.count / maxValue) * chartHeight;
    return { x, y, ...item };
  });

  // Create the area path
  const areaPath = points.length > 0 
    ? `M ${padding} ${padding + chartHeight} ${points.map(p => `L ${p.x} ${p.y}`).join(' ')} L ${padding + chartWidth} ${padding + chartHeight} Z`
    : '';

  // Create the line path
  const linePath = points.length > 0
    ? `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}`
    : '';

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }}>
        {/* Grid lines */}
        <line x1={padding} y1={padding} x2={padding} y2={padding + chartHeight} stroke="#E5E7EB" strokeWidth="0.5" />
        <line x1={padding} y1={padding + chartHeight / 2} x2={padding + chartWidth} y2={padding + chartHeight / 2} stroke="#E5E7EB" strokeWidth="0.5" strokeDasharray="2" />
        <line x1={padding} y1={padding + chartHeight} x2={padding + chartWidth} y2={padding + chartHeight} stroke="#E5E7EB" strokeWidth="0.5" />

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
            r="2"
            fill={color}
            stroke="white"
            strokeWidth="0.5"
          />
        ))}
      </svg>

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

