import React from 'react';

const BarChart = ({ data, color = '#3B82F6', height = 250, title = '' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px] text-secondary-500 text-sm">
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="w-full">
      {title && <h4 className="text-sm font-medium text-secondary-700 mb-3">{title}</h4>}
      <div className="flex items-end justify-around h-full gap-2" style={{ height }}>
        {data.map((item, index) => {
          const percentage = (item.count / maxValue) * 100;
          const label = item._id ? item._id.replace(/([A-Z])/g, ' $1').trim() : 'N/A';
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="relative w-full flex-1 flex items-end">
                <div 
                  className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80"
                  style={{ 
                    height: `${percentage}%`, 
                    backgroundColor: color,
                    minHeight: '4px'
                  }}
                >
                  <div className="opacity-0 hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-secondary-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {item.count}
                  </div>
                </div>
              </div>
              <div className="mt-2 w-full text-center">
                <span className="text-xs text-secondary-600 capitalize block truncate" title={label}>
                  {label.length > 8 ? label.substring(0, 8) + '...' : label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 justify-center">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            <div 
              className="w-3 h-3 rounded" 
              style={{ backgroundColor: color }}
            ></div>
            <span className="text-xs text-secondary-600 capitalize">
              {item._id || 'N/A'}: {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;

