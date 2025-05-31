import React from 'react';

const SalesChart = ({ data, title = "Sales Chart" }) => {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No data available</p>
            </div>
        );
    }

    const maxSales = Math.max(...data.map(d => d.sales));
    const maxOrders = Math.max(...data.map(d => d.orders));

    return (
        <div className="w-full">
            <h4 className="text-md font-medium mb-4">{title}</h4>
            <div className="relative">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs text-gray-500">
                    <span>${maxSales.toFixed(0)}</span>
                    <span>${(maxSales * 0.75).toFixed(0)}</span>
                    <span>${(maxSales * 0.5).toFixed(0)}</span>
                    <span>${(maxSales * 0.25).toFixed(0)}</span>
                    <span>$0</span>
                </div>

                {/* Chart area */}
                <div className="ml-16 relative h-64 bg-gradient-to-t from-gray-50 to-white rounded-lg overflow-hidden">
                    {/* Grid lines */}
                    <div className="absolute inset-0">
                        {[0, 25, 50, 75, 100].map(percent => (
                            <div
                                key={percent}
                                className="absolute w-full border-t border-gray-200"
                                style={{ bottom: `${percent}%` }}
                            />
                        ))}
                    </div>

                    {/* Bars */}
                    <div className="absolute inset-0 flex items-end justify-around px-2">
                        {data.map((day, index) => {
                            const salesHeight = maxSales > 0 ? (day.sales / maxSales) * 100 : 0;
                            const ordersHeight = maxOrders > 0 ? (day.orders / maxOrders) * 50 : 0;

                            return (
                                <div key={index} className="flex flex-col items-center flex-1 mx-1">
                                    {/* Sales bar */}
                                    <div
                                        className="w-full bg-blue-500 rounded-t-sm relative group cursor-pointer transition-all hover:bg-blue-600"
                                        style={{ height: `${salesHeight}%`, minHeight: salesHeight > 0 ? '2px' : '0' }}
                                    >
                                        {/* Tooltip */}
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                                            <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                                Sales: ${day.sales}
                                                <br />
                                                Orders: {day.orders}
                                            </div>
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* X-axis labels */}
                <div className="ml-16 flex justify-around mt-2">
                    {data.map((day, index) => (
                        <div key={index} className="text-xs text-gray-500 text-center flex-1">
                            <div>{new Date(day.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                            })}</div>
                            <div className="text-gray-400">{day.day_name.slice(0, 3)}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center mt-4 space-x-4">
                <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                    <span className="text-sm text-gray-600">Sales ($)</span>
                </div>
            </div>
        </div>
    );
};

export default SalesChart;
