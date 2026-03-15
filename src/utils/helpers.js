export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const calculateDaysRemaining = (targetDate) => {
  const today = new Date();
  const target = new Date(targetDate);
  const diffTime = target - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getStatusBadgeClass = (status) => {
  const statusMap = {
    'pending': 'status-pending',
    'reported': 'status-pending',
    'acknowledged': 'status-acknowledged',
    'in-progress': 'status-in-progress',
    'almost-resolved': 'status-almost-resolved',
    'resolved': 'status-resolved',
    'completed': 'status-resolved'
  };
  return statusMap[status] || 'status-pending';
};

export const getPriorityBadgeClass = (priority) => {
  const priorityMap = {
    'urgent': 'priority-urgent',
    'high': 'priority-high',
    'medium': 'priority-medium',
    'low': 'priority-low'
  };
  return priorityMap[priority] || 'priority-medium';
};