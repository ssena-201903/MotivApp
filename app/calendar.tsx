import { CustomText } from "@/CustomText";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import AddTodoModal from "@/components/modals/AddTodoModal";
import { Ionicons } from "@expo/vector-icons";
import CardTodo from "@/components/cards/CardTodo";

const { width } = Dimensions.get("screen");

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export default function CalendarPage() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [todos, setTodos] = useState<{ [key: string]: Todo[] }>({
    "2025-01-10": [
      { id: "1", text: "Alışveriş yap", completed: false },
      { id: "2", text: "Köpeği gezdir", completed: true },
    ],
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [todoText, setTodoText] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handleDayPress = (day: DateData) => {
    setSelectedDay(day.dateString);
  };

  const addTodo = (text: string) => {
    const targetDay = selectedDay || today;
    if (text.trim()) {
      const newTodoItem = {
        id: Date.now().toString(),
        text: text.trim(),
        completed: false,
      };

      setTodos((prevTodos) => ({
        ...prevTodos,
        [targetDay]: [...(prevTodos[targetDay] || []), newTodoItem],
      }));
      setModalVisible(false);
    }
  };

  const toggleTodo = (todoId: string) => {
    if (selectedDay) {
      setTodos((prevTodos) => ({
        ...prevTodos,
        [selectedDay]: prevTodos[selectedDay].map((todo) =>
          todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
        ),
      }));
    }
  };

  const deleteTodo = (todoId: string) => {
    if (selectedDay) {
      setTodos((prevTodos) => ({
        ...prevTodos,
        [selectedDay]: prevTodos[selectedDay].filter(
          (todo) => todo.id !== todoId
        ),
      }));
    }
  };

  const renderDayTodos = (dateString: string) => {
    const dayTodos = todos[dateString] || [];
    if (dayTodos.length === 0) return null;

    return (
      <View style={styles.dayTodoList}>
        {dayTodos.slice(0, 2).map((todo, index) => (
          <Text key={todo.id} style={styles.dayTodoText} numberOfLines={1}>
            • {todo.text}
          </Text>
        ))}
        {dayTodos.length > 2 && (
          <Text style={styles.moreTodosText}>+{dayTodos.length - 2} more</Text>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          [selectedDay || ""]: { selected: true, selectedColor: "#FFA38F" },
          [today]: { selected: true, selectedColor: "#E5EEFF" },
        }}
        theme={{
          todayTextColor: "#264653",
          selectedDayBackgroundColor: "#FFA38F",
          selectedDayTextColor: "#264653",
          arrowColor: "#FFA38F",
        }}
        dayComponent={({ date, state }) => {
          const isSelected = date.dateString === selectedDay;
          const isToday = date.dateString === today;

          return (
            <TouchableOpacity
              style={[
                styles.dayContainer,
                isSelected && styles.selectedDayContainer,
                isToday && styles.todayContainer,
              ]}
              onPress={() => handleDayPress(date)}
            >
              <CustomText
                style={[
                  styles.dayText,
                  isSelected && styles.selectedDayText,
                  isToday && styles.todayText,
                ]}
              >
                {date.day}
              </CustomText>
              {renderDayTodos(date.dateString)}
            </TouchableOpacity>
          );
        }}
      />

      {selectedDay && todos[selectedDay]?.length > 0 && (
        <View style={styles.selectedDayTodos}>
          <CustomText style={styles.selectedDayTitle}>
            {selectedDay} Görevleri
          </CustomText>
          {todos[selectedDay]?.map((todo) => (
            <CardTodo
              key={todo.id}
              id={todo.id}
              text={todo.text}
              isCompleted={todo.completed}
              variant="todo"
              onToggle={(id) => toggleTodo(id)}
              onDelete={(id) => deleteTodo(id)}
            />
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <CustomText style={styles.addButtonText}>+</CustomText>
      </TouchableOpacity>

      <AddTodoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={addTodo}
        selectedDate={selectedDay || today}
        todoText={todoText}
        onTodoTextChange={setTodoText}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  dayContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    borderWidth: 1,
    borderColor: "#E5EEFF",
    padding: 5,
    borderRadius: 4,
    width: width / 7 - 4,
    height: 80,
    backgroundColor: "#fff",
  },
  selectedDayContainer: {
    backgroundColor: "#FFA38F",
  },
  todayContainer: {
    backgroundColor: "#E5EEFF",
    borderColor: "#264653",
  },
  dayText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#264653",
  },
  selectedDayText: {
    color: "#264653",
  },
  todayText: {
    color: "#264653",
  },
  dayTodoList: {
    width: "100%",
    paddingHorizontal: 2,
  },
  dayTodoText: {
    fontSize: 10,
    color: "#264653",
    marginBottom: 2,
  },
  moreTodosText: {
    fontSize: 10,
    color: "#264653",
    fontStyle: "italic",
  },
  addButton: {
    position: "absolute",
    right: 30,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFA38F",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    fontSize: 32,
    color: "#F9F9F9",
    borderRadius: 2,
  },
  selectedDayTodos: {
    marginTop: 20,
    marginHorizontal: 20,
    paddingBottom: 100, // Artı butonuna alan bırakmak için
  },
  selectedDayTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#264653",
    marginBottom: 10,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5EEFF",
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FFA38F",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxInner: {
    width: 6,
    height: 6,
    borderRadius: 7,
    backgroundColor: "#FFA38F",
  },
  todoText: {
    flex: 1,
    fontSize: 16,
    color: "#264653",
  },
  completedTodoText: {
    textDecorationLine: "line-through",
    color: "#264653",
    opacity: 0.6,
  },
  deleteButton: {
    padding: 8,
  },
});
