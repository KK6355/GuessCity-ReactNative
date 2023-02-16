import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Alert,
  Modal,
} from "react-native";
import { useState, useEffect } from "react";
import { quizData } from "../../assets/data";
import SelectDropdown from "react-native-select-dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck, faGlobe } from "@fortawesome/free-solid-svg-icons";
import * as SQLite from "expo-sqlite";

function Game() {
  const [selectedCity, setSelectedCity] = useState("");
  const [getCountryDate, setCountryData] = useState("");
  const [getCityData, setCityData] = useState("");
  const [getResult, setResult] = useState("");
  const [getScore, setScore] = useState(0);
  const [getWrongList, setWorngList] = useState([]);
  const [getCorrectList, setCorrectList] = useState([]);

  const [wrongModalVisible, setWrongModalVisible] = useState(false);
  const [correctModalVisible, setCorrectModalVisible] = useState(false);

  const sortedData = [...quizData].sort();
  const coutryCount = sortedData.length;
  const cityData = sortedData.map((obj) => obj.Capital);
  const sortedCityData = [...cityData].sort();
  // database
  const db = SQLite.openDatabase("guessCityDB.db");
  const [cities, setCities] = useState([]);

  let randomDataObj = {
    key: 1,
    Country: "Afghanistan",
    Capital: "Kabul",
    Currency: "Afghani",
  };

  function getCountryHandler() {
    // console.log(cityData);
    const countryIndex = Math.floor(Math.random() * coutryCount);
    randomDataObj = sortedData[countryIndex];
    setCountryData(randomDataObj.Country);
    setCityData(randomDataObj.Capital);
  }

  useEffect(() => {
    setSelectedCity("");
    setResult("");
  }, [getCountryDate]);

  function onSelectHandler(selectedItem, index) {
    // console.log(selectedItem, index);
    setSelectedCity(selectedItem);
    if (selectedItem == getCityData) {
      setResult("Correct");
      setScore((score) => score + 1);
      setCorrectList((currentList) => [
        ...currentList,
        // selectedItem,
        { text: selectedItem, id: Math.random().toString() },
      ]);
      setCorrectModalVisible(true);
    } else {
      setResult("Wrong");
      setWorngList((currentList) => [
        ...currentList,
        // selectedItem,
        { text: selectedItem, id: Math.random().toString() },
      ]);
      setWrongModalVisible(true);

      // AddData(selectedItem);
    }
  }
  useEffect(() => {
    db.transaction((tx) => {
      if (selectedCity) {
        tx.executeSql(
          "INSERT INTO cities (city) values (?)",
          [selectedCity],
          (txObj, resultSet) => {
            let existingCities = [...cities];
            existingCities.push({ id: resultSet.insertId, city: selectedCity });
            setCities(existingCities);
          },
          console.log("added data"),
          (txObj, error) => console.log(error)
        );
      } else {
        console.log("null value can not be added into database");
      }
    });
    console.log(`city added to db: ${selectedCity}`);
  }, [getWrongList]);
  return (
    <View style={styles.container}>
      <View style={styles.questionContainer}>
        <Pressable onPress={getCountryHandler} style={styles.getCountryPress}>
          <Text style={{ fontSize: 20, color: "#fff" }}>
            Get A Random Country
          </Text>
        </Pressable>
        <View style={styles.country}>
          <Text style={{ fontSize: 30, color: "#fff" }}>
            <FontAwesomeIcon icon={faGlobe} color={"#FFB703"} size={30} />
            &nbsp;{getCountryDate}
          </Text>
          {/* <Text>{getCityData}</Text> */}
        </View>
      </View>

      {getCountryDate && (
        <View style={styles.selectContainer}>
          <View>
            <Text style={{ fontSize: 16, color: "#fff", textAlign: "center" }}>
              Select the capital city
            </Text>
          </View>
          <View style={styles.dropdown}>
            <SelectDropdown data={sortedCityData} onSelect={onSelectHandler} />
          </View>
        </View>
      )}
      {getCountryDate && (
        <View style={styles.resultContainer}>
          {/* <View>
            <Text>{getResult}</Text>
          </View> */}
          <View>
            <Text style={{ fontSize: 25, color: "#fff" }}>
              Your score: {getScore}
            </Text>
          </View>
        </View>
      )}
      {getCountryDate && (
        <View style={styles.listContainer}>
          <View style={styles.correctListContainer}>
            <View>
              <Text style={{ fontSize: 16, color: "#fff" }}>Correct List</Text>
            </View>
            <View>
              <FlatList
                data={getCorrectList}
                renderItem={(itemDate) => (
                  <View>
                    <Text style={{ fontSize: 16, color: "#8ECAE6" }}>
                      {itemDate.item.text}
                    </Text>
                  </View>
                )}
                keyExtractor={(item) => item.id}
              />
            </View>
          </View>
          <View style={styles.wrongListContainer}>
            <View>
              <Text style={{ fontSize: 16, color: "#fff" }}>Wrong List</Text>
            </View>
            <View>
              <FlatList
                data={getWrongList}
                renderItem={(itemDate) => (
                  <View>
                    <Text style={{ fontSize: 16, color: "#FB8500" }}>
                      {itemDate.item.text}
                    </Text>
                  </View>
                )}
                keyExtractor={(item) => item.id}
              />
            </View>
          </View>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={wrongModalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setWrongModalVisible(!wrongModalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={{ margin: 10 }}>
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    color={"red"}
                    size={30}
                  />
                </View>
                <Text style={styles.modalText}>Your answer is Wrong!</Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setWrongModalVisible(!wrongModalVisible)}
                >
                  <Text style={styles.textStyle}>Try Again</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={correctModalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setCorrectModalVisible(!correctModalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={{ margin: 10 }}>
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    color={"green"}
                    size={30}
                  />
                </View>
                <Text style={styles.modalText}>
                  Well Done!Your answer is Correct!
                </Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setCorrectModalVisible(!correctModalVisible)}
                >
                  <Text style={styles.textStyle}>Continue</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#023047",
  },
  questionContainer: {
    flex: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  selectContainer: {
    flex: 2,
    margin: 20,
  },
  resultContainer: {
    flex: 1,
    backgroundColor: "#FFB703",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    width: 300,
    paddingTop: 10,
    paddingBottom: 10,
    borderColor: "#fff",
    borderRadius: 10,
  },
  listContainer: { flex: 4, flexDirection: "row", margin: 10, width: 300 },
  correctListContainer: { flex: 1, margin: 20 },
  wrongListContainer: { flex: 1, margin: 20 },
  getCountryPress: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#219EBC",
    marginTop: 30,
    width: 300,
    paddingTop: 15,
    paddingBottom: 15,
    borderColor: "#fff",
    borderRadius: 10,
  },
  country: {
    flex: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    margin: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },

  buttonClose: {
    backgroundColor: "#219EBC",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default Game;
