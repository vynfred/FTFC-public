import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase-config';
import { isWithinInterval } from 'date-fns';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    newLeads: 0,
    newInvestors: 0,
    revenue: 0,
    expenses: 0
  });
  const [timeframe, setTimeframe] = useState('week'); // default 1 week

  useEffect(() => {
    fetchStats();
  }, [timeframe]);

  const fetchStats = async () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    try {
      // Fetch new leads
      const leadsQuery = query(
        collection(db, 'leads'),
        where('createdAt', '>=', oneWeekAgo)
      );
      const leadsSnap = await getDocs(leadsQuery);

      // Fetch new investors
      const investorsQuery = query(
        collection(db, 'investors'),
        where('createdAt', '>=', oneWeekAgo)
      );
      const investorsSnap = await getDocs(investorsQuery);

      // Fetch revenue and expenses
      const transactionsQuery = query(
        collection(db, 'transactions'),
        where('date', '>=', oneWeekAgo)
      );
      const transactionsSnap = await getDocs(transactionsQuery);

      let revenue = 0;
      let expenses = 0;
      transactionsSnap.docs.forEach(doc => {
        const transaction = doc.data();
        if (transaction.type === 'revenue') {
          revenue += transaction.amount;
        } else if (transaction.type === 'expense') {
          expenses += transaction.amount;
        }
      });

      setStats({
        newLeads: leadsSnap.size,
        newInvestors: investorsSnap.size,
        revenue,
        expenses
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const calculateStats = useMemo(() => {
    return {
      newLeads: stats.newLeads,
      newInvestors: stats.newInvestors,
      revenue: stats.revenue,
      expenses: stats.expenses
    };
  }, [stats.newLeads, stats.newInvestors, stats.revenue, stats.expenses]);

  return (
    <div className="dashboard-stats">
      <div className="stat-card">
        <div className="stat-number">{calculateStats.newLeads}</div>
        <div className="stat-label">New Leads</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{calculateStats.newInvestors}</div>
        <div className="stat-label">New Investors</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">${calculateStats.revenue.toLocaleString()}</div>
        <div className="stat-label">Revenue</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">${calculateStats.expenses.toLocaleString()}</div>
        <div className="stat-label">Expenses</div>
      </div>
    </div>
  );
};

export default DashboardStats; 