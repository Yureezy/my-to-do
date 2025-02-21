import React from 'react';
import { View, TextInput, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const TaskForm = ({ 
  newTask, 
  selectedDifficulty, 
  isEditing, 
  setNewTask, 
  setSelectedDifficulty, 
  handleSubmit 
}) => (
  <View style={styles.formContainer}>
    <TextInput
      style={styles.input}
      placeholder="Nouvelle tâche..."
      value={newTask}
      onChangeText={setNewTask}
    />
    
    <Picker
      selectedValue={selectedDifficulty}
      style={styles.picker}
      onValueChange={setSelectedDifficulty}
    >
      <Picker.Item label="Facile" value="facile" />
      <Picker.Item label="Moyen" value="moyen" />
      <Picker.Item label="Dur" value="dur" />
    </Picker>
    
    <Button 
      title={isEditing ? "Modifier" : "Ajouter"} 
      onPress={handleSubmit} 
    />
  </View>
);

const styles = {
  formContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
};

export default TaskForm; 