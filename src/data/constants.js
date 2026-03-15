export const securityQuestions = [
  "What is your favorite color?",
  "What is your mother's maiden name?",
  "What was the name of your first pet?",
  "What is your favorite food?",
  "What city were you born in?"
];

export const departmentDefinitions = [
  { id: 'road', name: 'Road & Transportation Department', icon: '🛣️', color: '#4a90e2', description: 'Road maintenance, potholes, traffic issues' },
  { id: 'water', name: 'Water Supply & Leakage Department', icon: '💧', color: '#50c878', description: 'Water leakage, supply issues, pipeline problems' },
  { id: 'electricity', name: 'Electricity Department', icon: '⚡', color: '#f39c12', description: 'Power cuts, transformer issues, faulty lines' },
  { id: 'garbage', name: 'Garbage Department', icon: '🗑️', color: '#e67e22', description: 'Waste collection, cleaning, sanitation' },
  { id: 'infrastructure', name: 'Infrastructure Department', icon: '🏗️', color: '#9b59b6', description: 'Streetlights, public infrastructure issues' },
  { id: 'education', name: 'Educational Department', icon: '📚', color: '#3498db', description: 'School, college, educational institution issues' }
];

export const appComplaintTypes = [
  { id: 'bug', name: 'Bug/Technical Issue', icon: '🐛' },
  { id: 'crash', name: 'App Crash', icon: '💥' },
  { id: 'ui', name: 'UI/UX Issue', icon: '🎨' },
  { id: 'performance', name: 'Performance Issue', icon: '⚡' },
  { id: 'feature', name: 'Feature Request', icon: '✨' },
  { id: 'login', name: 'Login/Auth Issue', icon: '🔐' },
  { id: 'data', name: 'Data Sync Issue', icon: '🔄' },
  { id: 'other', name: 'Other Issue', icon: '❓' }
];

export const severityLevels = [
  { id: 'low', name: 'Low', color: '#28a745' },
  { id: 'medium', name: 'Medium', color: '#ffc107' },
  { id: 'high', name: 'High', color: '#fd7e14' },
  { id: 'critical', name: 'Critical', color: '#dc3545' }
];

export const ratingLabels = [
  { value: 1, label: 'Poor', icon: '😞' },
  { value: 2, label: 'Below Average', icon: '😕' },
  { value: 3, label: 'Average', icon: '😐' },
  { value: 4, label: 'Good', icon: '😊' },
  { value: 5, label: 'Excellent', icon: '😍' }
];

export const statusOptions = [
  { value: 'reported', label: 'Reported', color: '#ffc107' },
  { value: 'acknowledged', label: 'Acknowledged', color: '#17a2b8' },
  { value: 'in-progress', label: 'In Progress', color: '#007bff' },
  { value: 'almost-resolved', label: 'Almost Resolved', color: '#6f42c1' },
  { value: 'completed', label: 'Completed', color: '#28a745' }
];