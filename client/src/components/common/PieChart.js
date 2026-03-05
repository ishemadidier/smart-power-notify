import React from 'react';

const PieChart = ({ data, size = 200 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center text-secondary-500 text-sm">
        No data available
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.count, 0);
  
  // Colors for different segments
  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#F97316', // Orange
  ];

  let cumulativePercent = 0;

  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
          {data.map((item, index) => {
            const percent = total > 0 ? item.count / total : 0;
            const startPercent = cumulativePercent;
            cumulativePercent += percent;
            
            const [startX, startY] = getCoordinatesForPercent(startPercent);
            const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
            
            const largeArcFlag = percent > 0.5 ? 1 : 0;
            
            const pathData = [
              `M ${size / 2} ${size / 2}`,
              `L ${size / 2 + (size / 2 - 10) * startX} ${size / 2 + (size / 2 - 10) * startY}`,
              `A ${size / 2 - 10} ${size / 2 - 10} 0 ${largeArcFlag} 1 ${size / 2 + (size / 2 - 10) * endX} ${size / 2 + (size / 2 - 10) * endY}`,
              'Z'
            ].join(' ');

            return (
              <path
                key={index}
                d={pathData}
                fill={colors[index % colors.length]}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              >
                <title>{item._id || 'N/A'}: {item.count} ({Math.round(percent * 100)}%)</title>
              </path>
            );
          })}
        </svg>
        
        {/* Center circle for donut effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-secondary-900">{total}</p>
            <p className="text-xs text-secondary-500">Total</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 justify-center">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: colors[index % colors.length] }}
            ></div>
            <span className="text-xs text-secondary-600 capitalize">
              {item._id || 'N/A'} ({Math.round((item.count / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChart;

