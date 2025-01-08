import { CustomText } from "@/CustomText";
import { useState, useEffect } from "react";
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
import CardTodo from "@/components/cards/CardTodo";
import { db, auth } from "@/firebase.config";
import {
  collection,
  query,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  where,
  Timestamp,
} from "firebase/firestore";

const { width } = Dimensions.get("screen");

interface Todo {
  id: string;
  text: string;
  isDone: boolean;
  createdAt: Timestamp;
  dueDate: string;
}

export default function CalendarPage() {
  const userId = auth.currentUser?.uid;
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [todos, setTodos] = useState<{ [key: string]: Todo[] }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split("T")[0];

  // Fetch todos from Firebase
  const fetchTodos = async () => {
    if (!userId) return;

    try {
      const todosRef = collection(db, "users", userId, "todos");
      const querySnapshot = await getDocs(todosRef);

      const todosByDate: { [key: string]: Todo[] } = {};

      querySnapshot.docs.forEach((doc) => {
        const todoData = doc.data();
        const dueDate =
          todoData.dueDate ||
          todoData.createdAt?.toDate().toISOString().split("T")[0];

        if (!todosByDate[dueDate]) {
          todosByDate[dueDate] = [];
        }

        todosByDate[dueDate].push({
          id: doc.id,
          text: todoData.text,
          isDone: todoData.isDone,
          createdAt: todoData.createdAt,
          dueDate: dueDate,
        });
      });

      setTodos(todosByDate);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [userId]);

  const handleDayPress = (day: DateData) => {
    setSelectedDay(day.dateString);
  };

  // Toggle todo completion
  const toggleTodo = async (todoId: string) => {
    if (!userId || !selectedDay) return;

    try {
      const todoRef = doc(db, "users", userId, "todos", todoId);
      const currentTodo = todos[selectedDay].find((todo) => todo.id === todoId);

      if (currentTodo) {
        await updateDoc(todoRef, {
          isDone: !currentTodo.isDone,
        });

        setTodos((prevTodos) => ({
          ...prevTodos,
          [selectedDay]: prevTodos[selectedDay].map((todo) =>
            todo.id === todoId ? { ...todo, isDone: !todo.isDone } : todo
          ),
        }));
      }
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  // Delete todo
  const deleteTodo = async (todoId: string) => {
    if (!userId || !selectedDay) return;

    try {
      const todoRef = doc(db, "users", userId, "todos", todoId);
      await deleteDoc(todoRef);

      setTodos((prevTodos) => ({
        ...prevTodos,
        [selectedDay]: prevTodos[selectedDay].filter(
          (todo) => todo.id !== todoId
        ),
      }));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const renderDayTodos = (dateString: string) => {
    const dayTodos = todos[dateString] || [];
    if (dayTodos.length === 0) return null;

    return (
      <View style={styles.dayTodoList}>
        {dayTodos.slice(0, 2).map((todo, index) => (
          <Text
            key={todo.id}
            style={[
              styles.dayTodoText,
              todo.isDone && styles.completedDayTodoText,
            ]}
            numberOfLines={1}
          >
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
            {selectedDay} Todos
          </CustomText>
          {todos[selectedDay]?.map((todo) => (
            <CardTodo
              key={todo.id}
              id={todo.id}
              text={todo.text}
              isCompleted={todo.isDone}
              variant="todo"
              onToggle={() => toggleTodo(todo.id)}
              onDelete={() => deleteTodo(todo.id)}
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

      {userId && (
        <AddTodoModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          userId={userId}
          selectedDate={selectedDay || today}
        />
      )}
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
    backgroundColor: "#1C3641",
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
    paddingBottom: 100,
  },
  selectedDayTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#264653",
    marginBottom: 10,
  },
  completedDayTodoText: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
});
