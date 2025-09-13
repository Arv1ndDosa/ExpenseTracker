import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const STORES = [
  // Grocery/Supermarkets
  'Costco', 'Walmart', 'Target', 'Trader Joe\'s', 'Safeway', 'Whole Foods', 'Aldi', 'Kroger', 'Publix', 'H-E-B', 'Wegmans', 'Meijer', 'Food Lion', 'Giant Eagle', 'Harris Teeter', 'WinCo Foods', 'King Soopers', 'Ralphs', 'Vons', 'Albertsons', 'Stop & Shop', 'ShopRite', 'Acme Markets', 'Fred Meyer', 'Smith\'s', 'Fry\'s Food Stores', 'QFC', 'Jewel-Osco', 'Dominick\'s', 'Mariano\'s', 'Fresh Market', 'Piggly Wiggly', 'Winn-Dixie', 'BI-LO', 'Food 4 Less', 'Foods Co', 'Lucky', 'Pavilions', 'Star Market', 'Shaw\'s', 'Giant Food', 'Martin\'s', 'Price Chopper', 'Market Basket', 'Hannaford', 'IGA', 'Schnucks', 'Hy-Vee', 'Festival Foods', 'Woodman\'s Markets',
  // Convenience/Gas Stations
  '7-Eleven', 'Circle K', 'Wawa', 'QuikTrip', 'Sheetz', 'RaceTrac', 'Casey\'s General Store', 'Speedway', 'Cumberland Farms', 'GetGo', 'Kwik Trip', 'Maverik', 'Murphy USA', 'Shell', 'BP', 'Exxon', 'Chevron',
  // Pharmacy/Health
  'CVS', 'Walgreens', 'Rite Aid', 'Duane Reade',
  // Dollar/Discount Stores
  'Dollar Tree', 'Dollar General', 'Family Dollar', '99 Cents Only', 'Five Below',
  // Home Improvement/Hardware
  'Home Depot', 'Lowe\'s', 'Menards', 'Ace Hardware', 'True Value', 'Harbor Freight Tools',
  // Department/Big Box Stores
  'Macy\'s', 'JCPenney', 'Kohl\'s', 'Nordstrom', 'Dillard\'s', 'Sears', 'Bloomingdale\'s', 'Nordstrom Rack', 'T.J. Maxx', 'Marshalls', 'Ross Dress for Less', 'Burlington', 'Big Lots',
  // Electronics
  'Best Buy', 'GameStop', 'RadioShack', 'Micro Center', 'Fry\'s Electronics',
  // Office/School Supplies
  'Staples', 'Office Depot', 'OfficeMax',
  // Pet Supplies
  'PetSmart', 'Petco', 'Tractor Supply Co.',
  // Specialty Food
  'Fresh Thyme', 'Sprouts Farmers Market', 'Natural Grocers', 'The Fresh Market', 'Earth Fare', 'Whole Foods 365',
  // Warehouse/Bulk
  'Sam\'s Club', 'BJ\'s Wholesale Club', 'Restaurant Depot',
  // Auto Parts
  'AutoZone', 'O\'Reilly Auto Parts', 'Advance Auto Parts', 'NAPA Auto Parts', 'Pep Boys',
  // Sporting Goods
  'Dick\'s Sporting Goods', 'Sports Authority', 'Big 5 Sporting Goods', 'Modell\'s', 'Academy Sports + Outdoors', 'Cabela\'s', 'Bass Pro Shops', 'REI',
  // Craft/Hobby
  'Michaels', 'Hobby Lobby', 'Jo-Ann Fabrics', 'AC Moore',
  // Books
  'Barnes & Noble', 'Books-A-Million',
  // Toys
  'Toys"R"Us', 'KB Toys', 'Learning Express',
  // Furniture/Home
  'IKEA', 'Ashley HomeStore', 'Rooms To Go', 'West Elm', 'Pottery Barn', 'Crate & Barrel', 'Williams Sonoma', 'Bed Bath & Beyond', 'Container Store', 'World Market',
  // Beauty/Cosmetics
  'Ulta Beauty', 'Sephora', 'Sally Beauty',
  // Clothing
  'Gap', 'Old Navy', 'Banana Republic', 'H&M', 'Forever 21', 'Zara', 'Uniqlo', 'American Eagle', 'Abercrombie & Fitch', 'Hollister', 'Express', 'Ann Taylor', 'Loft', 'Victoria\'s Secret', 'Lane Bryant', 'Torrid', 'Men\'s Wearhouse', 'Jos. A. Bank',
  // Shoes
  'Foot Locker', 'Payless ShoeSource', 'DSW', 'Famous Footwear', 'Shoe Carnival', 'Rack Room Shoes'
];

export default function AddExpenseScreen({ onAddExpense }) {
  const [amount, setAmount] = useState('');
  const [storeInput, setStoreInput] = useState('');
  const [filteredStores, setFilteredStores] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleStoreChange = (text) => {
    setStoreInput(text);
    if (text.length > 0) {
      const filtered = STORES.filter(store =>
        store.toLowerCase().startsWith(text.toLowerCase())
      );
      setFilteredStores(filtered);
      setShowDropdown(true);
    } else {
      setFilteredStores([]);
      setShowDropdown(false);
    }
  };

  const handleSubmit = () => {
    const parsedAmount = parseFloat(amount);
    if (!amount || !storeInput) {
      Alert.alert('Error', 'Please enter both amount and store.');
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid positive amount.');
      return;
    }

    const expense = {
      id: Date.now().toString(),
      amount: parsedAmount,
      store: storeInput,
      date,
    };
    onAddExpense(expense);

    setAmount('');
    setStoreInput('');
    setDate(new Date());
    setShowDropdown(false);
  };

  return (
    <View style={styles.container}>

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
        placeholder="e.g. 23.50"
      />

      <Text style={styles.label}>Store</Text>
      <TextInput
        style={styles.input}
        value={storeInput}
        onChangeText={handleStoreChange}
        placeholder="Start typing store name"
        autoCorrect={false}
      />

      {showDropdown && filteredStores.length > 0 && (
        <ScrollView
          style={styles.dropdown}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
        >
          {filteredStores.map((storeName) => (
            <Text
              key={storeName}
              style={styles.dropdownItem}
              onPress={() => {
                setStoreInput(storeName);
                setShowDropdown(false);
              }}
            >
              {storeName}
            </Text>
          ))}
        </ScrollView>
      )}

      <View style={styles.dateButton}>
        <Button title="Pick Date" onPress={() => setShowDatePicker(true)} />
        <Text style={styles.dateText}>{date.toDateString()}</Text>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(e, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <View style={styles.addButton}>
        <Button title="Add Expense" onPress={handleSubmit} color="#4CAF50" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    backgroundColor: '#eae8e0',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 25,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    marginTop: 15,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
  },
  dropdown: {
    maxHeight: 140,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 10,
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    fontSize: 16,
    color: '#555',
  },
  dateButton: {
    marginTop: 15,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  addButton: {
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
