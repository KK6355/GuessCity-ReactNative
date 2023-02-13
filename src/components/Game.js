import { View, Text, StyleSheet, Pressable } from "react-native";
import { useState } from "react";
import { quizData } from "../../assets/data";
import SelectDropdown from "react-native-select-dropdown";

function Game() {
  const [selectedCity, setSelectedCity] = useState("");
  const [getCountryDate, setCountryData] = useState("");
  const [getCityData, setCityData] = useState("");

  const sortedData = [...quizData].sort();
  const coutryCount = sortedData.length;
  const cityData = sortedData.map((obj) => obj.Capital);

  let randomDataObj = {
    key: 1,
    Country: "Afghanistan",
    Capital: "Kabul",
    Currency: "Afghani",
  };

  function getCountryHandler() {
    // console.log(cityData);
    const countryIndex = Math.floor(Math.random() * (coutryCount + 1));
    randomDataObj = sortedData[countryIndex];
    setCountryData(randomDataObj.Country);
    setCityData(randomDataObj.Capital);
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={getCountryHandler}>
        <Text>Get A Random Country</Text>
      </Pressable>
      <View>
        <Text>{getCountryDate}</Text>
        <Text>{getCityData}</Text>
        <Text>{selectedCity}</Text>
      </View>
      <View style={styles.selectList}>
        <SelectDropdown
          data={cityData}
          onSelect={(selectedItem, index) => {
            console.log(selectedItem, index);
            setSelectedCity(selectedItem);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  selectList: {
    color: "black",
  },
});

export default Game;
