import React, { useState, useEffect } from 'react';
import { ImageBackground, View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const currencyToCountry = {
  AUD: 'AU', BGN: 'BG', BRL: 'BR', CAD: 'CA', CHF: 'CH', CNY: 'CN', CZK: 'CZ', DKK: 'DK',
  EUR: 'EU', GBP: 'GB', HKD: 'HK', HUF: 'HU', IDR: 'ID', ILS: 'IL', INR: 'IN', ISK: 'IS',
  JPY: 'JP', KRW: 'KR', MXN: 'MX', MYR: 'MY', NOK: 'NO', NZD: 'NZ', PHP: 'PH', PLN: 'PL',
  RON: 'RO', SEK: 'SE', SGD: 'SG', THB: 'TH', TRY: 'TR', USD: 'US', ZAR: 'ZA'
};

/**
 * Devuelve el emoji de la bandera correspondiente al código de país dado.
 * @param {string} countryCode - El código de país ISO 3166-1 alfa-2 (dos letras).
 * @returns {string} El emoji de la bandera correspondiente al código de país dado.
 */
const getFlagEmoji = (countryCode) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char =>  127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}


/**
 * Componente CurrencyConverter para convertir monedas de USD a otras monedas.
 */
const CurrencyConverter = () => {
  // Estados del componente
  const [convertedAmount, setConvertedAmount] = useState(''); // Monto convertido
  const [selectedCurrency, setSelectedCurrency] = useState('EUR'); // Moneda seleccionada
  const [currencies, setCurrencies] = useState({}); // Lista de monedas disponibles
  const [valueData, setValueData] = useState(''); // Monto ingresado por el usuario
  const [image, setImage] = useState(require('./assets/fondo.jpg')); // Imagen de fondo

  /**
   * Efecto para cargar las monedas disponibles al montar el componente.
   * Realiza una solicitud GET a la API de Frankfurter para obtener la lista de monedas.
   */
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

  /**
   * Convierte el monto ingresado a la moneda seleccionada.
   * @param {number} value - El monto en USD a convertir.
   */
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

  /**
   * Efecto para convertir la moneda cuando cambia el monto ingresado o la moneda seleccionada.
   */
  useEffect(() => {
    if (valueData !== '') {
      convertCurrency(parseFloat(valueData));
    } else {
      setConvertedAmount('');
    }
  }, [selectedCurrency, valueData]);

  /**
   * Valida y establece el monto ingresado.
   * @param {string} text - El texto ingresado en el campo de monto.
   */
  const handleValueChange = (text) => {
    // Solo permite números positivos (enteros o decimales)
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
            <Picker.Item 
            style={styles.pickerItem} 
            key={code} 
            label={`${getFlagEmoji(currencyToCountry[code] || 'US')} ${name} (${code})`} 
            value={code} 
          />
          ))}
        </Picker>
        <Text style={styles.textoResultado}>
          Amount: ${convertedAmount ? parseFloat(convertedAmount).toFixed(2).replace(/[.,]00$/, '') : ''}{" "}{selectedCurrency}
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
