import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, tasksRes] = await Promise.all([
          api.get('/tasks/stats/summary'),
          api.get('/tasks?limit=5')
        ]);
        setStats(statsRes.data);
        setRecentTasks(tasksRes.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const statCards = [
    { label: 'Total Tasks', value: stats.total, icon: '📋', color: '#6c63ff' },
    { label: 'Pending', value: stats.pending, icon: '⏳', color: '#ffaa00' },
    { label: 'In Progress', value: stats.inProgress, icon: '🔄', color: '#2ed9ff' },
    { label: 'Completed', value: stats.completed, icon: '✅', color: '#00d68f' },
  ];

  const getBadgeClass = (status) => {
    const map = { pending: 'badge-pending', 'in-progress': 'badge-in-progress', completed: 'badge-completed' };
    return map[status] || 'badge-pending';
  };

  const getPriorityClass = (priority) => {
    const map = { low: 'badge-low', medium: 'badge-medium', high: 'badge-high' };
    return map[priority] || 'badge-medium';
  };

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{getGreeting()}, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="page-subtitle">Here's what's happening with your tasks today.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/tasks')}>
          + New Task
        </button>
      </div>

      <div className="stats-grid">
        {statCards.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>Recent Tasks</h2>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/tasks')}>View All</button>
        </div>

        {recentTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <div className="empty-title">No tasks yet</div>
            <div className="empty-text">Create your first task to get started</div>
            <button className="btn btn-primary" onClick={() => navigate('/tasks')}>Create Task</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '10px' }}>
            {recentTasks.map(task => (
              <div key={task._id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)',
                gap: '12px'
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)',
                    textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                    color: task.status === 'completed' ? 'var(--text-muted)' : 'var(--text-primary)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                  }}>
                    {task.title}
                  </div>
                  {task.dueDate && (
                    <div className="due-date" style={{ marginTop: '2px' }}>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <span className={`badge ${getPriorityClass(task.priority)}`}>{task.priority}</span>
                  <span className={`badge ${getBadgeClass(task.status)}`}>
                    {task.status.replace('-', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {stats.total > 0 && (
        <div className="card" style={{ marginTop: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-primary)' }}>
            Progress Overview
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Completed', value: stats.completed, color: '#00d68f' },
              { label: 'In Progress', value: stats.inProgress, color: '#2ed9ff' },
              { label: 'Pending', value: stats.pending, color: '#ffaa00' },
            ].map(item => (
              <div key={item.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                  <span style={{ color: item.color, fontWeight: '600' }}>
                    {stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0}%
                  </span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-input)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${stats.total > 0 ? (item.value / stats.total) * 100 : 0}%`,
                    background: item.color,
                    borderRadius: '3px',
                    transition: 'width 0.6s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
