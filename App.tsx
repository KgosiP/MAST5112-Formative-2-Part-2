import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, } from "react-native";
import { Picker } from "@react-native-picker/picker"; // expo install @react-native-picker/picker
import { v4 as uuidv4 } from "uuid"; 

//home screen//



type Course = "Starter" | "Main" | "Dessert" | "Side" | "Drink";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  course: Course;
  price: number;
}

const COURSES: Course[] = ["Starter", "Main", "Dessert", "Side", "Drink"];

const App: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [course, setCourse] = useState<Course>("Main");
  const [priceText, setPriceText] = useState<string>(""); 
  const [menu, setMenu] = useState<MenuItem[]>([]);

  function resetForm() {
    setName("");
    setDescription("");
    setCourse("Main");
    setPriceText("");
  }

  function addMenuItem() {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();
    const parsedPrice = parseFloat(priceText);

    if (!trimmedName) {
      Alert.alert("Validation", "Please enter a dish name.");
      return;
    }
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      Alert.alert("Validation", "Please enter a valid non-negative price.");
      return;
    }

    const newItem: MenuItem = {
      id: uuidv4 ? uuidv4() : Math.random().toString(36).slice(2), 
      name: trimmedName,
      description: trimmedDescription,
      course,
      price: parsedPrice,
    };

    setMenu((prev) => [newItem, ...prev]);
    resetForm();
  }

  function removeItem(id: string) {
    setMenu((prev) => prev.filter((i) => i.id !== id));
  }

  function clearMenu() {
    Alert.alert("Clear menu", "Are you sure you want to remove all menu items?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", style: "destructive", onPress: () => setMenu([]) },
    ]);
  }

  const total = menu.length;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>kiss the cheff</Text>
          <Text style={styles.subtitle}>Create and manage the menu</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Dish name</Text>
          <TextInput
            placeholder="e.g. Lemon Chicken"
            value={name}
            onChangeText={setName}
            style={styles.input}
            returnKeyType="done"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            placeholder="Short description"
            value={description}
            onChangeText={setDescription}
            style={[styles.input, styles.multiline]}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <Text style={styles.label}>Course</Text>
          <View style={styles.pickerWrap}>
            <Picker
              selectedValue={course}
              onValueChange={(value) => setCourse(value as Course)}
              style={styles.picker}
            >
              {COURSES.map((c) => (
                <Picker.Item label={c} value={c} key={c} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Price (R)</Text>
          <TextInput
            placeholder="e.g. 49.99"
            value={priceText}
            onChangeText={(t) => setPriceText(t)}
            style={styles.input}
            keyboardType="numeric"
          />

          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.addButton} onPress={addMenuItem}>
              <Text style={styles.addButtonText}>Add Dish</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.clearButton} onPress={clearMenu}>
              <Text style={styles.clearButtonText}>Clear Menu</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.menuHeader}>
          <Text style={styles.menuTitle}>Current Menu</Text>
          <Text style={styles.menuCount}>{total} item{total === 1 ? "" : "s"}</Text>
        </View>

        <FlatList
          data={menu}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No menu items yet. Add one above.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardLeft}>
                <Text style={styles.cardName}>{item.name}</Text>
                <Text style={styles.cardCourse}>{item.course} • R{item.price.toFixed(2)}</Text>
                {item.description ? (
                  <Text style={styles.cardDesc}>{item.description}</Text>
                ) : null}
              </View>

              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() =>
                  Alert.alert("Remove item", `Remove "${item.name}"?`, [
                    { text: "Cancel", style: "cancel" },
                    { text: "Remove", style: "destructive", onPress: () => removeItem(item.id) },
                  ])
                }
              >
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

//styling//

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fafafa" },
  container: { flex: 1, padding: 16 },
  header: { marginBottom: 10 },
  title: { fontSize: 28, fontWeight: "700", color: "#1f2937" },
  subtitle: { fontSize: 13, color: "#6b7280", marginTop: 4 },

  form: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 12,
  },
  label: { fontSize: 13, color: "#374151", marginTop: 8, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 15,
    backgroundColor: "#fff",
  },
  multiline: { minHeight: 60 },

  pickerWrap: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: { height: 44 },

  buttonsRow: { flexDirection: "row", marginTop: 12, justifyContent: "space-between" },
  addButton: {
    flex: 1,
    backgroundColor: "#10b981",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
  },
  addButtonText: { color: "#fff", fontWeight: "600" },

  clearButton: {
    flex: 1,
    backgroundColor: "#ef4444",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 8,
  },
  clearButtonText: { color: "#fff", fontWeight: "600" },

  menuHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  menuTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  menuCount: { fontSize: 14, color: "#6b7280" },

  list: { paddingBottom: 60 },

  empty: { padding: 20, alignItems: "center" },
  emptyText: { color: "#6b7280" },

  card: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  cardLeft: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: "700", color: "#111827" },
  cardCourse: { fontSize: 13, color: "#6b7280", marginTop: 4 },
  cardDesc: { fontSize: 13, color: "#374151", marginTop: 6 },

  removeBtn: {
    marginLeft: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fee2e2",
    backgroundColor: "#fff5f5",
  },
  removeText: { color: "#b91c1c", fontWeight: "600", fontSize: 12 },
});

export default App;

