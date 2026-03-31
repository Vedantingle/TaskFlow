import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import TaskModal from '../components/TaskModal';
import ConfirmModal from '../components/ConfirmModal';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteTask, setDeleteTask] = useState(null);
  const [toast, setToast] = useState('');
  const [filters, setFilters] = useState({ status: 'all', priority: 'all', search: '' });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.priority !== 'all') params.priority = filters.priority;
      if (filters.search.trim()) params.search = filters.search.trim();
      const res = await api.get('/tasks', { params });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(fetchTasks, 300);
    return () => clearTimeout(timer);
  }, [fetchTasks]);

  const handleCreate = async (form) => {
    const res = await api.post('/tasks', form);
    setTasks(prev => [res.data, ...prev]);
    showToast('Task created successfully!');
  };

  const handleUpdate = async (form) => {
    const res = await api.put(`/tasks/${editTask._id}`, form);
    setTasks(prev => prev.map(t => t._id === editTask._id ? res.data : t));
    showToast('Task updated successfully!');
  };

  const handleDelete = async () => {
    await api.delete(`/tasks/${deleteTask._id}`);
    setTasks(prev => prev.filter(t => t._id !== deleteTask._id));
    setDeleteTask(null);
    showToast('Task deleted.');
  };

  const toggleStatus = async (task) => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    const res = await api.put(`/tasks/${task._id}`, { ...task, status: nextStatus });
    setTasks(prev => prev.map(t => t._id === task._id ? res.data : t));
  };

  const openEdit = (task) => {
    setEditTask(task);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditTask(null);
  };

  const getBadgeClass = (status) => {
    const map = { pending: 'badge-pending', 'in-progress': 'badge-in-progress', completed: 'badge-completed' };
    return map[status] || 'badge-pending';
  };

  const getPriorityClass = (priority) => {
    const map = { low: 'badge-low', medium: 'badge-medium', high: 'badge-high' };
    return map[priority] || 'badge-medium';
  };

  const isOverdue = (dueDate) => dueDate && new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className="alert alert-success" style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
          minWidth: '240px', animation: 'fadeIn 0.3s ease', boxShadow: 'var(--shadow)'
        }}>
          ✓ {toast}
        </div>
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">My Tasks</h1>
          <p className="page-subtitle">Manage and track all your tasks</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditTask(null); setShowModal(true); }}>
          + New Task
        </button>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-input">
          <input
            type="text"
            className="form-control"
            placeholder="🔍  Search tasks..."
            value={filters.search}
            onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
          />
        </div>
        <select
          className="form-control filter-select"
          value={filters.status}
          onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select
          className="form-control filter-select"
          value={filters.priority}
          onChange={(e) => setFilters(f => ({ ...f, priority: e.target.value }))}
        >
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Task List */}
      {loading ? (
        <div className="loading-spinner"><div className="spinner"></div></div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-title">
            {filters.search || filters.status !== 'all' || filters.priority !== 'all'
              ? 'No tasks match your filters'
              : 'No tasks yet'}
          </div>
          <div className="empty-text">
            {filters.search || filters.status !== 'all' || filters.priority !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Click "New Task" to create your first task'}
          </div>
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map(task => (
            <div key={task._id} className={`task-card ${task.status === 'completed' ? 'completed-card' : ''}`}>
              {/* Checkbox */}
              <div
                className={`task-checkbox ${task.status === 'completed' ? 'checked' : ''}`}
                onClick={() => toggleStatus(task)}
                title={task.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
              />

              <div className="task-body">
                <div className="task-header">
                  <h3 className={`task-title ${task.status === 'completed' ? 'done' : ''}`}>
                    {task.title}
                  </h3>
                  <div className="task-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(task)} title="Edit">
                      ✏️
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => setDeleteTask(task)} title="Delete">
                      🗑️
                    </button>
                  </div>
                </div>

                {task.description && (
                  <p className="task-desc">{task.description}</p>
                )}

                <div className="task-meta">
                  <span className={`badge ${getBadgeClass(task.status)}`}>
                    {task.status.replace('-', ' ')}
                  </span>
                  <span className={`badge ${getPriorityClass(task.priority)}`}>
                    {task.priority} priority
                  </span>
                  {task.dueDate && (
                    <span className={`due-date ${isOverdue(task.dueDate) ? 'overdue' : ''}`}>
                      {isOverdue(task.dueDate) ? '⚠️ ' : '📅 '}
                      {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  )}
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <TaskModal
          task={editTask}
          onClose={closeModal}
          onSave={editTask ? handleUpdate : handleCreate}
        />
      )}

      {deleteTask && (
        <ConfirmModal
          message={`Delete "${deleteTask.title}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onClose={() => setDeleteTask(null)}
        />
      )}
    </div>
  );
};

export default Tasks;
