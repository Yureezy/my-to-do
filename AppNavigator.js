import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from './screen/HomeScreen';
import SettingsScreen from './screen/SettingsScreen';
import { useTheme } from './context/ThemeContext';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const [tasks, setTasks] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Menu') iconName = 'home-outline';
          else if (route.name === 'Paramètres') iconName = 'settings-outline';
          else if (route.name === 'Archives') iconName = 'archive-outline';
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.secondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
      })}
    >
      <Tab.Screen name="Archives">
        {() => <ArchivedTasksScreen archivedTasks={archivedTasks} />}
      </Tab.Screen>
      <Tab.Screen name="Menu">
        {() => <HomeScreen tasks={tasks} setTasks={setTasks} archivedTasks={archivedTasks} setArchivedTasks={setArchivedTasks} />}
      </Tab.Screen>
      <Tab.Screen name="Paramètres" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function ArchivedTasksScreen({ archivedTasks }) {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Tâches archivées</Text>
      <FlatList
        data={archivedTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.taskContainer, { backgroundColor: theme.colors.surface }]} key={item.id}>
            <Text style={[styles.taskText, { color: theme.colors.text }]}>{item.text}</Text>
            <Text style={[styles.taskDescription, { color: theme.colors.secondary }]}>
              {item.description}
            </Text>
            <Text style={[styles.dateText, { color: theme.colors.secondary }]}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#2c3e50',
    textAlign: 'center',
  },
  taskContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  taskDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 8,
  },
});
