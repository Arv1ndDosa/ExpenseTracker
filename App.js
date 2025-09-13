//Added Dynamic Graphs
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import AddExpenseScreen from './components/AddExpenseScreen';
import { askAI } from './utils/askAi';
import { Button } from 'react-native';
import { ActivityIndicator } from 'react-native';



const Tab = createBottomTabNavigator();

const MyTheme = {
  ...DefaultTheme, 
  colors: {
    ...DefaultTheme.colors,
    background: '#CAEEC2', // sets background color for navigation container
    card: '#CAEEC2',       // sets top tab bar color
    border: '#eae8e0'
  }
};

function TrackerScreen({ expenses, setExpenses }) {
  const [period, setPeriod] = useState('Monthly');
  const [budget, setBudget] = useState('');

  const handleAddExpense = (expense) => {
    setExpenses([...expenses, expense]);
  };

  const filteredExpenses = expenses.filter((expense) => {
    const now = new Date();
    const eDate = new Date(expense.date);
    if (period === 'Weekly') {
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(now.getDate() - 7);
      return eDate >= oneWeekAgo;
    } else if (period === 'Monthly') {
      return (
        eDate.getMonth() === now.getMonth() &&
        eDate.getFullYear() === now.getFullYear()
      );
    } else if (period === 'Yearly') {
      return eDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  const totalSpent = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget !== '' ? (parseFloat(budget) - totalSpent).toFixed(2) : null;

  useEffect(() => {
    if (budget !== '' && totalSpent > parseFloat(budget)) {
      Alert.alert(
        'Budget Limit Reached',
        `You've exceeded your ${period.toLowerCase()} budget of $${budget}.`
      );
    }
  }, [budget, totalSpent, period]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.curvedContainer}>
        <Text style={styles.sectionTitle}>Tracking Period</Text>
        <Picker
          selectedValue={period}
          onValueChange={(value) => setPeriod(value)}
          style={styles.picker}
        >
          <Picker.Item label="Weekly" value="Weekly" />
          <Picker.Item label="Monthly" value="Monthly" />
          <Picker.Item label="Yearly" value="Yearly" />
        </Picker>

        <AddExpenseScreen onAddExpense={handleAddExpense} />

        <Text style={styles.sectionTitle}>Set Budget for {period}:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={budget}
          onChangeText={setBudget}
          placeholder="e.g. 200"
        />

        {remaining !== null && (
          <Text style={styles.remaining}>Remaining: ${remaining}</Text>
        )}

        <Text style={styles.sectionTitle}>Saved Expenses:</Text>
        {filteredExpenses.map((e) => (
          <Text key={e.id} style={styles.expenseItem}>
            {new Date(e.date).toDateString()} - ${e.amount.toFixed(2)} @ {e.store}
          </Text>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function GraphsScreen({ expenses }) {
  const [period, setPeriod] = useState('Weekly');
  const now = new Date();
  const groupedExpenses = period === 'Monthly'
    ? Array(31).fill(0)
    : period === 'Yearly'
    ? Array(12).fill(0)
    : Array(7).fill(0);

  expenses.forEach((expense) => {
    const date = new Date(expense.date);
    if (period === 'Weekly') {
      const day = date.getDay();
      groupedExpenses[day] += expense.amount;
    } else if (period === 'Monthly') {
      const day = date.getDate();
      const weekIndex = Math.min(Math.floor((day - 1) / 7), 3); // 0–3 for 4 weeks
      groupedExpenses[weekIndex] += expense.amount;
    } else if (period === 'Yearly') {
      const month = date.getMonth();
      groupedExpenses[month] += expense.amount;
    }
  });

  const labels =
    period === 'Weekly'
      ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      : period === 'Monthly'
      ? ['Week 1', 'Week 2', 'Week 3', 'Week 4']
      : [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        ];

  const screenWidth = Dimensions.get('window').width - 30;

  return (
    <ScrollView contentContainerStyle={styles.curvedContainer}>
      <Text style={styles.sectionTitle}>Graph View</Text>
      <Picker
        selectedValue={period}
        onValueChange={(value) => setPeriod(value)}
        style={styles.picker}
      >
        <Picker.Item label="Weekly" value="Weekly" />
        <Picker.Item label="Monthly" value="Monthly" />
        <Picker.Item label="Yearly" value="Yearly" />
      </Picker>

      <LineChart
        data={{
          labels: labels,
          datasets: [{ data: groupedExpenses.slice(0, labels.length) }],
        }}
        width={screenWidth}
        height={220}
        yAxisLabel="$"
        chartConfig={{
          backgroundColor: '#fadadd',
          backgroundGradientFrom: '#f7f7f7',
          backgroundGradientTo: '#fadadd',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: { borderRadius: 16 },
        }}
        bezier
        style={{ marginVertical: 10, borderRadius: 10 }}
      />
    </ScrollView>
  );
}

 function InsightsScreen({ expenses }) {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const highest = expenses.reduce((max, e) => (e.amount > max ? e.amount : max), 0);
    const average = expenses.length ? (total / expenses.length).toFixed(2) : 0;

    return (
      <ScrollView contentContainerStyle={styles.curvedContainer}>
        <Text style={styles.sectionTitle}>Insights</Text>
        <Text style={styles.expenseItem}>Total Spent: ${total.toFixed(2)}</Text>
        <Text style={styles.expenseItem}>Average Expense: ${average}</Text>
        <Text style={styles.expenseItem}>Highest Expense: ${highest.toFixed(2)}</Text>
      </ScrollView>
    );
  }

  function AISuggestionsScreen() {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAskAI = async () => {
      if (!prompt) return;
      setLoading(true);
      try {
        const answer = await askAI(prompt);
        setResponse(answer);
      } catch (err) {
        setResponse('Error: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <ScrollView contentContainerStyle={styles.curvedContainer}>
        <Text style={styles.sectionTitle}>Ask AI a Question</Text>

        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: 'top', marginBottom: 10 }]}
          placeholder="e.g. Where can I save more money this week?"
          value={prompt}
          onChangeText={setPrompt}
          multiline
        />

        <Button title="Ask AI" onPress={handleAskAI} disabled={loading || !prompt.trim()} />

        {loading ? (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        ) : (
          <Text style={[styles.expenseItem, { marginTop: 20 }]}>
            {response || 'Response will appear here.'}
          </Text>
        )}
      </ScrollView>
    );
  }


export default function App() {
  const [expenses, setExpenses] = useState([]);

  return (
    <NavigationContainer theme={MyTheme}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: '#CAEEC2' },   //Bottom Tab Color Style
          tabBarActiveTintColor: 'black',
        }}
      >
        <Tab.Screen name="Expense Tracker">
          {() => <TrackerScreen expenses={expenses} setExpenses={setExpenses} />}
        </Tab.Screen>
        <Tab.Screen name="Graphs">
          {() => <GraphsScreen expenses={expenses} />}
        </Tab.Screen>
        <Tab.Screen name="Insights">
          {() => <InsightsScreen expenses={expenses} />}
        </Tab.Screen>
        <Tab.Screen name="AI Suggestions" component={AISuggestionsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#CAEEC2',
  },
  curvedContainer: {
    backgroundColor: '#eae8e0',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingBottom: 40,
    marginTop: 10,
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
    color: 'eae8e0',
  },
  picker: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  remaining: {
    marginTop: 10,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  expenseItem: {
    marginVertical: 4,
    fontSize: 16,
    color: '#eae8e0',
  },
  centeredTab: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#eae8e0',
  },
});
