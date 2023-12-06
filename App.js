import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const CurrencyConverter = () => {
  const [convertedAmount, setConvertedAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [currencies, setCurrencies] = useState({});
  const [valueData, setValueData] = useState(0);

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

  const convertCurrency = async (value) => {
    
    try {
      //alert(`value: ${value} `);
      if (value === "" || Number(value) === 0 || value === undefined) {
        setConvertedAmount(0);
        return;
      }
      if (selectedCurrency === "USD") {
        setConvertedAmount(value);
        return;
      } else {
        try {
          const response = await axios.get(`https://api.frankfurter.app/latest?from=USD&to=${selectedCurrency}&amount=${value}`);
          setConvertedAmount(response.data.rates[selectedCurrency]);
        } catch (error) {
          console.error(error);
        }
      }

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    convertCurrency(valueData);
  }, [selectedCurrency, convertedAmount]);

  const valueChange = (e) => {
    const valueAmount = Number(e.target.value);
    const country = e.target.country;
    if (valueAmount === "" || valueAmount === undefined) {
      convertCurrency(0);
    }
    setSelectedCurrency(country);
    convertCurrency(valueAmount);
    setValueData(valueAmount);
  }

  return (
    <View style={styles.container}>
      <Text>USD to Currency Converter</Text>
      <TextInput
        style={styles.input}
        keyboardType='numeric'
        value={valueData.toString()}
        onChange={(e) => valueChange({ target: { value: e.nativeEvent.text, country: selectedCurrency }})}
        placeholder="Enter USD amount"
      />
      <Picker
        selectedValue={selectedCurrency}
        style={styles.picker}
        onValueChange={(itemValue) => {
          valueChange({ target: { value: Number(valueData),  country: itemValue } });
        }}
      >
      {Object.entries(currencies).map(([code, name]) => (
        <Picker.Item style={styles.pickerItem} key={code} label={`${name} (${code})`} value={code} />
      ))}
      </Picker>
      <Text>Amount:
      ${convertedAmount ? convertedAmount : 0}
      </Text>
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
