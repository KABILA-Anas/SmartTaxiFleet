import React from 'react'
import { TextInput, View } from 'react-native'


const InputComponent = ({ value, onChange, placeholder, inputStyle, type = 'text' }) => {
    return (
        <View>
            <TextInput
                style={inputStyle}
                value={value}
                placeholder={placeholder}
                onChangeText={onChange}
                autoCorrect={false}
                autoCapitalize='none'
                secureTextEntry={type === 'password'}
            />
        </View>
    )
}

export default InputComponent;