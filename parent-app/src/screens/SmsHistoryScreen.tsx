import React from 'react';
import HistoryList from '../components/HistoryList';

const SmsHistoryScreen = ({ route }: any) => {
  const { deviceId } = route.params;

  // Mock data for SMS
  const smsData = [
    { id: '1', title: '+1 555-010-999', subtitle: 'Hey, are you coming home soon?', timestamp: Date.now() - 1000 * 60 * 5 },
    { id: '2', title: 'Mom', subtitle: 'Remember to do your homework!', timestamp: Date.now() - 1000 * 60 * 60 * 2 },
    { id: '3', title: '+1 555-010-888', subtitle: 'The new game is out!', timestamp: Date.now() - 1000 * 60 * 60 * 24 },
  ];

  return <HistoryList data={smsData} title="SMS Messages" />;
};

export default SmsHistoryScreen;
