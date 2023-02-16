import * as SQLite from "expo-sqlite";
import { useEffect, useState } from "react";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";

const DbList = () => {
  const db = SQLite.openDatabase("guessCityDB.db");
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState([]);
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

  const deleteAll = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM cities ",
        setCities([]),
        console.log("deleted data"),
        (txObj, error) => console.log(error)
      );
    });
  };
  const getCity = () => {
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

  const showCities = () => {
    return cities.map((city, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={{ color: "#fff" }}>{city.city}</Text>
          <Button title="Delete" onPress={() => deleteCity(city.id)} />
        </View>
      );
    });
  };
  return (
    <View style={styles.container}>
      <Button title="Refresh Cities Data" onPress={getCity} />
      <Button title="Delete All Cities" onPress={deleteAll} />
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
