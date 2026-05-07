import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ScreenTimeScreen = ({ route }: any) => {
  // Mock usage data
  const usageStats = [
    { name: 'YouTube', duration: '2h 15m', percentage: 45, color: '#FF0000' },
    { name: 'Instagram', duration: '1h 30m', percentage: 30, color: '#E1306C' },
    { name: 'Roblox', duration: '45m', percentage: 15, color: '#000000' },
    { name: 'WhatsApp', duration: '20m', percentage: 10, color: '#25D366' },
  ];

  const UsageBar = ({ item }: any) => (
    <View style={styles.appRow}>
      <View style={styles.appInfo}>
        <View style={[styles.appIcon, { backgroundColor: item.color }]} />
        <View>
          <Text style={styles.appName}>{item.name}</Text>
          <Text style={styles.appDuration}>{item.duration}</Text>
        </View>
      </View>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${item.percentage}%`, backgroundColor: item.color }]} />
        <Text style={styles.percentageText}>{item.percentage}%</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Screen Time</Text>
        <Text style={styles.totalTime}>Total: 4h 50m Today</Text>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Usage Distribution</Text>
        <View style={styles.mockDonutContainer}>
          {/* Mocking a donut chart with nested views for high-fidelity UI */}
          <View style={styles.mockDonut}>
            <View style={styles.donutInner}>
              <Text style={styles.donutText}>4h 50m</Text>
              <Text style={styles.donutSubtext}>Total</Text>
            </View>
          </View>
          <View style={styles.legendContainer}>
            {usageStats.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={styles.legendLabel}>{item.name}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Detailed Breakdown</Text>
      <View style={styles.statsContainer}>
        {usageStats.map((app, index) => (
          <UsageBar key={index} item={app} />
        ))}
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Weekly Summary</Text>
        <Text style={styles.summaryText}>Usage is up 12% compared to last week.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 25,
    backgroundColor: '#FFF',
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  totalTime: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  chartCard: {
    backgroundColor: '#FFF',
    margin: 15,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  mockDonutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  mockDonut: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 15,
    borderColor: '#FF0000', // YouTube Red for outer
    justifyContent: 'center',
    alignItems: 'center',
  },
  donutInner: {
    alignItems: 'center',
  },
  donutText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  donutSubtext: {
    fontSize: 10,
    color: '#888',
  },
  legendContainer: {
    flex: 1,
    marginLeft: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  legendLabel: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,
    color: '#444',
  },
  statsContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
  },
  appRow: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  appIcon: {
    width: 35,
    height: 35,
    borderRadius: 8,
    marginRight: 15,
  },
  appName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  appDuration: {
    fontSize: 12,
    color: '#888',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    flex: 1,
    marginRight: 10,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    width: 35,
  },
  summaryCard: {
    backgroundColor: '#E3F2FD',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 5,
  },
  summaryText: {
    color: '#42A5F5',
  },
});

export default ScreenTimeScreen;
