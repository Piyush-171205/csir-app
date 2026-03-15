import { useState, useEffect } from 'react';
import { citizensData, officersData, adminComplaintsData } from '../data/adminData';

export const useAdminStats = () => {
  const [stats, setStats] = useState({
    totalCitizens: 0,
    activeCitizens: 0,
    blockedCitizens: 0,
    totalOfficers: 0,
    activeOfficers: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0,
    resolvedComplaints: 0,
    urgentComplaints: 0
  });

  useEffect(() => {
    // Calculate citizen stats
    const totalCitizens = citizensData.length;
    const activeCitizens = citizensData.filter(c => c.status === 'active').length;
    const blockedCitizens = citizensData.filter(c => c.status === 'blocked').length;

    // Calculate officer stats
    const totalOfficers = officersData.length;
    const activeOfficers = officersData.filter(o => o.status === 'active').length;

    // Calculate complaint stats
    const totalComplaints = adminComplaintsData.length;
    const pendingComplaints = adminComplaintsData.filter(c => c.status === 'pending').length;
    const inProgressComplaints = adminComplaintsData.filter(c => c.status === 'in-progress').length;
    const resolvedComplaints = adminComplaintsData.filter(c => c.status === 'resolved').length;
    const urgentComplaints = adminComplaintsData.filter(c => c.priority === 'urgent').length;

    setStats({
      totalCitizens,
      activeCitizens,
      blockedCitizens,
      totalOfficers,
      activeOfficers,
      totalComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
      urgentComplaints
    });
  }, []);

  return stats;
};