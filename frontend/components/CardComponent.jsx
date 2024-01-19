import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { COLORS } from '../constants/theme';

const CardComponent = ({passenger}) => {

  return (
          <View key={passenger.id} style={styles.cardContainer}>
            <View style={styles.cardInfoContainer}>
                <View style={styles.cardInfoItem}>
                    <Icon name="user" size={40} color="gray" />
                </View>
              <View style={styles.cardInfoItem}>
                <Text style={styles.cardInfoLabel}>Name</Text>
                <Text style={styles.cardInfoValue}>{passenger.name}</Text>
              </View>
              <View style={styles.cardInfoItem}>
                <Text style={styles.cardInfoLabel}>Distance</Text>
                <Text style={styles.cardNumber}>3.5km</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.paymentButton}>
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
          </View>
  );
};


const styles = StyleSheet.create({
  container: {
    paddingTop:10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'#00008B',
  },
  cardContainer: {
    marginHorizontal:10,
    width: 300,
    height: 140,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderBottomWidth: 6,
    borderBottomColor: '#ccc',
  },
  cardNumber: {
    fontSize: 16,
    letterSpacing: 1,
    marginBottom: 10,
  },
  cardInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardInfoItem: {
    flex: 1,
  },
  cardInfoLabel: {
    fontSize: 12,
    color: 'gray',
  },
  cardInfoValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  carouselContainer: {
    marginVertical: 40,
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 30,
  },
  paymentButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CardComponent;