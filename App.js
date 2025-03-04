import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    FlatList,
    ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import axios from "axios";

const API_URL = "http://127.0.0.1:3000"; // Replace with actual backend

export default function App() {
    const [mood, setMood] = useState("");
    const [weather, setWeather] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getWeather();
    }, []);

    const getWeather = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") return;

            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            const API_KEY = "a3e4cd436cc2cbb0c907419be4f189cb"; // Get from OpenWeather

            let response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
            );
            setWeather(response.data);
        } catch (error) {
            console.error("Weather Fetch Error:", error);
        }
    };

    const getRecommendations = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/recommend`, {
                mood,
                weather,
            });
            setRecommendations(response.data.recommendations);
        } catch (error) {
            console.error("Error fetching recommendations:", error);
        }
        setLoading(false);
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20 }}>How are you feeling today?</Text>
            <TextInput
                style={{ borderWidth: 1, padding: 10, marginTop: 10 }}
                placeholder="Enter your mood..."
                value={mood}
                onChangeText={setMood}
            />
            <Button
                title="Get Food Recommendations"
                onPress={getRecommendations}
            />

            {loading && (
                <ActivityIndicator
                    size="large"
                    color="#0000ff"
                    style={{ marginTop: 20 }}
                />
            )}

            <FlatList
                data={recommendations}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Text style={{ fontSize: 18, marginTop: 10 }}>
                        🍽️ {item}
                    </Text>
                )}
            />
        </View>
    );
}
