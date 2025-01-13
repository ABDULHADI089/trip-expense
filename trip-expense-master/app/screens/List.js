import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Divider, TextInput } from "react-native-paper";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../../FireBaseConfig";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
import SheetViewModal from "./SheetViewModal";

export default function ListSheet() {
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [companyInformation, setCompanyInformation] = useState(null);
  const [searchByTitle, setSearchByTitle] = useState("");
  const [searchByDate, setSearchByDate] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [tripSheetModal, setTripSheetModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  const navigation = useNavigation();

  const updateData = (data, index, objId) => {
    navigation.navigate("CreateSheet", {
      data: data,
      index: index,
      objId: objId,
    });
  };

  const fetchFirestoreData = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(FIREBASE_DB, "sheets"));
      const sheetsList = querySnapshot.docs.map((doc) => doc.data());
      setAllData(sheetsList);
      setFilteredData(sheetsList);
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteItem = async (id, index) => {
    Alert.alert("Delete Sheet", "Are you sure you want to delete this sheet?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          try {
            setLoading(true);
            await deleteDoc(doc(FIREBASE_DB, "sheets", id));
          } catch (e) {
            console.log(e);
          } finally {
            const querySnapshot = await getDocs(
              collection(FIREBASE_DB, "sheets")
            );
            const sheetsList = querySnapshot.docs.map((doc) => doc.data());
            setAllData(sheetsList);
            setFilteredData(sheetsList);
            setLoading(false);
          }
        },
      },
    ]);
  };

  const fetchCompanyInformation = async () => {
    try {
      const companyInfo = await AsyncStorage.getItem("companyInfo");
      if (companyInfo !== null) {
        setCompanyInformation(JSON.parse(companyInfo));
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchFirestoreData();
    fetchCompanyInformation();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFirestoreData();
    await fetchCompanyInformation();
    setRefreshing(false);
  };

  const convertImageToBase64 = async (imageUri) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return `data:image/png;base64,${base64}`;
    } catch (error) {
      console.error("Error converting image to base64:", error);
      return null;
    }
  };

  const downloadPdf = async (data) => {
    const logo = await convertImageToBase64(companyInformation?.logo);
    let totalPayment = 0;
    let totalPerson = 0;

    data.clientDetails?.forEach((item) => {
      totalPayment += parseInt(item.payment);
      totalPerson += parseInt(item.numOfPerson);
    });

    data.additionalAmount?.forEach((item) => {
      totalPayment += parseInt(item.payment);
    });

    let totalUnpaids = 0;
    data.unpaid?.forEach((item) => {
      totalUnpaids += parseInt(item.payment);
    });

    let totalExpenses = 0;
    data.diesel?.forEach((item) => {
      totalExpenses += parseInt(item.payment);
    });
    data.breakfast?.forEach((item) => {
      totalExpenses += parseInt(item.payment);
    });
    data.dinner?.forEach((item) => {
      totalExpenses += parseInt(item.payment);
    });
    data.stay?.forEach((item) => {
      totalExpenses += parseInt(item.payment);
    });
    data.challan?.forEach((item) => {
      totalExpenses += parseInt(item.payment);
    });
    data.miscellaneous?.forEach((item) => {
      totalExpenses += parseInt(item.payment);
    });
    totalExpenses += parseInt(data.toll);
    totalExpenses += parseInt(data.carRent);

    const createTable = (items, columns) => {
      if (!items || items.length === 0) return "<p>No Details</p>";

      const headers = columns.map((col) => `<th>${col.header}</th>`).join("");
      let totalPayments = 0;
      const rows = items
        .map((item, index) => {
          const cells = columns
            .map((col) => {
              const value = item[col.key];
              if (col.key === "payment") totalPayments += parseInt(value);
              return `<td>${value}</td>`;
            })
            .join("");
          return `<tr><td>${index + 1}</td>${cells}</tr>`;
        })
        .join("");

      const totalRow = columns
        .map((col) =>
          col.key === "payment" ? `<td>${totalPayments}</td>` : `<td></td>`
        )
        .join("");

      return `
      <table>
        <thead>
          <tr>
            <th>#</th>
            ${headers}
          </tr>
        </thead>
        <tbody>
          ${rows}
          <tr><td></td>${totalRow}</tr>
        </tbody>
      </table>
    `;
    };

    const htmlContent = `
<html>
<head>
  <title>Trip Sheet</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .header img {
      width: 100px;
      height: auto;
    }
    .header h2, .header h3 {
      margin: 5px 0;
    }
    .details {
      margin: 20px;
    }
    .details h4 {
      margin: 5px 0;
    }
    .details table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    .details table, .details th, .details td {
      border: 1px solid #ccc;
      word-wrap: break-word;
    }
    .details th, .details td {
      padding: 8px;
      text-align: left;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="${logo}" alt="Company Logo">
    <h2>${companyInformation?.name}</h2>
    <h3>Trip Sheet</h3>
  </div>
  <div class="details">
    <div style="display: flex; justify-content: space-between;">
      <div>
        <h4>Trip Title: ${data.title}</h4>
        <h4>Guide Name: ${data.guideName}</h4>
        <h4>Total Number of Members: ${totalPerson}</h4>
      </div>
      <div style="text-align: right;">
        <h4>Date: ${data.date}</h4>
        <h4>Last Updated: ${dateTime(data.lastUpdatedOn.date)}</h4>
        <h4>Last Updated By: ${data.lastUpdatedOn.by}</h4>
      </div>
    </div>
    <h3>Client Details</h3>
    ${createTable(data.clientDetails, [
      { header: "Client Name", key: "name" },
      { header: "No. of Persons", key: "numOfPerson" },
      { header: "Contact", key: "contact" },
      { header: "Pickup", key: "pickupLocation" },
      { header: "Remaining", key: "payment" },
      { header: "Reference", key: "reference" },
      { header: "Description", key: "description" },
    ])}
    <h3>Diesel Details</h3>
    ${createTable(data.diesel, [
      { header: "Location", key: "location" },
      { header: "Payment", key: "payment" },
    ])}
    <h3>Breakfast Details</h3>
    ${createTable(data.breakfast, [
      { header: "Location", key: "location" },
      { header: "Payment", key: "payment" },
    ])}
    <h3>Dinner Details</h3>
    ${createTable(data.dinner, [
      { header: "Location", key: "location" },
      { header: "Payment", key: "payment" },
    ])}
    <h3>Stay Details</h3>
    ${createTable(data.stay, [
      { header: "Location", key: "location" },
      { header: "Payment", key: "payment" },
    ])}
    <h3>Challan Details</h3>
    ${createTable(data.challan, [
      { header: "Location", key: "location" },
      { header: "Payment", key: "payment" },
    ])}
    <h3>Miscellaneous Expenses</h3>
    ${createTable(data.miscellaneous, [
      { header: "Location", key: "location" },
      { header: "Payment", key: "payment" },
    ])}
    <h3>Additional Amounts</h3>
    ${createTable(data.additionalAmount, [
      { header: "Details", key: "details" },
      { header: "Amount", key: "payment" },
    ])}
    <h3>Unpaid Details</h3>
    ${createTable(data.unpaid, [
      { header: "Location", key: "location" },
      { header: "Payment", key: "payment" },
    ])}
  </div>
  <div style="margin: 20px;">
    <h3>Total Summary</h3>
    <p>Total Payment: ${totalPayment} PKR</p>
    <p>Total Expenses: ${totalExpenses} PKR</p>
    <p>Unpaid Total: ${totalUnpaids} PKR</p>
    <p>Remaining: ${totalPayment - totalExpenses} PKR</p>
    <p>Cost per Person: ${
      isFinite(totalExpenses / totalPerson)
        ? parseInt(totalExpenses / totalPerson)
        : 0
    } PKR</p>
  </div>
</body>
</html>
`;

    const { uri } = await printToFileAsync({
      html: htmlContent,
    });
    shareAsync(uri);
  };

  function dateTime(date) {
    let newDate;

    if (
      typeof date === "object" &&
      date.seconds !== undefined &&
      date.nanoseconds !== undefined
    ) {
      // Handle Firestore timestamp
      newDate = new Date(date.seconds * 1000 + date.nanoseconds / 1000000);
    } else if (typeof date === "string") {
      // Handle ISO 8601 date string
      newDate = new Date(date);
    } else {
      newDate = new Date(date);
    }

    const readableDate = newDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    return readableDate;
  }

  const handleTripDetails = (tripData) => {
    setModalData(tripData);
    setTripSheetModal(true);
  };

  useEffect(() => {
    const filteredData = allData.filter((data) => {
      return (
        data.title.toLowerCase().includes(searchByTitle) &&
        data.date.toLowerCase().includes(searchByDate)
      );
    });
    setFilteredData(filteredData);
  }, [searchByTitle, searchByDate]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={{ uri: companyInformation?.logo }} style={styles.logo} />
        <Text style={styles.companyName}>{companyInformation?.name}</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search by Title"
          onChangeText={(text) => setSearchByTitle(text.toLowerCase())}
        />
        <TextInput
          style={styles.input}
          placeholder="Search by Date"
          onChangeText={(text) => setSearchByDate(text)}
        />
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : (
          filteredData.map((data, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.itemDetails}>
                <Text style={styles.itemText}>
                  <Text style={styles.itemLabel}>Trip Title: </Text>
                  <Text style={styles.itemHeading}> {data.title}</Text>
                </Text>
                <Text style={styles.itemText}>
                  <Text style={styles.itemLabel}>Trip Date: </Text>
                  {data.date}
                </Text>

                <Divider style={{ marginVertical: 10 }} />

                <Text style={styles.itemText}>
                  <Text style={styles.itemLabel}>Created on: </Text>
                  {dateTime(data.createdOn)}
                </Text>
                <Text style={styles.itemText}>
                  <Text style={styles.itemLabel}>Last Updated: </Text>
                  {dateTime(data.lastUpdatedOn.date)}
                </Text>
                <Text style={styles.itemText}>
                  <Text style={styles.itemLabel}>Last Updated By: </Text>
                  {data.lastUpdatedOn.by}
                </Text>
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.btnDownload}
                    onPress={() => downloadPdf(data)}
                  >
                    <Text style={styles.btnText}>Save PDF</Text>
                    <AntDesign name="download" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btnEdit}
                    onPress={() => handleTripDetails(data)}
                  >
                    <AntDesign name="eye" size={24} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btnEdit}
                    onPress={() => updateData(data, index, data.id)}
                  >
                    <Feather name="edit" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btnDelete}
                    onPress={() => deleteItem(data.id, index)}
                  >
                    <AntDesign name="delete" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
        <SheetViewModal
          visible={tripSheetModal}
          onClose={() => setTripSheetModal(false)}
          data={modalData}
          companyInformation={companyInformation}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  companyName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  searchContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 15,
    height: 45,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  itemDetails: {
    marginBottom: 10,
  },
  itemText: {
    fontSize: 13,
    color: "#333",
  },
  itemLabel: {
    fontWeight: "bold",
    color: "#007BFF",
  },
  itemHeading: {
    fontSize: 20,
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  btnDownload: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  btnEdit: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  btnDelete: {
    backgroundColor: "#dc3545",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  btnText: {
    color: "#ffffff",
    marginRight: 10,
    fontSize: 16,
  },
});
