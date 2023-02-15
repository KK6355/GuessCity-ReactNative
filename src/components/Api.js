import React, { useEffect, useState } from "react";
import { quizData } from "../../assets/data";
import SelectDropdown from "react-native-select-dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCity,
  faGlobe,
  faMapLocationDot,
  faMapLocation,
  faPeopleGroup,
  faCloudSun,
  faTemperatureHalf,
  faWind,
  faDroplet,
} from "@fortawesome/free-solid-svg-icons";

import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  StyleSheet,
} from "react-native";

const Api = () => {
  //Api state
  const [isLoading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState([]);
  const [detailData, setDetailData] = useState([]);
  const [error, setError] = useState(null);
  //data state
  const [selectedCity, setSelectedCity] = useState("");
  const sortedData = [...quizData].sort();
  const cityData = sortedData.map((obj) => obj.Capital);
  const sortedCityData = [...cityData].sort();
  function onSelectHandler(selectedItem, index) {
    // console.log(selectedItem, index);
    setSelectedCity(selectedItem);
  }
  const cityDetailsOptions = {
    method: "GET",
    headers: {
      "X-Api-Key": "t208R2WEooRDPmjPg56tQg==Rx1jZeZO9VJ5dlFZ",
    },
  };
  const fetchCityWeatherHandler = async () => {
    setError(null);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=1c23761faefd899a888fecf187bdca7e`
      );
      if (!response.ok) {
        throw new Error("Select a city to see details and current weather!");
      }
      const data = await response.json();
      const formattedWeather = {
        weather: data.weather[0].description,
        temp: data.main.temp,
        humidity: data.main.humidity,
        wind: data.wind.speed,
      };
      setWeatherData(formattedWeather);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };
  const fetchCityDetailHandler = async () => {
    setError(null);
    try {
      const response = await fetch(
        `https://api.api-ninjas.com/v1/city?name=${selectedCity}`,
        cityDetailsOptions
      );
      if (!response.ok) {
        throw new Error("Select a city to see details and current weather!");
      }
      const data = await response.json();
      setDetailData(data[0]);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  console.log(selectedCity);
  useEffect(() => {
    fetchCityWeatherHandler();
    fetchCityDetailHandler();
  }, [selectedCity]);

  return (
    <View style={styles.container}>
      <View style={styles.selctListContainer}>
        <View style={styles.selectContainer}>
          <View>
            <Text
              style={{ fontSize: 22, color: "#FB8500", textAlign: "center" }}
            >
              Select a city
            </Text>
          </View>
          <View style={styles.dropdown}>
            <SelectDropdown data={sortedCityData} onSelect={onSelectHandler} />
          </View>
        </View>
      </View>
      {!isLoading && error && (
        <View style={styles.erroContainer}>
          <Text style={styles.textStyle}>{error}</Text>
        </View>
      )}
      <View style={styles.detailContainer}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <View>
            <Text style={{ color: "#FFB703", fontSize: 22, paddingBottom: 20 }}>
              Details of selected city
            </Text>
            <Text style={styles.textStyle}>
              <FontAwesomeIcon icon={faCity} color={"#FB8500"} size={30} />
              &nbsp; City: {detailData.name}
            </Text>
            <Text style={styles.textStyle}>
              <FontAwesomeIcon icon={faGlobe} color={"#FFB703"} size={30} />
              &nbsp;Country: {detailData.country}
            </Text>
            <Text style={styles.textStyle}>
              <FontAwesomeIcon
                icon={faMapLocationDot}
                color={"#219EBC"}
                size={30}
              />
              &nbsp; Latitude: {detailData.latitude}
            </Text>
            <Text style={styles.textStyle}>
              <FontAwesomeIcon
                icon={faMapLocation}
                color={"#219EBC"}
                size={30}
              />
              &nbsp; Longitude: {detailData.longitude}
            </Text>
            <Text style={styles.textStyle}>
              <FontAwesomeIcon
                icon={faPeopleGroup}
                color={"#8ECAE6"}
                size={30}
              />
              &nbsp; Population: {detailData.population}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.weatherContainer}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <View>
            <Text style={{ color: "#219EBC", fontSize: 22, paddingBottom: 20 }}>
              Current Weather of selected city
            </Text>
            <Text style={styles.textStyle}>
              <FontAwesomeIcon icon={faCloudSun} color={"#FB8500"} size={30} />
              &nbsp;Weather: {weatherData.weather}
            </Text>
            <Text style={styles.textStyle}>
              {" "}
              <FontAwesomeIcon
                icon={faTemperatureHalf}
                color={"#FFB703"}
                size={30}
              />
              &nbsp;Temp: {weatherData.temp}
            </Text>
            <Text style={styles.textStyle}>
              <FontAwesomeIcon icon={faDroplet} color={"#219EBC"} size={30} />
              &nbsp;Humidity: {weatherData.humidity}
            </Text>
            <Text style={styles.textStyle}>
              {" "}
              <FontAwesomeIcon icon={faWind} color={"#8ECAE6"} size={30} />
              &nbsp;Wind Speed: {weatherData.wind}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "#023047",
  },
  detailContainer: {
    flex: 3,
    padding: 24,
  },
  weatherContainer: {
    flex: 3,
    padding: 24,
  },
  erroContainer: {
    flex: 1,
  },
  selctListContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textStyle: { fontSize: 16, color: "#fff" },
  dropdown: {
    margin: 10,
  },
});
export default Api;
