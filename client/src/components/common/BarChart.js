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
      
      {/* Chart Container with explicit height */}
      <div 
        className="relative flex items-end justify-around gap-2 px-2 pb-6" 
        style={{ height: height }}
      >
        {data.map((item, index) => {
          const percentage = (item.count / maxValue) * 100;
          const label = item._id ? item._id.replace(/([A-Z])/g, ' $1').trim() : 'N/A';
          const barHeight = Math.max(percentage, 5);
          
          return (
            <div key={index} className="flex flex-col items-center flex-1 h-full justify-end">
              {/* Bar */}
              <div 
                className="w-full max-w-16 rounded-t-md transition-all duration-500 hover:opacity-80 relative group"
                style={{ 
                  height: `${barHeight}%`, 
                  backgroundColor: color,
                  minHeight: '8px'
                }}
              >
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-secondary-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                  {item.count}
                </div>
              </div>
              
              <div className="mt-2 w-full text-center absolute -bottom-0">
                <span className="text-xs text-secondary-600 capitalize block truncate" title={label}>
                  {label.length > 10 ? label.substring(0, 10) + '...' : label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            <div 
              className="w-3 h-3 rounded-sm" 
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

