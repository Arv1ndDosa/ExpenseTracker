import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const STORES = [
  // Grocery/Supermarkets
  'Costco', 'Walmart', 'Target', 'Trader Joe\'s', 'Safeway', 'Whole Foods', 'Aldi', 'Kroger', 'Publix', 'H-E-B', 'Wegmans', 'Meijer', 'Food Lion', 'Giant Eagle', 'Harris Teeter', 'WinCo Foods', 'King Soopers', 'Ralphs', 'Vons', 'Albertsons', 'Stop & Shop', 'ShopRite', 'Acme Markets', 'Fred Meyer', 'Smith\'s', 'Fry\'s Food Stores', 'QFC', 'Jewel-Osco', 'Dominick\'s', 'Mariano\'s', 'Fresh Market', 'Piggly Wiggly', 'Winn-Dixie', 'BI-LO', 'Food 4 Less', 'Foods Co', 'Lucky', 'Pavilions', 'Star Market', 'Shaw\'s', 'Giant Food', 'Martin\'s', 'Price Chopper', 'Market Basket', 'Hannaford', 'IGA', 'Schnucks', 'Hy-Vee', 'Festival Foods', 'Woodman\'s Markets', 'Giant', 'Pathmark', 'PriceRite', 'Rouses', 'Central Market', 'New Seasons Market', 'Dean & DeLuca', 'Food City', 'Bashas\'', 'Hannaford Bros.', 'Brookshire\'s', 'SuperValu', 'Super 1 Foods', 'SuperFresh', 'Balducci\'s', 'H-E-B Plus', 'Giant Carlisle', 'Buehler\'s Fresh Foods', 'King Kullen', 'Wegmans Food Markets', 'Meijer Marketplace', 'Trader Joe\'s Neighborhood Market', 'Sprouts Farmers Market', 'Fresh Thyme Farmers Market',

  // Convenience/Gas Stations
  '7-Eleven', 'Circle K', 'Wawa', 'QuikTrip', 'Sheetz', 'RaceTrac', 'Casey\'s General Store', 'Speedway', 'Cumberland Farms', 'GetGo', 'Kwik Trip', 'Maverik', 'Murphy USA', 'Shell', 'BP', 'Exxon', 'Chevron', 'Marathon', 'Texaco', 'Valero', 'Sunoco', 'Pilot Flying J', 'Love\'s Travel Stop', 'Amoco', 'ARCO', 'Conoco', 'Gulf', 'Hess', 'Circle K Extra', 'Mobil', 'Citgo', 'Mapco', 'Thorntons', 'Kwik Fill', 'Co-op Food Stores', 'QuickChek', 'Casey\'s General Stores', 'Gas n Go',

  // Pharmacy/Health
  'CVS', 'Walgreens', 'Rite Aid', 'Duane Reade', 'H-E-B Pharmacy', 'Walmart Pharmacy', 'Target Pharmacy', 'Kroger Pharmacy', 'Safeway Pharmacy', 'Longs Drugs', 'Bartell Drugs', 'Medicap Pharmacy', 'Fred Meyer Pharmacy', 'Giant Pharmacy', 'Rite Aid Express', 'Omnicare', 'Walgreens Boots Alliance',

  // Dollar/Discount Stores
  'Dollar Tree', 'Dollar General', 'Family Dollar', '99 Cents Only', 'Five Below', 'Big Lots', 'Ollie\'s Bargain Outlet', 'Rainbow Shops', 'Cost Plus World Market', 'Dollarama', 'DGX', 'Deals', 'ThriftSmart', 'Value City', 'Rite Aid Dollar', 'Western Auto', 'MG Discount', 'Savers', 'Shopko', 'Tuesday Morning', 'Bargain Hunt',

  // Home Improvement/Hardware
  'Home Depot', 'Lowe\'s', 'Menards', 'Ace Hardware', 'True Value', 'Harbor Freight Tools', 'Builders FirstSource', 'Do it Best', 'Ferguson', 'Northern Tool + Equipment', 'Orchard Supply Hardware', 'HD Supply', 'Hoffman\'s', 'Fastenal', 'Homedepot Pro', 'Hardware Hank', 'Kelly-Moore Paints', 'Sherwin-Williams', 'Floor & Decor', 'US Lumber',

  // Department/Big Box Stores
  'Macy\'s', 'JCPenney', 'Kohl\'s', 'Nordstrom', 'Dillard\'s', 'Sears', 'Bloomingdale\'s', 'Nordstrom Rack', 'T.J. Maxx', 'Marshalls', 'Ross Dress for Less', 'Burlington', 'Big Lots', 'Bealls', 'Belk', 'Stage Stores', 'Neiman Marcus', 'Saks Fifth Avenue', 'Lord & Taylor', 'Gordmans', 'Stein Mart', 'Von Maur', 'Nordstrom Local', 'Bluefly', 'Bon-Ton', 'Filene\'s Basement', 'JCrew Factory',

  // Electronics
  'Best Buy', 'GameStop', 'RadioShack', 'Micro Center', 'Fry\'s Electronics', 'Newegg', 'B&H Photo', 'Apple Store', 'Microsoft Store', 'hhgregg', 'Frys.com', 'TigerDirect', 'Adorama', 'P.C. Richard & Son', 'Parrot Electronics', 'ABT Electronics', 'CompUSA', 'Brookstone', 'Vann\'s', 'PC Mall', 'Frys Marketplace',

  // Office/School Supplies
  'Staples', 'Office Depot', 'OfficeMax', 'The Container Store', 'Paper Source', 'Quill', 'WB Mason', 'School Specialty', 'Vistaprint', 'National Pen', 'Office Maxx', 'Office World', 'Office Max Express',

  // Pet Supplies
  'PetSmart', 'Petco', 'Tractor Supply Co.', 'Pet Supplies Plus', 'Pet Supermarket', 'Chuck & Don\'s', 'Petland', 'Pet Valu', 'PetSense', 'Petland Discounts', 'Petland USA', 'Pet Kingdom', 'Unleashed by Petco', 'Petlandia', 'Doggie Depot',

  // Specialty Food
  'Fresh Thyme', 'Sprouts Farmers Market', 'Natural Grocers', 'The Fresh Market', 'Earth Fare', 'Whole Foods 365', 'Central Market', 'New Seasons Market', 'Dean & DeLuca', 'Erewhon', 'Balducci\'s', 'Zabar\'s', 'Fairway Market', 'Citarella', 'Mariano\'s Gourmet Market', 'Kalustyan\'s', 'PCC Community Markets', 'Rainbow Grocery', 'Bristol Farms', 'Gelson\'s Market', 'New Leaf Community Markets',

  // Warehouse/Bulk
  'Sam\'s Club', 'BJ\'s Wholesale Club', 'Restaurant Depot', 'Costco Wholesale', 'Boxed', 'Smart & Final', 'Cash & Carry', 'UNFI', 'Gordon Food Service Store', 'Sysco', 'Piggly Wiggly Warehouse', 'US Foods', 'Amazon Fresh Bulk', 'Walmart Bulk', 'Target Bulk',

  // Auto Parts
  'AutoZone', 'O\'Reilly Auto Parts', 'Advance Auto Parts', 'NAPA Auto Parts', 'Pep Boys', 'Carquest', 'Meineke Car Care Center', 'Midas', 'Aamco', 'Firestone Complete Auto Care', 'Valvoline Instant Oil Change', 'Goodyear Auto Service', 'Tuffy Tire & Auto', 'Jiffy Lube', 'Monro Muffler Brake', 'Bumper to Bumper', 'Apex Automotive', 'Speedway Auto Parts', 'Express Oil Change & Tire Engineers',

  // Sporting Goods
  'Dick\'s Sporting Goods', 'Sports Authority', 'Big 5 Sporting Goods', 'Modell\'s', 'Academy Sports + Outdoors', 'Cabela\'s', 'Bass Pro Shops', 'REI', 'Gander Outdoors', 'Scheels', 'Eastern Mountain Sports', 'Planet Fitness', 'Gold\'s Gym Pro Shop', 'Play It Again Sports', 'Fitness Depot', 'Marshalls Sporting Goods', 'DSG Sports', 'Kmart Sporting Goods',

  // Craft/Hobby
  'Michaels', 'Hobby Lobby', 'Jo-Ann Fabrics', 'AC Moore', 'Blick Art Materials', 'Paper Source', 'HobbyTown USA', 'Craft Warehouse', 'Artist & Craftsman Supply', 'Consumer Crafts', 'Paper Mart', 'Dick Blick', 'Art Supply Warehouse', 'Creative Hands', 'Pearl Paint',

  // Books
  'Barnes & Noble', 'Books-A-Million', 'Half Price Books', 'Powell\'s Books', 'IndieBound', 'Hudson Booksellers', 'Tattered Cover', 'City Lights Books', 'The Strand', 'Bookmans', 'Kepler\'s Books', 'Left Bank Books', 'McNally Jackson', 'Shakespeare & Co.', 'Rizzoli Bookstore', 'Politics and Prose', 'Third Place Books', 'Books Inc.', 'Square Books', 'Pinecone Press',

  // Toys
  'Toys"R"Us', 'KB Toys', 'Learning Express', 'The LEGO Store', 'Disney Store', 'Build-A-Bear Workshop', 'FAO Schwarz', 'Hamleys', 'Toy Kingdom', 'The Entertainer', 'American Girl Store', 'Funko Pop Store', 'Melissa & Doug', 'Kohl\'s Toys', 'Target Toys', 'Walmart Toys', 'Smyths Toys', 'Toys \'R\' Us Express',

  // Furniture/Home
  'IKEA', 'Ashley HomeStore', 'Rooms To Go', 'West Elm', 'Pottery Barn', 'Crate & Barrel', 'Williams Sonoma', 'Bed Bath & Beyond', 'Container Store', 'World Market', 'Wayfair', 'La-Z-Boy', 'Cost Plus World Market', 'RH (Restoration Hardware)', 'Pier 1 Imports', 'Ethan Allen', 'Living Spaces', 'Havertys', 'Rooms & Rest', 'Article', 'Joybird', 'Raymour & Flanigan', 'HomeGoods', 'Furniture Row', 'Jordan\'s Furniture', 'Value City Furniture', 'American Signature',

  // Beauty/Cosmetics
  'Ulta Beauty', 'Sephora', 'Sally Beauty', 'Bluemercury', 'The Body Shop', 'Lush', 'MAC Cosmetics', 'BareMinerals', 'Clinique', 'Kiehl\'s', 'Bath & Body Works', 'Aveda', 'Smashbox', 'NYX', 'Benefit Cosmetics', 'Revlon', 'Estée Lauder', 'L\'Oréal', 'Maybelline', 'CoverGirl', 'NARS', 'Bobbi Brown', 'Fenty Beauty', 'ColourPop',

  // Clothing
  'Gap', 'Old Navy', 'Banana Republic', 'H&M', 'Forever 21', 'Zara', 'Uniqlo', 'American Eagle', 'Abercrombie & Fitch', 'Hollister', 'Express', 'Ann Taylor', 'Loft', 'Victoria\'s Secret', 'Lane Bryant', 'Torrid', 'Men\'s Wearhouse', 'Jos. A. Bank', 'Old Navy Outlet', 'Polo Ralph Lauren', 'Tommy Hilfiger', 'J.Crew', 'Aeropostale', 'Guess', 'Levi\'s Store', 'Dockers', 'Urban Outfitters', 'PacSun', 'Hot Topic', 'REI Co-op', 'Carhartt', 'Dickies', 'Prada', 'Gucci', 'Uniqlo U', 'Forever 21 Men', 'H&M Men', 'Zara Men', 'American Eagle Men', 'Abercrombie & Fitch Men',

  // Shoes
  'Foot Locker', 'Payless ShoeSource', 'DSW', 'Famous Footwear', 'Shoe Carnival', 'Rack Room Shoes', 'Finish Line', 'Journeys', 'Skechers', 'Clarks', 'Nike Store', 'Adidas Store', 'Puma Store', 'Reebok Store', 'Converse', 'New Balance Store', 'Timberland', 'Steve Madden', 'Vans Store', 'Under Armour', 'Dr. Martens', 'Hibbett Sports', 'Shoes.com', 'Kohl\'s Shoes', 'Target Shoes', 'Walmart Shoes'
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
