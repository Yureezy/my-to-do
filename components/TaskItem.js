import React from 'react';
import { View, Text, TouchableOpacity, Button } from 'react-native';

const TaskItem = ({ task, onToggle, onEdit, onDelete }) => {
  const getDifficultyColor = () => {
    switch(task.difficulty) {
      case 'facile': return '#90EE90';
      case 'moyen': return '#FFD700';
      case 'dur': return '#FF6347';
      default: return '#ddd';
    }
  };

  return (
    <View style={styles.taskContainer}>
      <TouchableOpacity onPress={onToggle}>
        <Text style={[styles.taskText, task.completed && styles.completed]}>
          {task.text}
        </Text>
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor() }]}>
          <Text style={styles.difficultyText}>{task.difficulty}</Text>
        </View>
      </TouchableOpacity>
      
      <View style={styles.buttonsContainer}>
        <Button title="Modifier" onPress={onEdit} />
        <Button title="Supprimer" onPress={onDelete} color="red" />
      </View>
    </View>
  );
};

const styles = {
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  taskText: {
    fontSize: 16,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  difficultyBadge: {
    padding: 5,
    borderRadius: 10,
    marginTop: 5,
  },
  difficultyText: {
    fontSize: 12,
    color: '#000',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
};

export default TaskItem; 