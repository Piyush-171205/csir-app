// Mock database for users
export const usersDB = [
  // Citizen users
  { username: 'john_doe', password: 'John@123', userType: 'citizen', firstName: 'John', lastName: 'Doe', email: 'john@example.com', mobile: '9876543210' },
  
  // Authority users
  { username: 'road_officer', password: 'Road@123', userType: 'authority', department: 'road', name: 'Road Officer', email: 'road@csir.gov' },
  { username: 'water_officer', password: 'Water@123', userType: 'authority', department: 'water', name: 'Water Officer', email: 'water@csir.gov' },
  { username: 'electricity_officer', password: 'Elec@123', userType: 'authority', department: 'electricity', name: 'Electricity Officer', email: 'electricity@csir.gov' },
  { username: 'garbage_officer', password: 'Garbage@123', userType: 'authority', department: 'garbage', name: 'Garbage Officer', email: 'garbage@csir.gov' },
  { username: 'infrastructure_officer', password: 'Infra@123', userType: 'authority', department: 'infrastructure', name: 'Infrastructure Officer', email: 'infra@csir.gov' },
  { username: 'education_officer', password: 'Edu@123', userType: 'authority', department: 'education', name: 'Education Officer', email: 'education@csir.gov' },
  
  // Admin
  { username: 'admin', password: 'Admin@123', userType: 'admin', name: 'Administrator', email: 'admin@csir.gov' }
];

// Mock database for complaints
export const complaintsDB = [];

// App complaints database
export const appComplaintsDB = [];

// App feedback database
export const appFeedbackDB = [];

// Monthly complaint statistics
export const monthlyStats = {
  '2026': {
    '01': { road: 15, water: 8, electricity: 12, garbage: 20, infrastructure: 10, education: 5 },
    '02': { road: 18, water: 10, electricity: 15, garbage: 22, infrastructure: 12, education: 6 },
    '03': { road: 22, water: 12, electricity: 18, garbage: 25, infrastructure: 14, education: 8 }
  }
};

// Initialize mock data
export const initializeMockData = () => {
  if (complaintsDB.length === 0) {
    complaintsDB.push({
      _id: 'R001',
      title: 'Deep Potholes on Main Road',
      description: 'Multiple deep potholes causing accidents near the market area',
      department: 'road',
      location: {
        area: 'Sector 15, CBD Belapur',
        city: 'Navi Mumbai',
        address: 'Near APMC Market, Sector 15, CBD Belapur'
      },
      status: 'in-progress',
      progress: 65,
      reportedBy: 'john_doe',
      priority: 'high',
      geoLocation: {
        type: 'Point',
        coordinates: [73.0150, 19.0350]
      },
      images: [],
      statusHistory: [
        { status: 'reported', date: '2026-02-10T09:30:00Z', note: 'Complaint registered' },
        { status: 'acknowledged', date: '2026-02-11T10:15:00Z', note: 'Acknowledged by road department' },
        { status: 'in-progress', date: '2026-02-12T14:20:00Z', note: 'Work started by road department' },
        { status: 'almost-resolved', date: '2026-02-14T16:30:00Z', note: 'Work 90% complete' }
      ],
      expectedResolutionDate: '2026-02-25',
      createdAt: '2026-02-10T09:30:00Z',
      updatedAt: '2026-02-14T16:30:00Z',
      __v: 0
    });

    complaintsDB.push({
      _id: 'W001',
      title: 'Major Water Leakage',
      description: 'Continuous water leakage from main pipeline causing waterlogging',
      department: 'water',
      location: {
        area: 'Sector 17, Vashi',
        city: 'Navi Mumbai',
        address: 'Near Vashi Station, Sector 17'
      },
      status: 'in-progress',
      progress: 40,
      reportedBy: 'jane_smith',
      priority: 'urgent',
      geoLocation: {
        type: 'Point',
        coordinates: [72.9989, 19.0748]
      },
      images: [],
      statusHistory: [
        { status: 'reported', date: '2026-02-12T11:20:00Z', note: 'Complaint registered' },
        { status: 'acknowledged', date: '2026-02-13T09:45:00Z', note: 'Acknowledged by water department' },
        { status: 'in-progress', date: '2026-02-14T13:30:00Z', note: 'Repair work started' }
      ],
      expectedResolutionDate: '2026-02-22',
      createdAt: '2026-02-12T11:20:00Z',
      updatedAt: '2026-02-14T13:30:00Z',
      __v: 0
    });

    complaintsDB.push({
      _id: 'E001',
      title: 'Frequent Power Cuts',
      description: 'Regular power cuts in the area for the past week',
      department: 'electricity',
      location: {
        area: 'Sector 10, Kharghar',
        city: 'Navi Mumbai',
        address: 'Near Central Park, Sector 10'
      },
      status: 'reported',
      progress: 0,
      reportedBy: 'mike_wilson',
      priority: 'medium',
      geoLocation: {
        type: 'Point',
        coordinates: [73.0600, 19.0500]
      },
      images: [],
      statusHistory: [
        { status: 'reported', date: '2026-02-15T15:45:00Z', note: 'Complaint registered' }
      ],
      expectedResolutionDate: '2026-02-20',
      createdAt: '2026-02-15T15:45:00Z',
      updatedAt: '2026-02-15T15:45:00Z',
      __v: 0
    });

    complaintsDB.push({
      _id: 'G001',
      title: 'Garbage Not Collected',
      description: 'Garbage has not been collected for 5 days, causing health hazards',
      department: 'garbage',
      location: {
        area: 'Sector 6, Airoli',
        city: 'Navi Mumbai',
        address: 'Near Airoli Railway Station'
      },
      status: 'in-progress',
      progress: 25,
      reportedBy: 'sarah_johnson',
      priority: 'high',
      geoLocation: {
        type: 'Point',
        coordinates: [72.9833, 19.1500]
      },
      images: [],
      statusHistory: [
        { status: 'reported', date: '2026-02-13T08:30:00Z', note: 'Complaint registered' },
        { status: 'acknowledged', date: '2026-02-14T10:20:00Z', note: 'Acknowledged by garbage department' },
        { status: 'in-progress', date: '2026-02-15T09:15:00Z', note: 'Cleaning crew dispatched' }
      ],
      expectedResolutionDate: '2026-02-18',
      createdAt: '2026-02-13T08:30:00Z',
      updatedAt: '2026-02-15T09:15:00Z',
      __v: 0
    });

    complaintsDB.push({
      _id: 'I001',
      title: 'Streetlights Not Working',
      description: 'Multiple streetlights not working in the residential area',
      department: 'infrastructure',
      location: {
        area: 'Sector 11, CBD Belapur',
        city: 'Navi Mumbai',
        address: 'Near Jain Mandir'
      },
      status: 'completed',
      progress: 100,
      reportedBy: 'david_brown',
      priority: 'low',
      geoLocation: {
        type: 'Point',
        coordinates: [73.0250, 19.0300]
      },
      images: [],
      statusHistory: [
        { status: 'reported', date: '2026-02-08T14:30:00Z', note: 'Complaint registered' },
        { status: 'acknowledged', date: '2026-02-09T11:45:00Z', note: 'Acknowledged by infrastructure department' },
        { status: 'in-progress', date: '2026-02-10T13:20:00Z', note: 'Technician assigned' },
        { status: 'almost-resolved', date: '2026-02-11T15:30:00Z', note: 'Work 95% complete' },
        { status: 'completed', date: '2026-02-12T10:15:00Z', note: 'All streetlights fixed' }
      ],
      expectedResolutionDate: '2026-02-15',
      actualResolutionDate: '2026-02-12',
      createdAt: '2026-02-08T14:30:00Z',
      updatedAt: '2026-02-12T10:15:00Z',
      __v: 0
    });

    complaintsDB.push({
      _id: 'ED001',
      title: 'School Infrastructure Issues',
      description: 'Broken benches and lack of drinking water in municipal school',
      department: 'education',
      location: {
        area: 'Sector 12, Kharghar',
        city: 'Navi Mumbai',
        address: 'Municipal School No. 3, Sector 12'
      },
      status: 'reported',
      progress: 0,
      reportedBy: 'emma_davis',
      priority: 'medium',
      geoLocation: {
        type: 'Point',
        coordinates: [73.0650, 19.0450]
      },
      images: [],
      statusHistory: [
        { status: 'reported', date: '2026-02-16T09:30:00Z', note: 'Complaint registered' }
      ],
      expectedResolutionDate: '2026-02-23',
      createdAt: '2026-02-16T09:30:00Z',
      updatedAt: '2026-02-16T09:30:00Z',
      __v: 0
    });
  }

  // Initialize app complaints
  if (appComplaintsDB.length === 0) {
    appComplaintsDB.push({
      id: 'APP001',
      type: 'bug',
      title: 'App Crashes on Login',
      description: 'The app crashes immediately after entering credentials',
      severity: 'high',
      device: 'iPhone 13',
      os: 'iOS 15.4',
      appVersion: '1.0.2',
      reportedBy: 'user123',
      reportedAt: '2026-02-10T10:30:00Z',
      status: 'investigating',
      attachments: []
    });
  }

  // Initialize app feedback
  if (appFeedbackDB.length === 0) {
    appFeedbackDB.push({
      id: 'FB001',
      rating: 4,
      ratingLabel: 'good',
      feedback: 'Good app but needs improvement in navigation',
      category: 'usability',
      reportedBy: 'user456',
      reportedAt: '2026-02-11T14:20:00Z'
    });
  }
};

// Initialize mock data
initializeMockData();