import React from 'react';
import HistoryList from '../components/HistoryList';

const CallHistoryScreen = ({ route }: any) => {
  const { deviceId } = route.params;

  // Mock data for Calls
  const callData = [
    { id: '1', title: 'Dad', subtitle: 'Outgoing • 5m 12s', timestamp: Date.now() - 1000 * 60 * 30 },
    { id: '2', title: '+1 555-010-777', subtitle: 'Incoming • 2m 45s', timestamp: Date.now() - 1000 * 60 * 60 * 5 },
    { id: '3', title: 'Best Friend', subtitle: 'Missed Call', timestamp: Date.now() - 1000 * 60 * 60 * 20 },
  ];

  return <HistoryList data={callData} title="Call History" />;
};

export default CallHistoryScreen;
