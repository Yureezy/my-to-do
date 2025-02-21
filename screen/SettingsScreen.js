import React from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();

  const renderSettingItem = ({ icon, title, value, onPress, type = 'toggle' }) => (
    <TouchableOpacity 
      style={[styles.settingItem, { borderBottomColor: theme.colors.border }]} 
      onPress={onPress}
      key={title}
    >
      <View style={styles.settingItemLeft}>
        <Icon name={icon} size={24} color={theme.colors.primary} style={styles.settingIcon} />
        <Text style={[styles.settingTitle, { color: theme.colors.text }]}>{title}</Text>
      </View>
      {type === 'toggle' ? (
        <Switch
          value={value}
          onValueChange={onPress}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          thumbColor={value ? theme.colors.surface : theme.colors.secondary}
        />
      ) : (
        <Icon name="chevron-forward" size={20} color={theme.colors.secondary} />
      )}
    </TouchableOpacity>
  );

  const renderSection = (title, children) => (
    <View style={styles.section} key={title}>
      <Text style={[styles.sectionTitle, { color: theme.colors.secondary }]}>{title}</Text>
      <View style={[styles.sectionContent, { backgroundColor: theme.colors.surface }]}>
        {children}
      </View>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderSection('Apparence', [
        renderSettingItem({
          icon: 'moon-outline',
          title: 'Mode sombre',
          value: theme.isDarkMode,
          onPress: toggleTheme
        }),
      ])}

      {renderSection('Notifications', [
        renderSettingItem({
          icon: 'notifications-outline',
          title: 'Activer les notifications',
          value: false,
          onPress: () => {}
        }),
        renderSettingItem({
          icon: 'time-outline',
          title: 'Rappels quotidiens',
          value: true,
          onPress: () => {}
        })
      ])}

      {renderSection('Application', [
        renderSettingItem({
          icon: 'information-circle-outline',
          title: 'À propos',
          type: 'link',
          onPress: () => {}
        }),
        renderSettingItem({
          icon: 'shield-checkmark-outline',
          title: 'Confidentialité',
          type: 'link',
          onPress: () => {}
        }),
        renderSettingItem({
          icon: 'help-circle-outline',
          title: 'Aide',
          type: 'link',
          onPress: () => {}
        })
      ])}

      <View style={styles.footer}>
        <Text style={[styles.version, { color: theme.colors.secondary }]}>
          Version 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  sectionContent: {
    borderRadius: 10,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  version: {
    fontSize: 14,
  }
});
