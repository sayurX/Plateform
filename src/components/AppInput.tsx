import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';

interface AppInputProps {
  label?: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
  textContentType?: 'none' | 'password' | 'newPassword' | 'emailAddress' | 'name' | 'telephoneNumber' | 'oneTimeCode';
  autoComplete?: 'off' | 'password' | 'password-new' | 'email' | 'name' | 'tel';
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = 'default',
  icon,
  style,
  textContentType,
  autoComplete,
}) => {
  const [showPassword, setShowPassword] = useState(!secureTextEntry);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        {icon && <Ionicons name={icon} size={20} color={Colors.textSecondary} style={styles.icon} />}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize="none"
          textContentType={textContentType ?? 'none'}
          autoComplete={autoComplete ?? 'off'}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons 
              name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
              size={20} 
              color={Colors.textSecondary} 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    height: '100%',
    color: Colors.text,
    fontSize: 16,
  },
  icon: {
    marginRight: 12,
  },
});
