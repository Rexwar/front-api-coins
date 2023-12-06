import React, { useState, useEffect } from 'react';
import { ImageBackground, View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const CurrencyConverter = () => {
  const [convertedAmount, setConvertedAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [currencies, setCurrencies] = useState({});
  const [valueData, setValueData] = useState('');
  const [image, setImage] = useState(require('./assets/fondo.jpg'));

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get('https://api.frankfurter.app/currencies');
        setCurrencies(response.data);
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    };
    fetchCurrencies();
  }, []);

  const convertCurrency = async (value) => {
    if (value === '') {
      setConvertedAmount('');
      return;
    }

    if (isNaN(value) || value <= 0) {
      Alert.alert("Error", "Please enter a positive number.");
      return;
    }

    try {
      if (selectedCurrency === "USD") {
        setConvertedAmount(value);
      } else {
        const response = await axios.get(`https://api.frankfurter.app/latest?from=USD&to=${selectedCurrency}&amount=${value}`);
        setConvertedAmount(response.data.rates[selectedCurrency]);
      }
    } catch (error) {
      Alert.alert("Conversion Error", error.message);
    }
  };

  useEffect(() => {
    if (valueData !== '') {
      convertCurrency(parseFloat(valueData));
    } else {
      setConvertedAmount('');
    }
  }, [selectedCurrency, valueData]);

  const handleValueChange = (text) => {
    if (/^\d*\.?\d*$/.test(text)) {
      setValueData(text);
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <Text style={styles.texto}>USD to Currency Converter</Text>
        <TextInput
          style={styles.input}
          keyboardType='numeric'
          value={valueData}
          onChangeText={handleValueChange}
          placeholder="Enter USD amount"
        />
        <Picker
          selectedValue={selectedCurrency}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedCurrency(itemValue)}
        >
          {Object.entries(currencies).map(([code, name]) => (
            <Picker.Item style={styles.pickerItem} key={code} label={`${name} (${code})`} value={code} />
          ))}
        </Picker>
        <Text style={styles.textoResultado}>
          Amount: ${convertedAmount ? parseFloat(convertedAmount).toFixed(2).replace(/[.,]00$/, '') : ''}
        </Text>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: '#dcdcdc',
    width: '90%',
    padding: 10,
    marginVertical: 10,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
  },
  picker: {
    width: '90%',
    marginBottom: 10,
    backgroundColor: '#ffffd5',
    marginLeft: 20,
    marginRight: 20,
  },
  'pickerItem': {
    fontSize: 12,
    color: '#c9a974',
    backgroundColor: '#ffffd5',
  },
  image: {
    display: 'flex',
    marginTop: 20,
    flex: 1,
    justifyContent: 'center',
    resizeMode: 'cover', // Esto asegura que la imagen cubra toda la pantalla
    width: '100%', // Establecer el ancho al 100% de la pantalla
    height: '100%',
  },
  texto: {
    color: '#c9a974',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    opacity: 0.9,
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 }, // posicion de la sombra
    textShadowRadius: 2, // grosor de la sombra
    backgroundColor: '#ffffd5',
    borderRadius: 120,
    marginLeft: 20,
    marginRight: 20,
  },
  textoResultado:{
    color: '#ffffd5',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    opacity: 0.9,
    textShadowColor: 'black', 
    textShadowOffset: { width: 2, height: 2 }, // posicion de la sombra
    textShadowRadius: 2, // grosor de la sombra
    backgroundColor: '#c9a974',
    marginTop: 20,

  },
});

export default CurrencyConverter;
