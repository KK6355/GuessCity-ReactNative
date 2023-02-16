import * as SQLite from "expo-sqlite";
import { useEffect, useState } from "react";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";

const DbList = () => {
  const db = SQLite.openDatabase("guessCityDB.db");
  const [isLoading, setIsLoading] = useState(true);
  const [cities, setCities] = useState([]);
  const [currentCity, setCurrentCity] = useState(undefined);
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS cities (id INTEGER PRIMARY KEY AUTOINCREMENT, city TEXT)",
        console.log("created table")
      );
    });
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM cities",
        null,
        (txObj, resultSet) => setCities(resultSet.rows._array),
        console.log("fetch table")
      ),
        (txObj, error) => console.error(error);
    });
    setIsLoading(false);
  }, []);
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  const showCities = () => {
    return cities.map((city, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={{ color: "#fff" }}>{city.city}</Text>
          <Button title="Delete" onPress={() => deleteCity(city.id)} />
          <Button title="Update" onPress={() => updateCity(city.id)} />
        </View>
      );
    });
  };
  const addCity = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO cities (city) values (?)",
        [currentCity],
        (txObj, resultSet) => {
          let existingCities = [...cities];
          existingCities.push({ id: resultSet.insertId, city: currentCity });
          setCities(existingCities);
          setCurrentCity(undefined);
        },
        console.log("added data"),
        (txObj, error) => console.log(error)
      );
    });
  };
  const deleteCity = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM cities WHERE id=?",
        [id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let existingCities = [...cities].filter((city) => city.id !== id);
            setCities(existingCities);
          }
        },
        console.log("deleted data"),
        (txObj, error) => console.log(error)
      );
    });
  };
  const updateCity = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE cities SET city=? WHERE id=?",
        [currentCity, id],
        (txObj, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            let existingCities = [...cities];
            const indexToUpdate = existingCities.findIndex(
              (city) => city.id == id
            );
            existingCities[indexToUpdate].city = currentCity;
            setCities(existingCities);
            setCurrentCity(undefined);
          }
        },
        console.log("updated data"),
        (txObj, error) => console.log(error)
      );
    });
  };
  return (
    <View style={styles.container}>
      <Text>Type city</Text>
      <TextInput
        value={currentCity}
        placeholder="city"
        onChangeText={setCurrentCity}
        style={{ borderColor: "#fff", color: "#fff" }}
      />
      <Button title="Add City" onPress={addCity} />
      {showCities()}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#023047",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    margin: 8,
  },
});

export default DbList;
