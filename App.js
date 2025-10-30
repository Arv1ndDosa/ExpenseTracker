//cd "%USERPROFILE%\Documents\ExpenseTracker"
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import AddExpenseScreen from './components/AddExpenseScreen';
import { Button } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { askAI } from './utils/askAi';
import { TouchableOpacity } from 'react-native';


const Tab = createBottomTabNavigator();

const MyTheme = Object.assign({}, DefaultTheme, {
  colors: Object.assign({}, DefaultTheme.colors, {
    background: '#CAEEC2',
    card: '#CAEEC2',
    border: '#fffffeff'
  })
});

function TrackerScreen({ expenses, setExpenses }) {
  const [timeAmount, setTimeAmount] = useState('Monthly');
  const [budgets, setBudgets] = useState({ Weekly: '', Monthly: '', Yearly: '' });

  const handleAddExpense = (expense) => {
    const newExpense = { ...expense, id: Date.now().toString() };
    setExpenses([...expenses, newExpense]);
  };

  const filteredExpenses = expenses.filter(function (expense){
    const now = new Date();
    const eDate = new Date(expense.date);
    if (timeAmount === 'Weekly') {
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(now.getDate() - 7);
      return eDate >= oneWeekAgo;
    } else if (timeAmount === 'Monthly') {
      return (
        eDate.getMonth() === now.getMonth() && eDate.getFullYear() === now.getFullYear()
      );
    } else if (timeAmount === 'Yearly') {
      return eDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  const firstVal = 0;
  const totalSpent = filteredExpenses.reduce(function(sum, e){
    return sum + e.amount;
  }, firstVal);

  const budget = budgets[timeAmount];
  let remaining = null;
  if (budget !== '') {
    remaining = (Number(budget) - totalSpent).toFixed(2);
  }



  useEffect(function(){
    if (budget !== '' && totalSpent > parseFloat(budget)) {
      Alert.alert('Budget Exceeded', "You've exceeded your " + timeAmount.Amount.toLowerCase() + "budget of $" + budget + ".");
    }
  }, [budget, totalSpent, timeAmount]);

    return (
    <View style={{ flex: 1, backgroundColor: '#CAEEC2' }}>
      <ScrollView contentContainerStyle={styles.curvedContainer}>
        <Text style={styles.sectionTitle}>Tracking Period</Text>
        <Picker
          selectedValue={timeAmount}
          onValueChange={(value) => setTimeAmount(value)}
          style={styles.picker}
        >
          <Picker.Item label="Weekly" value="Weekly" />
          <Picker.Item label="Monthly" value="Monthly" />
          <Picker.Item label="Yearly" value="Yearly" />
        </Picker>

        <AddExpenseScreen onAddExpense={handleAddExpense} />

        <Text style={styles.sectionTitle}>Set Budget for {timeAmount}:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={budget[timeAmount]}
          onChangeText={(val) => setBudgets({ ...budgets, [timeAmount]: val })}
          placeholder="e.g. 200"
        />
        {remaining !== null && (<Text style={styles.remaining}>Remaining: ${remaining}</Text>)}
      </ScrollView>
    </View>
  );
}

function GraphsScreen({ expenses }) {
  const [timeAmount, setTimeAmount] = useState('Weekly');
  const now = new Date();
  let combinedExpenses;
  if (timeAmount === 'Monthly') {
    combinedExpenses = Array(31).fill(0);
  } else if (timeAmount === 'Yearly') {
    combinedExpenses = Array(12).fill(0);
  } else {
    combinedExpenses = Array(7).fill(0);
  }

  expenses.forEach(function(expense){
    const date = new Date(expense.date);
    if (timeAmount === 'Weekly') {
      const day = date.getDay();
      combinedExpenses[day] += expense.amount;
    } else if (timeAmount === 'Monthly') {
      const day = date.getDate();
      const weekIndex = Math.min(Math.floor((day - 1) / 7), 3);
      combinedExpenses[weekIndex] += expense.amount;
    } else if (timeAmount === 'Yearly') {
      const month = date.getMonth();
      combinedExpenses[month] += expense.amount;
    }
  });

  let labels = [];
  if (timeAmount === 'Weekly') {
    labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  } else if (timeAmount === 'Monthly') {
    labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  } else {
    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  }


  const screenWidth = Dimensions.get('window').width - 30;

    return (
    <ScrollView contentContainerStyle={styles.curvedContainer}>
      <Text style={styles.sectionTitle}>Graph View</Text>
      <Picker
        selectedValue={timeAmount}
        onValueChange={(value) => setTimeAmount(value)}
        style={styles.picker}
      >
        <Picker.Item label="Weekly" value="Weekly" />
        <Picker.Item label="Monthly" value="Monthly" />
        <Picker.Item label="Yearly" value="Yearly" />
      </Picker>

      <LineChart
        data={{
          labels: labels,
          datasets: [{ data: combinedExpenses.slice(0, labels.length) }],
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

function InsightsScreen({ expenses, setExpenses }) {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  let total = 0;
  let highest = 0;
  expenses.forEach(function(e) {
    total += e.amount;
    if (e.amount > highest) highest = e.amount;
  });
  const average = expenses.length ? (total / expenses.length).toFixed(2) : 0;


  function addTodo() {
    if (!newTodo.trim()) return;
    const newTodos = todos.concat({ id: Date.now().toString(), text: newTodo });
    setTodos(newTodos);
    setNewTodo('');
  }

  function removeTodo(id) {
    const filtered = todos.filter(function (t) {
      return t.id !== id;
    });
    setTodos(filtered);
  }

  function removeExpense(id) {
    const filtered = expenses.filter(function (e) {
      return e.id !== id;
    });
    setExpenses(filtered);
  }

  return (
    <ScrollView contentContainerStyle={styles.curvedContainer}>
      <View style={styles.card}>
        <Text style={styles.metric}>🏦Total Spent: ${total.toFixed(2)}</Text>
        <Text style={styles.metric}>💳Average Expense: ${average}</Text>
        <Text style={styles.metric}>💴Highest Expense: ${highest.toFixed(2)}</Text>
      </View>
      <Text style={styles.sectionTitle}>To-Do Checklist</Text>
      <View style={styles.todoInputRow}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 10 }]}
          placeholder="Add a new task..."
          value={newTodo}
          onChangeText={setNewTodo}
        />
        <Button title="Add" onPress={addTodo} />
      </View>

      {todos.length === 0 ? <Text style={styles.emptyText}>No tasks yet</Text> : null}
      {todos.map(function (t){
        return (
          <View key={t.id} style={styles.todoCard}>
            <Text style={styles.todoText}>{t.text}</Text>
            <TouchableOpacity onPress={function () { removeTodo(t.id); }} style={styles.removeButton}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        );
      })}

      <Text style={[styles.sectionTitle, { marginTop: 25 }]}>Saved Expenses</Text>
      {expenses.length === 0 ? <Text style={styles.emptyText}>No expenses saved yet</Text> : null}
      {expenses.map(function (e) {
        return (
          <View key={e.id} style={styles.expenseCard}>
            <Text style={styles.expenseText}>{new Date(e.date).toDateString()} - ${e.amount.toFixed(2)} @ {e.store}</Text>
            <TouchableOpacity onPress={function () { removeExpense(e.id); }} style={styles.removeButton}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
}

function AISuggestionsScreen() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleAskAI() {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const answer = await askAI(prompt);
      setResponse(answer);
    } catch (error) {
      setResponse('Error: ' + (error.message || 'Something went wrong'));
    } finally {
      setLoading(false);
    }
  }
  return (
    <ScrollView contentContainerStyle={styles.curvedContainer}>
      <Text style={[styles.sectionTitle, { color: '#34495e' }]}>Ask AI a Question</Text>
      <TextInput
        style={[
          styles.input,
          { height: 100, textAlignVertical: 'top', marginBottom: 10, backgroundColor: '#fff' }
        ]}
        placeholder="e.g. Where can I save more money this week?"
        value={prompt}
        onChangeText={function (text) { setPrompt(text); }}
        multiline={true}
      />
      <Button title={loading ? "Thinking..." : "Ask AI"} onPress={handleAskAI} disabled={loading} />
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <Text style={[styles.expenseText, { marginTop: 20, color: '#2c3e50' }]}>
          {response || 'Here are your responses:'}
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
          tabBarStyle: { backgroundColor: '#CAEEC2' },
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
          {() => <InsightsScreen expenses={expenses} setExpenses={setExpenses} />}
        </Tab.Screen>
        <Tab.Screen name="AI Suggestions" component={AISuggestionsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#eae8e0',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 15,
    color: '#2c3e50',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    borderColor: '#dcdcdc',
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#34495e',
    marginTop: 15,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  metric: {
    fontSize: 16,
    color: '#2d3436',
    marginBottom: 5,
  },
  todoInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todoCard: {
    backgroundColor: '#eaf6ff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  todoText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  expenseCard: {
    backgroundColor: '#fff7e6',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  expenseText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  removeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#ff7675',
    borderRadius: 8,
  },
  removeText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  output: {
    marginTop: 15,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    color: '#2d3436',
    fontSize: 16,
  },
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
