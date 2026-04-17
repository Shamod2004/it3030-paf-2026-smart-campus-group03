import React from 'react';
import PropTypes from 'prop-types';
import { Grid3X3, Mail, Settings, CheckCircle, XCircle } from 'lucide-react';

const StatsCards = ({ tickets = [], loading = false }) => {
  // Calculate dynamic values from ticket data
  const total = tickets.length;
  const open = tickets.filter(t => t.status === 'OPEN').length;
  const inProgress = tickets.filter(t => t.status === 'IN_PROGRESS').length;
  const resolved = tickets.filter(t => t.status === 'RESOLVED').length;
  const rejected = tickets.filter(t => t.status === 'REJECTED').length;

  const cards = [
    {
      title: 'Total Tickets',
      count: total,
      icon: Grid3X3,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Open Tickets',
      count: open,
      icon: Mail,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'In Progress',
      count: inProgress,
      icon: Settings,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Resolved',
      count: resolved,
      icon: CheckCircle,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Rejected',
      count: rejected,
      icon: XCircle,
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="w-16 h-8 bg-gray-200 rounded"></div>
            </div>
            <div className="w-24 h-6 bg-gray-200 rounded mb-2"></div>
            <div className="w-20 h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`${card.bgColor} p-3 rounded-lg`}>
              <card.icon className={`w-6 h-6 ${card.iconColor}`} />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {card.count.toLocaleString()}
            </div>
          </div>
          <div className="text-sm font-medium text-gray-600">
            {card.title}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {index === 0 ? 'All time' : 'Current status'}
          </div>
        </div>
      ))}
    </div>
  );
};

StatsCards.propTypes = {
  tickets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      ticketId: PropTypes.string,
      title: PropTypes.string,
      status: PropTypes.oneOf(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'])
    })
  ),
  loading: PropTypes.bool
};

export default StatsCards;
