// Mock data for admin panel

// Citizens data
export const citizensData = [
  { id: 'C1001', name: 'Rajesh Kumar', email: 'rajesh.k@email.com', mobile: '9876543210', address: 'Sector 10, Nerul', registeredOn: '2024-01-15', status: 'active', complaints: 3 },
  { id: 'C1002', name: 'Priya Singh', email: 'priya.s@email.com', mobile: '9876543211', address: 'Sector 17, Vashi', registeredOn: '2024-01-20', status: 'active', complaints: 1 },
  { id: 'C1003', name: 'Amit Verma', email: 'amit.v@email.com', mobile: '9876543212', address: 'Sector 15, CBD Belapur', registeredOn: '2024-02-05', status: 'active', complaints: 2 },
  { id: 'C1004', name: 'Sneha Patil', email: 'sneha.p@email.com', mobile: '9876543213', address: 'Sector 5, Nerul', registeredOn: '2024-02-10', status: 'blocked', complaints: 5 },
  { id: 'C1005', name: 'Vikas Gupta', email: 'vikas.g@email.com', mobile: '9876543214', address: 'Sector 20, Kharghar', registeredOn: '2024-02-15', status: 'active', complaints: 0 },
  { id: 'C1006', name: 'Meena Shah', email: 'meena.s@email.com', mobile: '9876543215', address: 'Sector 6, Airoli', registeredOn: '2024-02-20', status: 'active', complaints: 2 },
  { id: 'C1007', name: 'Rajiv Gandhi', email: 'rajiv.g@email.com', mobile: '9876543216', address: 'Sector 11, CBD Belapur', registeredOn: '2024-03-01', status: 'active', complaints: 1 },
  { id: 'C1008', name: 'Sunita Sharma', email: 'sunita.s@email.com', mobile: '9876543217', address: 'Sector 8, Sanpada', registeredOn: '2024-03-05', status: 'inactive', complaints: 0 },
];

// Officers data
export const officersData = [
  { id: 'O1001', name: 'Road Officer', email: 'road@csir.gov', mobile: '9876543220', department: 'road', joinedOn: '2024-01-10', status: 'active', complaintsAssigned: 5 },
  { id: 'O1002', name: 'Water Officer', email: 'water@csir.gov', mobile: '9876543221', department: 'water', joinedOn: '2024-01-10', status: 'active', complaintsAssigned: 2 },
  { id: 'O1003', name: 'Electricity Officer', email: 'electricity@csir.gov', mobile: '9876543222', department: 'electricity', joinedOn: '2024-01-10', status: 'active', complaintsAssigned: 1 },
  { id: 'O1004', name: 'Garbage Officer', email: 'garbage@csir.gov', mobile: '9876543223', department: 'garbage', joinedOn: '2024-01-10', status: 'active', complaintsAssigned: 1 },
  { id: 'O1005', name: 'Infrastructure Officer', email: 'infra@csir.gov', mobile: '9876543224', department: 'infrastructure', joinedOn: '2024-01-10', status: 'active', complaintsAssigned: 1 },
  { id: 'O1006', name: 'Education Officer', email: 'education@csir.gov', mobile: '9876543225', department: 'education', joinedOn: '2024-01-10', status: 'inactive', complaintsAssigned: 1 },
];

// Complaints data for admin view
export const adminComplaintsData = [
  { id: 'CMP001', citizen: 'Rajesh Kumar', category: 'Road Damage', department: 'road', status: 'in-progress', assignedTo: 'Road Officer', date: '2024-03-10', priority: 'high' },
  { id: 'CMP002', citizen: 'Priya Singh', category: 'Water Leakage', department: 'water', status: 'pending', assignedTo: 'Unassigned', date: '2024-03-11', priority: 'urgent' },
  { id: 'CMP003', citizen: 'Amit Verma', category: 'Streetlight Issue', department: 'infrastructure', status: 'resolved', assignedTo: 'Infrastructure Officer', date: '2024-03-09', priority: 'medium' },
  { id: 'CMP004', citizen: 'Sneha Patil', category: 'Garbage Collection', department: 'garbage', status: 'in-progress', assignedTo: 'Garbage Officer', date: '2024-03-08', priority: 'high' },
  { id: 'CMP005', citizen: 'Vikas Gupta', category: 'Power Cut', department: 'electricity', status: 'pending', assignedTo: 'Unassigned', date: '2024-03-12', priority: 'urgent' },
  { id: 'CMP006', citizen: 'Meena Shah', category: 'Drainage Block', department: 'education', status: 'resolved', assignedTo: 'Education Officer', date: '2024-03-07', priority: 'low' },
  { id: 'CMP007', citizen: 'Rajiv Gandhi', category: 'Road Damage', department: 'road', status: 'in-progress', assignedTo: 'Road Officer', date: '2024-03-06', priority: 'medium' },
  { id: 'CMP008', citizen: 'Sunita Sharma', category: 'Water Supply', department: 'water', status: 'pending', assignedTo: 'Unassigned', date: '2024-03-13', priority: 'high' },
];

// Complaint categories
export const complaintCategories = [
  { id: 'cat1', name: 'Road Damage', icon: '🛣️', color: '#4a90e2', count: 15 },
  { id: 'cat2', name: 'Water Leakage', icon: '💧', color: '#50c878', count: 8 },
  { id: 'cat3', name: 'Power Cut', icon: '⚡', color: '#f39c12', count: 12 },
  { id: 'cat4', name: 'Garbage Collection', icon: '🗑️', color: '#e67e22', count: 20 },
  { id: 'cat5', name: 'Streetlight Issue', icon: '💡', color: '#9b59b6', count: 10 },
  { id: 'cat6', name: 'Drainage Block', icon: '🌊', color: '#3498db', count: 5 },
  { id: 'cat7', name: 'School Issue', icon: '📚', color: '#e74c3c', count: 3 },
  { id: 'cat8', name: 'Hospital Issue', icon: '🏥', color: '#2c3e50', count: 2 },
];

// Monthly report data for charts
export const monthlyReportData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  complaints: [45, 52, 38, 45, 48, 52, 58, 62, 55, 48, 42, 38],
  resolved: [38, 42, 30, 38, 40, 45, 48, 52, 48, 40, 36, 32],
  pending: [7, 10, 8, 7, 8, 7, 10, 10, 7, 8, 6, 6]
};

// Announcements data
export const announcementsData = [
  { id: 'ann1', title: 'Holiday Announcement', message: 'Office will remain closed on 26th January for Republic Day.', date: '2024-01-20', status: 'active' },
  { id: 'ann2', title: 'Maintenance Alert', message: 'Water supply will be interrupted in Sector 10-15 on 25th Jan for maintenance.', date: '2024-01-22', status: 'active' },
  { id: 'ann3', title: 'New Feature Launch', message: 'CSIR app now supports real-time complaint tracking!', date: '2024-01-15', status: 'archived' },
];