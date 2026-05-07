import React from 'react';
import HistoryList from '../components/HistoryList';

const NotificationHistoryScreen = ({ route }: any) => {
  const { deviceId } = route.params;

  // Mock data for Notifications
  const notificationData = [
    { id: '1', title: 'WhatsApp', subtitle: 'New message from "School Group"', timestamp: Date.now() - 1000 * 60 * 2 },
    { id: '2', title: 'Instagram', subtitle: 'User "johndoe" liked your photo', timestamp: Date.now() - 1000 * 60 * 15 },
    { id: '3', title: 'YouTube', subtitle: 'New video from "MKBHD": iPhone 18 Review', timestamp: Date.now() - 1000 * 60 * 60 * 4 },
  ];

  return <HistoryList data={notificationData} title="App Notifications" />;
};

export default NotificationHistoryScreen;
