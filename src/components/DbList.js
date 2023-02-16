import * as SQLite from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";

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
          <Text style={styles.cityListText}>{city.city}</Text>
          <Pressable
            onPress={() => deleteCity(city.id)}
            style={styles.deleteOnePre}
          >
            <Text style={{ color: "#fff", fontSize: 16 }}>Delete</Text>
          </Pressable>
        </View>
      );
    });
  };
  return (
    <View style={styles.container}>
      <Pressable onPress={getCity} style={styles.refreshPre}>
        <Text style={{ color: "#fff", fontSize: 25 }}>Refresh Cities Data</Text>
      </Pressable>
      <Pressable onPress={deleteAll} style={styles.deletePre}>
        <Text style={{ color: "#fff", fontSize: 25 }}>Delete All Cities</Text>
      </Pressable>
      {showCities()}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#023047",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    margin: 8,
  },
  refreshPre: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#219EBC",
    paddingTop: 10,
    paddingBottom: 10,
    borderColor: "#fff",
    borderRadius: 10,
    margin: 20,
    width: 300,
  },
  deletePre: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#FB8500",
    paddingTop: 10,
    paddingBottom: 10,
    borderColor: "#fff",
    borderRadius: 10,
    margin: 20,
    width: 300,
  },
  deleteOnePre: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#FFB703",
    paddingTop: 5,
    paddingBottom: 5,
    borderColor: "#fff",
    borderRadius: 10,
    width: 100,
  },
  cityListText: {
    color: "#fff",
    padding: 5,
    margin: 5,
    textAlign: "left",
  },
});

export default DbList;
