import { useState, useEffect } from 'react';
import { BookOpen, Calendar, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SummaryCard from '../components/SummaryCard';
import ResourceCard from '../components/ResourceCard';
import resourceService from '../services/resourceService';
import useAuth from '../hooks/useAuth';
import '../styles/UserDashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const response = await resourceService.getAllResources(0, 6);
      if (response.success) {
        setResources(response.data);
      }
    } catch (err) {
      console.error('Error loading resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (resource) => {
    navigate(`/bookings/create/${resource.id}`)
  }

  const handleViewDetails = () => {
    navigate('/user/resources')
  }

  return (
    <div className="user-dashboard animate-fadeIn">
        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-content">
            <h1>Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋</h1>
            <p>Quickly book campus resources anytime, anywhere</p>
          </div>
          <div className="welcome-illustration">
            📚
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards-section">
          <SummaryCard
            icon={<BookOpen size={28} />}
            title="Available Resources"
            value="24"
            description="Ready to book"
            color="primary"
          />
          <SummaryCard
            icon={<Calendar size={28} />}
            title="My Active Bookings"
            value="2"
            description="This week"
            color="info"
          />
          <SummaryCard
            icon={<Zap size={28} />}
            title="Upcoming Reservations"
            value="5"
            description="Next 30 days"
            color="success"
          />
        </div>

        {/* Popular Resources Section */}
        <div className="popular-resources-section">
          <div className="section-header">
            <div>
              <h2>Popular Resources</h2>
              <p>Check out what others are booking</p>
            </div>
            <a href="/user/resources" className="view-all-link">
              View All →
            </a>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading resources...</p>
            </div>
          ) : resources.length === 0 ? (
            <div className="empty-state">
              <p>No resources available at the moment</p>
            </div>
          ) : (
            <div className="resources-grid">
              {resources.slice(0, 3).map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  onBookNow={handleBookNow}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-item">
            <span className="stat-number">98%</span>
            <span className="stat-label">User Satisfaction</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">2,450+</span>
            <span className="stat-label">Bookings This Month</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">15 min</span>
            <span className="stat-label">Avg. Booking Time</span>
          </div>
        </div>
    </div>
  );
};

export default UserDashboard;
