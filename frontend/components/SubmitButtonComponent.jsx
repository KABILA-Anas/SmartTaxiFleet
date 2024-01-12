import React from 'react'
import { Pressable, Text, View } from 'react-native'

const SubmitButtonComponent = ({ text, onPress, viewStyle, pressableStyle, textStyle }) => {
    return (
        <View style={viewStyle}>
            <Pressable style={pressableStyle} onPress={onPress}>
                <Text style={textStyle}>{text}</Text>
            </Pressable>
        </View>
    )
}

export default SubmitButtonComponent;