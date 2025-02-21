import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  Modal,
  Animated,
  Platform 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../context/ThemeContext';

// Utilisation des paramètres par défaut au lieu de defaultProps
export default function HomeScreen({ 
  tasks = [], 
  setTasks = () => {}, 
  archivedTasks = [], 
  setArchivedTasks = () => {} 
}) {
  const { theme } = useTheme();
  const [newTask, setNewTask] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Court');
  const [currentTask, setCurrentTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [taskDate, setTaskDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const addTask = () => {
    if (newTask.trim()) {
      if (currentTask) {
        // Modification de la tâche existante
        setTasks(tasks.map(task => 
          task.id === currentTask.id 
            ? { ...task, text: newTask, description: taskDescription, difficulty: selectedDifficulty, date: taskDate } 
            : task
        ));
        setCurrentTask(null);
      } else {
        // Ajout d'une nouvelle tâche
        setTasks([...tasks, {
          id: Date.now().toString(),
          text: newTask,
          description: taskDescription,
          difficulty: selectedDifficulty,
          date: taskDate,
          completed: false
        }]);
      }
      setNewTask('');
      setTaskDescription('');
      setTaskDate(new Date());
      setModalVisible(false);
    }
  };

  const archiveTask = (id) => {
    const taskToArchive = tasks.find(task => task.id === id);
    setArchivedTasks([...archivedTasks, taskToArchive]);
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleCompletion = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEdit = (task) => {
    setNewTask(task.text);
    setTaskDescription(task.description);
    setSelectedDifficulty(task.difficulty);
    setTaskDate(new Date(task.date));
    setCurrentTask(task);
    setModalVisible(true);
  };

  const openModalForNewTask = () => {
    setNewTask('');
    setTaskDescription('');
    setSelectedDifficulty('Court');
    setTaskDate(new Date());
    setCurrentTask(null);
    setModalVisible(true);
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Court': return '#90EE90';
      case 'Moyen': return '#FFD700';
      case 'Long': return '#FF6347';
      default: return '#FFFFFF';
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setTaskDate(selectedDate);
    }
  };

  const renderDatePicker = () => {
    if (!showDatePicker) return null;

    return (
      <DateTimePicker
        testID="dateTimePicker"
        value={taskDate}
        mode="date"
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={handleDateChange}
        // Suppression de l'utilisation de defaultProps, utilisation de valeurs directes
        minimumDate={new Date()}
        textColor="#000000"
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>✨ Ma Todo List</Text>
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={openModalForNewTask}
      >
        <Text style={styles.addButtonText}>+ Nouvelle tâche</Text>
      </TouchableOpacity>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <Animated.View style={[styles.taskContainer, { backgroundColor: theme.colors.surface }]}>
            <TouchableOpacity 
              style={styles.taskContent}
              onPress={() => toggleCompletion(item.id)}
            >
              <View style={styles.taskHeader}>
                <Text style={[styles.taskText, { color: theme.colors.text }, item.completed && styles.completed]}>
                  {item.text}
                </Text>
                <Text style={[styles.dateText, { color: theme.colors.secondary }]}>
                  {new Date(item.date).toLocaleDateString()}
                </Text>
              </View>
              <Text style={[styles.taskDescription, { color: theme.colors.secondary }]}>
                {item.description}
              </Text>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
                <Text style={styles.difficultyText}>{item.difficulty}</Text>
              </View>
            </TouchableOpacity>
            
            <View style={styles.buttonsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.editButton]}
                onPress={() => startEdit(item)}
              >
                <Text style={styles.buttonText}>Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.archiveButton]}
                onPress={() => archiveTask(item.id)}
              >
                <Text style={styles.buttonText}>Archiver</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalView, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              {currentTask ? "Modifier la tâche" : "Nouvelle tâche"}
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.isDarkMode ? '#333' : '#f8f9fa',
                color: theme.colors.text 
              }]}
              placeholder="Que souhaitez-vous faire ?"
              placeholderTextColor={theme.colors.secondary}
              value={newTask}
              onChangeText={setNewTask}
            />
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.isDarkMode ? '#333' : '#f8f9fa',
                color: theme.colors.text 
              }]}
              placeholder="Description"
              placeholderTextColor={theme.colors.secondary}
              value={taskDescription}
              onChangeText={setTaskDescription}
            />
            
            <View style={styles.difficultyContainer}>
              <TouchableOpacity 
                style={[styles.difficultyButton, selectedDifficulty === 'Court' && { backgroundColor: getDifficultyColor('Court') }]}
                onPress={() => setSelectedDifficulty('Court')}
              >
                <Text style={styles.difficultyButtonText}>Court</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.difficultyButton, selectedDifficulty === 'Moyen' && { backgroundColor: getDifficultyColor('Moyen') }]}
                onPress={() => setSelectedDifficulty('Moyen')}
              >
                <Text style={styles.difficultyButtonText}>Moyen</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.difficultyButton, selectedDifficulty === 'Long' && { backgroundColor: getDifficultyColor('Long') }]}
                onPress={() => setSelectedDifficulty('Long')}
              >
                <Text style={styles.difficultyButtonText}>Long</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                Sélectionner la date ({taskDate.toLocaleDateString()})
              </Text>
            </TouchableOpacity>

            {renderDatePicker()}
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: getDifficultyColor(selectedDifficulty) }]}
                onPress={addTask}
              >
                <Text style={styles.buttonText}>
                  {currentTask ? "Modifier" : "Ajouter"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  listContainer: {
    paddingBottom: 20,
  },
  addButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  taskContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskContent: {
    padding: 15,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskText: {
    fontSize: 16,
    color: '#2c3e50',
    flex: 1,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#95a5a6',
  },
  dateText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 8,
  },
  taskDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 8,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    marginTop: 4,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  buttonsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  actionButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  editButton: {
    borderRightWidth: 1,
    borderRightColor: '#ecf0f1',
  },
  archiveButton: {
    backgroundColor: '#ffefef',
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  difficultyButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: '#f1f2f6',
    alignItems: 'center',
  },
  difficultyButtonText: {
    color: '#2c3e50',
    fontSize: 16,
  },
  dateButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  dateButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f2f6',
  },
  confirmButton: {
    backgroundColor: '#3498db',
  },
});
