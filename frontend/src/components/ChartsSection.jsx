import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ChartsSection = ({ tickets = [], loading = false }) => {
  // Calculate dynamic status distribution data
  const statusData = useMemo(() => {
    const statusCounts = {
      OPEN: tickets.filter(t => t.status === 'OPEN').length,
      IN_PROGRESS: tickets.filter(t => t.status === 'IN_PROGRESS').length,
      RESOLVED: tickets.filter(t => t.status === 'RESOLVED').length,
      REJECTED: tickets.filter(t => t.status === 'REJECTED').length
    };

    const total = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
    
    return [
      { name: 'Open', value: statusCounts.OPEN, percentage: total > 0 ? Math.round((statusCounts.OPEN / total) * 100) : 0 },
      { name: 'In Progress', value: statusCounts.IN_PROGRESS, percentage: total > 0 ? Math.round((statusCounts.IN_PROGRESS / total) * 100) : 0 },
      { name: 'Resolved', value: statusCounts.RESOLVED, percentage: total > 0 ? Math.round((statusCounts.RESOLVED / total) * 100) : 0 },
      { name: 'Rejected', value: statusCounts.REJECTED, percentage: total > 0 ? Math.round((statusCounts.REJECTED / total) * 100) : 0 }
    ].filter(item => item.value > 0); // Filter out zero values
  }, [tickets]);

  // Calculate dynamic priority distribution data
  const priorityData = useMemo(() => {
    const priorityCounts = {
      LOW: tickets.filter(t => t.priority === 'LOW').length,
      MEDIUM: tickets.filter(t => t.priority === 'MEDIUM').length,
      HIGH: tickets.filter(t => t.priority === 'HIGH').length,
      CRITICAL: tickets.filter(t => t.priority === 'CRITICAL').length
    };

    return [
      { name: 'Low', count: priorityCounts.LOW },
      { name: 'Medium', count: priorityCounts.MEDIUM },
      { name: 'High', count: priorityCounts.HIGH },
      { name: 'Critical', count: priorityCounts.CRITICAL }
    ].filter(item => item.count > 0); // Filter out zero values
  }, [tickets]);

  // Colors for charts
  const statusColors = ['#3B82F6', '#F97316', '#10B981', '#EF4444'];
  const priorityColors = ['#6B7280', '#EAB308', '#F97316', '#EF4444'];

  // Custom label for donut chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {`${percentage}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6 animate-pulse">
          <div className="w-48 h-6 bg-gray-200 rounded mb-4"></div>
          <div className="w-full h-64 bg-gray-200 rounded"></div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 animate-pulse">
          <div className="w-48 h-6 bg-gray-200 rounded mb-4"></div>
          <div className="w-full h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Ticket Status Distribution - Donut Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Status Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {statusData.map((entry, index) => (
            <div key={entry.name} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: statusColors[index % statusColors.length] }}
              ></div>
              <span className="text-sm text-gray-600">
                {entry.name} ({entry.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Ticket Priority Distribution - Bar Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Priority Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={priorityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <Tooltip />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {priorityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={priorityColors[index % priorityColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {priorityData.map((entry, index) => (
            <div key={entry.name} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded" 
                style={{ backgroundColor: priorityColors[index % priorityColors.length] }}
              ></div>
              <span className="text-sm text-gray-600">
                {entry.name} ({entry.count})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

ChartsSection.propTypes = {
  tickets: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool
};

export default ChartsSection;
