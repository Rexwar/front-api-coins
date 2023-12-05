import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [currencies, setCurrencies] = useState({});

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get('https://api.frankfurter.app/currencies');
        setCurrencies(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCurrencies();
  }, []);

  const convertCurrency = async () => {
    try {
      const response = await axios.get(`https://api.frankfurter.app/latest?from=USD&to=${selectedCurrency}&amount=${amount}`);
      setConvertedAmount(response.data.rates[selectedCurrency]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>USD to Currency Converter</Text>
      <TextInput
        style={styles.input}
        keyboardType='numeric'
        value={amount}
        onChangeText={setAmount}
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
      <Button mode="contained" onPress={convertCurrency}>
        Convert
      </Button>
      {convertedAmount && <Text>Convaerted Amount: {convertedAmount} {selectedCurrency}</Text>}
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
    borderColor: 'gray',
    width: '100%',
    padding: 10,
    marginVertical: 10,
  },
  picker: {
    width: '100%',
    marginBottom: 10,
    backgroundColor: '#ccc',
  },
  'pickerItem': {
    fontSize: 12,
  },
});

export default CurrencyConverter;
