import { NavigationContainer, useNavigation } from "@react-navigation/native";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign, Fontisto, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";


export default function Home() {
  const navigation = useNavigation();
  const [companyInformation, setCompanyInformation] = useState({});

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    setCompanyInformation({
      ...companyInformation,
      logo: result.assets[0].uri,
    });
  };

  const handleSave = async () => {
    await AsyncStorage.setItem(
      "companyInfo",
      JSON.stringify(companyInformation)
    );
    alert("Company Information Saved Successfully");
  };

  useEffect(() => {
    const getCompanyInformation = async () => {
      const companyInformation = await AsyncStorage.getItem("companyInfo");
      if (companyInformation) {
        setCompanyInformation(JSON.parse(companyInformation));
      }
    };
    getCompanyInformation();
  }, []);

  return (
    <View style={{ height: "100%" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoContainer}>
          <TouchableOpacity style={styles.btnUpload} onPress={pickImage}>
            <FontAwesome name="upload" size={24} color="black" />
          </TouchableOpacity>
          {companyInformation.logo ? (
            <Image
              source={{ uri: companyInformation?.logo }}
              style={styles.logo}
            />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoPlaceholderText}>Logo</Text>
            </View>
          )}
          <TextInput
            style={styles.input}
            placeholder="Enter Company Name"
            value={companyInformation?.name}
            onChangeText={(text) =>
              setCompanyInformation({ ...companyInformation, name: text })
            }
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("CreateSheet")}
          >
            <AntDesign
              name="addfile"
              size={24}
              style={styles.icons}
              color="white"
            />
            <Text style={styles.buttonText}>New Sheet</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("List")}
          >
            <Fontisto
              name="preview"
              style={styles.icons}
              size={24}
              color="white"
            />
            <Text style={styles.buttonText}>All Sheets</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.welcomeText}>
          Welcome to our Local Travel company's Application! We're thrilled to
          have you on board. With our user-friendly platform, tour guides and
          operators can now effortlessly create and manage expense sheets for
          their tours across Pakistan. Whether it's tracking expenses,
          monitoring payments, or calculating costs per person, our application
          streamlines the process, ensuring transparency and efficiency every
          step of the way. Get ready to embark on a journey of seamless tour
          management like never before!
        </Text>
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Developed by Abdulhadi</Text>
        <Text>© hadi.heapware@gmail.com</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  btnUpload: {
    backgroundColor: "#3498DB",
    padding: 10,
    borderRadius: 50,
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  logoPlaceholderText: {
    color: "#aaa",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: 250,
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  welcomeText: {
    fontSize: 14,
    marginVertical: 20,
    lineHeight: 22,
    fontStyle: "italic",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: "#3498DB",
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 10,
    flexDirection: "row",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  icons: {
    marginRight: 5,
  },
  footer: {
    backgroundColor: "#ddd",
    padding: 10,
    position: "fixed",
    bottom: 0,
    width: "100%",
    alignItems: "center",
  },
});
