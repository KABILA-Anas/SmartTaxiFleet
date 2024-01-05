//import {useStyles, createStyleSheet} from 'styles';
import {View, Text, StyleSheet} from 'react-native';


const Button = () => {

  return (
    <View style={styles.root}>
      <View style={styles.rectangle21}/>
      <Text>Sign In</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    root: {
        width: 335,
        height: 59,
        flexShrink: 0,
      },
      rectangle21: {
        width: 335,
        height: 59,
        flexShrink: 0,
        borderRadius: 75,
      },
      submit: {
        width: 61,
        color: 'rgba(16, 16, 16, 1)',
        textAlign: 'center',
        fontFamily: 'Poppins',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '600',
        letterSpacing: -0.241,
      },
});

export default Button;