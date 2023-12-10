import React from 'react';
import { TouchableOpacity, Text, Switch, View } from 'react-native';

const OptionRow = ({ label, onPress, hasSwitch = false, value, onToggle, theme, styles }) => {
    return (
        <TouchableOpacity
            style={styles.optionContainer}
            onPress={hasSwitch ? () => onToggle(!value) : onPress}
        >
            <Text style={{ fontWeight: 'bold', color: theme === 'dark' ? 'white' : 'black', flex: 1 }}>
                {label}
            </Text>
            {hasSwitch && (
                <Switch onValueChange={onToggle} value={value} />
            )}
        </TouchableOpacity>
    );
};

export default OptionRow;
