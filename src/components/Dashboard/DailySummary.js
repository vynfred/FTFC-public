import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase-config';
import axios from 'axios';

const DailySummary = () => {
  const [summaryView, setSummaryView] = useState('personal'); // 'personal' or 'team'
  const [tasks, setTasks] = useState([]);
  const [teamTasks, setTeamTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState('');
  const [aiError, setAiError] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (tasks.length > 0 || teamTasks.length > 0) {
      generateAISummary();
    }
  }, [tasks, teamTasks]);

  const fetchTasks = async () => {
    try {
      // Fetch personal tasks
      const personalTasksQuery = query(
        collection(db, 'tasks'),
        where('assignedTo', '==', 'currentUserId'),
        where('dueDate', '>=', new Date())
      );
      
      // Fetch team tasks
      const teamTasksQuery = query(
        collection(db, 'tasks'),
        where('teamId', '==', 'currentTeamId'),
        where('dueDate', '>=', new Date())
      );

      const [personalSnapshot, teamSnapshot] = await Promise.all([
        getDocs(personalTasksQuery),
        getDocs(teamTasksQuery)
      ]);

      setTasks(personalSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));

      setTeamTasks(teamSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));

      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  const generateAISummary = async () => {
    try {
      const taskSummary = {
        personalTasks: tasks.map(task => ({
          title: task.title,
          dueDate: task.dueDate.toDate().toLocaleDateString(),
          priority: task.priority || 'normal'
        })),
        teamTasks: teamTasks.map(task => ({
          title: task.title,
          assignee: task.assignedToName,
          status: task.status
        }))
      };

      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: "claude-3-sonnet-20240229",
          max_tokens: 1024,
          messages: [{
            role: "user",
            content: `As a professional assistant, create a concise daily summary:
              1. Highlight my top 3 priority tasks with deadlines
              2. Mention key team activities
              3. Focus on actionable items
              4. Keep it motivational and brief

              Data: ${JSON.stringify(taskSummary, null, 2)}`
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.REACT_APP_ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01'
          }
        }
      );

      setAiSummary(response.data.content[0].text);
    } catch (error) {
      console.error('Error generating AI summary:', error);
      setAiError(true);
    }
  };

  return (
    <div className="daily-summary">
      {loading ? (
        <div className="loading-spinner" />
      ) : (
        <>
          <div className="summary-header">
            <h2>Daily Summary</h2>
            <div className="view-toggle">
              <button 
                className={`toggle-btn ${summaryView === 'personal' ? 'active' : ''}`}
                onClick={() => setSummaryView('personal')}
              >
                My Tasks
              </button>
              <button 
                className={`toggle-btn ${summaryView === 'team' ? 'active' : ''}`}
                onClick={() => setSummaryView('team')}
              >
                Team Tasks
              </button>
            </div>
          </div>

          {aiSummary && (
            <div className="ai-summary">
              <h3>Daily Overview</h3>
              <p>{aiSummary}</p>
            </div>
          )}

          <div className="summary-content">
            {summaryView === 'personal' ? (
              <div className="personal-summary">
                <h3>Today's Priority Tasks</h3>
                {tasks.map(task => (
                  <div key={task.id} className="task-item">
                    <h4>{task.title}</h4>
                    <p>{task.description}</p>
                    <span className="due-date">Due: {task.dueDate.toDate().toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="team-summary">
                <p className="team-overview">
                  Team members are currently working on {teamTasks.length} tasks across various projects.
                  Key focus areas include lead generation, investor relations, and client onboarding.
                </p>
                {teamTasks.map(task => (
                  <div key={task.id} className="team-task-item">
                    <span className="assignee">{task.assignedToName}</span> is working on 
                    <span className="task-name"> {task.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DailySummary; 