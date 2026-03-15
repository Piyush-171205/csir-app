// ========== DEPARTMENT DATA WITH COMPLAINTS ==========
export const departmentComplaints = {
  road: [
    { 
      id: 'R1001', 
      userName: 'Amit Kumar', 
      mobile: '9876543210',
      issueLocation: 'Sector 10, Nerul', 
      areaName: 'Nerul',
      ward: 'Ward 10',
      pincode: '400706',
      status: 'In Progress', 
      description: 'Road pothole in Nerul Sector 10 causing accidents',
      issueDate: '2024-03-15',
      liveLocation: '19.0330° N, 73.0297° E',
      images: ['https://images.unsplash.com/photo-1515168831946-51a8f2eaa9a2?w=200'],
      videos: [],
      progress: 40
    },
    { 
      id: 'R1002', 
      userName: 'Priya Singh', 
      mobile: '9876543211',
      issueLocation: 'Sector 17, Vashi', 
      areaName: 'Vashi',
      ward: 'Ward 17',
      pincode: '400703',
      status: 'Acknowledged', 
      description: 'Road damage near Vashi market',
      issueDate: '2024-03-16',
      liveLocation: '19.0748° N, 72.9989° E',
      images: ['https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=200'],
      videos: [],
      progress: 5
    },
    { 
      id: 'R1003', 
      userName: 'Rahul Verma', 
      mobile: '9876543212',
      issueLocation: 'Sector 15, CBD Belapur', 
      areaName: 'CBD Belapur',
      ward: 'Ward 15',
      pincode: '400614',
      status: 'Resolved', 
      description: 'Speed breaker missing near school',
      issueDate: '2024-03-10',
      liveLocation: '19.0350° N, 73.0150° E',
      images: [],
      videos: [],
      progress: 100
    },
    {
      id: 'R1004',
      userName: 'Sneha Patil',
      mobile: '9876543228',
      issueLocation: 'Sector 5, Nerul',
      areaName: 'Nerul',
      ward: 'Ward 5',
      pincode: '400706',
      status: 'Reported',
      description: 'Manhole cover missing on main road',
      issueDate: '2024-03-17',
      liveLocation: '19.0400° N, 73.0200° E',
      images: [],
      videos: [],
      progress: 0
    },
    {
      id: 'R1005',
      userName: 'Vikas Gupta',
      mobile: '9876543229',
      issueLocation: 'Sector 20, Kharghar',
      areaName: 'Kharghar',
      ward: 'Ward 20',
      pincode: '400710',
      status: 'In Progress',
      description: 'Road widening work incomplete',
      issueDate: '2024-03-14',
      liveLocation: '19.0500° N, 73.0600° E',
      images: ['https://images.unsplash.com/photo-1515168831946-51a8f2eaa9a2?w=200'],
      videos: [],
      progress: 60
    }
  ],
  
  water: [
    { 
      id: 'W2001', 
      userName: 'Suresh Patil', 
      mobile: '9876543213',
      issueLocation: 'Sector 8, Sanpada', 
      areaName: 'Sanpada',
      ward: 'Ward 8',
      pincode: '400705',
      status: 'In Progress', 
      description: 'Water leakage in Airoli pipeline',
      issueDate: '2024-03-14',
      liveLocation: '19.0560° N, 73.0010° E',
      images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200'],
      videos: [],
      progress: 40
    },
    {
      id: 'W2002',
      userName: 'Geeta Sharma',
      mobile: '9876543214',
      issueLocation: 'Sector 14, Koparkhairane',
      areaName: 'Koparkhairane',
      ward: 'Ward 14',
      pincode: '400709',
      status: 'Reported',
      description: 'No water supply for 3 days',
      issueDate: '2024-03-17',
      liveLocation: '19.1000° N, 73.0100° E',
      images: [],
      videos: [],
      progress: 0
    }
  ],
  
  electricity: [
    { 
      id: 'E3001', 
      userName: 'Rajesh Gupta', 
      mobile: '9876543216',
      issueLocation: 'Sector 40, Seawoods', 
      areaName: 'Seawoods',
      ward: 'Ward 40',
      pincode: '400706',
      status: 'In Progress', 
      description: 'Streetlight not working in Belapur',
      issueDate: '2024-03-15',
      liveLocation: '19.0200° N, 73.0200° E',
      images: ['https://images.unsplash.com/photo-1473341304170-971fcc0c5f9b?w=200'],
      videos: [],
      progress: 40
    }
  ],
  
  garbage: [
    { 
      id: 'G4001', 
      userName: 'Meena Shah', 
      mobile: '9876543219',
      issueLocation: 'Sector 6, Airoli', 
      areaName: 'Airoli',
      ward: 'Ward 6',
      pincode: '400708',
      status: 'In Progress', 
      description: 'Garbage not collected in Vashi Sector 17',
      issueDate: '2024-03-14',
      liveLocation: '19.1500° N, 72.9833° E',
      images: ['https://images.unsplash.com/photo-1526958977630-bc61b30a2009?w=200'],
      videos: [],
      progress: 40
    }
  ],
  
  infrastructure: [
    { 
      id: 'I5001', 
      userName: 'Vikas Jain', 
      mobile: '9876543222',
      issueLocation: 'Sector 11, CBD Belapur', 
      areaName: 'CBD Belapur',
      ward: 'Ward 11',
      pincode: '400614',
      status: 'In Progress', 
      description: 'Drain blockage in Ghansoli',
      issueDate: '2024-03-15',
      liveLocation: '19.0250° N, 73.0350° E',
      images: ['https://images.unsplash.com/photo-1515168831946-51a8f2eaa9a2?w=200'],
      videos: [],
      progress: 40
    }
  ],
  
  education: [
    { 
      id: 'ED6001', 
      userName: 'Teacher Rani', 
      mobile: '9876543225',
      issueLocation: 'Sector 10, CBD Belapur', 
      areaName: 'CBD Belapur',
      ward: 'Ward 10',
      pincode: '400614',
      status: 'In Progress', 
      description: 'School building repair needed',
      issueDate: '2024-03-15',
      liveLocation: '19.0300° N, 73.0250° E',
      images: ['https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200'],
      videos: [],
      progress: 40
    }
  ]
};

// Department names mapping
export const departmentNames = {
  'road': 'Road Department',
  'water': 'Water Department',
  'electricity': 'Electricity Department',
  'garbage': 'Garbage Department',
  'infrastructure': 'Infrastructure Department',
  'education': 'Education Department'
};

// ========== FEEDBACK DATA ==========
export const feedbackData = {
  road: [
    { user: 'Rajesh Kumar', rating: 4, review: 'Good work on road repair', date: '2024-03-15' },
    { user: 'Priya Singh', rating: 5, review: 'Very fast response', date: '2024-03-14' },
    { user: 'Amit Sharma', rating: 3, review: 'Work quality could be better', date: '2024-03-13' }
  ],
  water: [
    { user: 'Suresh Patil', rating: 5, review: 'Excellent service', date: '2024-03-15' },
    { user: 'Geeta Devi', rating: 4, review: 'Problem solved quickly', date: '2024-03-12' }
  ],
  electricity: [
    { user: 'Rajesh Gupta', rating: 3, review: 'Took too long', date: '2024-03-14' },
    { user: 'Sunita Singh', rating: 5, review: 'Very helpful staff', date: '2024-03-13' }
  ],
  garbage: [
    { user: 'Meena Shah', rating: 4, review: 'Regular collection now', date: '2024-03-15' },
    { user: 'Ravi Das', rating: 2, review: 'Still irregular', date: '2024-03-11' }
  ],
  infrastructure: [
    { user: 'Vikas Jain', rating: 5, review: 'Streetlight fixed quickly', date: '2024-03-14' },
    { user: 'Neha Singh', rating: 4, review: 'Good work', date: '2024-03-12' }
  ],
  education: [
    { user: 'Teacher Rani', rating: 5, review: 'School repairs done well', date: '2024-03-15' },
    { user: 'Principal Sir', rating: 4, review: 'Satisfied with work', date: '2024-03-10' }
  ]
};

// ========== NOTIFICATION TYPES ==========
export const notificationTypes = {
  NEW_COMPLAINT: 'new_complaint',
  PRIORITY_UPDATE: 'priority_update',
  STATUS_UPDATE: 'status_update'
};

// ========== STATUS OPTIONS ==========
export const statusOptions = [
  { value: 'Reported', label: 'Reported', color: '#6b7280' },
  { value: 'Acknowledged', label: 'Acknowledged', color: '#3b82f6' },
  { value: 'In Progress', label: 'In Progress', color: '#f59e0b' },
  { value: 'Resolved', label: 'Resolved', color: '#10b981' }
];

// ========== PROGRESS MESSAGES ==========
export const progressMessages = {
  5: "📋 Complaint received and acknowledged by department",
  10: "🔍 Issue verified by department officials",
  25: "📝 Work order assigned to contractor",
  50: "🚧 Work started at location",
  65: "⏳ Work 65% completed - Halfway done",
  80: "🔧 Final stage of repair work - 80% complete",
  90: "✅ Testing and quality check in progress",
  100: "🎉 Issue resolved successfully! Thank you for your patience"
};
