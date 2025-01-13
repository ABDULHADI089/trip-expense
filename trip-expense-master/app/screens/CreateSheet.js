import React, { useCallback, useEffect, useState } from "react";
import {
  BackHandler,
  Button,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { Checkbox, List, TextInput } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import { FIREBASE_APP } from "../../FireBaseConfig";
import { FIREBASE_DB } from "../../FireBaseConfig";
import * as FileSystem from "expo-file-system";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
import {
  doc,
  Firestore,
  getDoc,
  getFirestore,
  setDoc,
  where,
} from "firebase/firestore";
import DatePicker from "react-native-date-picker";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "../../FireBaseConfig";

export default function NewSheet() {
  const navigation = useNavigation();
  const routes = useRoute();

  const { data, index, objId } = routes.params || {};

  const [companyInformation, setCompanyInformation] = useState(null);
  // const [allData, setAllData] = useState([]);
  const [user, setUser] = useState(null);

  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [numOfDays, setNumOfDays] = useState(0);
  const [date, setDate] = useState("");
  const [open, setOpen] = useState(false);
  const [guideName, setGuideName] = useState("");
  const [clientDetails, setClientDetails] = useState([]);
  // const [totalPaymentDeparture, setTotalPaymentDeparture] = useState(0);
  const [diesel, setDiesel] = useState([]);
  const [toll, setToll] = useState(0);
  const [breakfast, setBreakfast] = useState([]);
  const [dinner, setDinner] = useState([]);
  const [stay, setStay] = useState([]);
  const [challan, setChallan] = useState([]);
  const [carRent, setCarRent] = useState(0);
  const [miscellaneous, setMiscellaneous] = useState([]);
  const [unpaid, setUnpaid] = useState([]);
  const [additonalAmount, setAdditionalAmount] = useState([]);
  const [createdOn, setCreatedOn] = useState(new Date());
  // --------------------------------------------
  const [clientName, setClientName] = useState("");
  const [clientNumOfPerson, setClientNumOfPerson] = useState(0);
  const [clientPayment, setClientPayment] = useState(0);
  const [clientContact, setClientContact] = useState("");
  const [clientPickupLocation, setClientPickupLocation] = useState("");
  const [clientReference, setClientReference] = useState("");
  const [clientDescription, setClientDescription] = useState("");
  const [clientPaymentStatus, setClientPaymentStatus] = useState(false);

  const [editingIndex, setEditingIndex] = useState(null);
  //-----------------------------------------------
  const [dieselPayment, setDieselPayment] = useState(0);
  const [dieselLocation, setDieselLocation] = useState("");
  // -----------------------------------------------
  const [breakfastPayment, setBreakfastPayment] = useState(0);
  const [breakfastLocation, setBreakfastLocation] = useState("");
  // -----------------------------------------------
  const [dinnerPayment, setDinnerPayment] = useState(0);
  const [dinnerLocation, setDinnerLocation] = useState("");
  // -----------------------------------------------
  const [stayPayment, setStayPayment] = useState(0);
  const [stayLocation, setStayLocation] = useState("");
  // -----------------------------------------------
  const [challanPayment, setChallanPayment] = useState(0);
  const [challanLocation, setChallanLocation] = useState("");
  // -----------------------------------------------
  const [miscellaneousPayment, setMiscellaneousPayment] = useState(0);
  const [miscellaneousDetails, setMiscellaneousDetails] = useState("");
  // -----------------------------------------------
  const [unpaidPayment, setUnpaidPayment] = useState(0);
  const [unpaidDetails, setUnpaidDetails] = useState("");
  // -----------------------------------------------

  const [additionalAmountDetails, setAdditionalAmountDetails] = useState("");
  const [additionalPayment, setAdditionalPayment] = useState(0);

  // -----------------------------------------------
  const [completePayment, setCompletePayment] = useState(0);
  const [totalPersons, setTotalPersons] = useState(0);
  const [completeExpenses, setCompleteExpenses] = useState(0);
  const [unpaidTotal, setUnpaidTotal] = useState(0);

  // -------------------- Handling Client -----------------------

  const putDataInClientDetails = () => {
    const clientObject = {
      name: clientName,
      numOfPerson: clientNumOfPerson,
      payment: clientPayment,
      contact: clientContact,
      pickupLocation: clientPickupLocation,
      reference: clientReference,
      description: clientDescription,
      paymentStatus: clientPaymentStatus,
    };

    if (editingIndex !== null) {
      const newArray = [...clientDetails];
      newArray[editingIndex] = clientObject;
      setClientDetails(newArray);
    } else {
      const newArray = [...clientDetails, clientObject];
      setClientDetails(newArray);
    }

    setClientName("");
    setClientNumOfPerson(0);
    setClientPayment(0);
    setClientContact("");
    setClientPickupLocation("");
    setClientReference("");
    setClientDescription("");
    setClientPaymentStatus(false);
    setEditingIndex(null);
  };

  const handleClientDelete = (index) => {
    const newArray = [...clientDetails];
    newArray.splice(index, 1);
    setClientDetails(newArray);
  };

  const handleClientEdit = (index, item) => {
    setEditingIndex(index);
    setClientName(item.name);
    setClientNumOfPerson(item.numOfPerson);
    setClientPayment(item.payment);
    setClientContact(item.contact);
    setClientPickupLocation(item.pickupLocation);
    setClientReference(item.reference);
    setClientDescription(item.description);
    setClientPaymentStatus(item.paymentStatus);
  };

  // -----------------------------------------------
  // ----------------------Handling Diesel ---------

  const putDataInDiesel = () => {
    const dieselObject = {
      location: dieselLocation,
      payment: dieselPayment,
    };

    if (editingIndex !== null) {
      const newArray = [...diesel];
      newArray[editingIndex] = dieselObject;
      setDiesel(newArray);
    } else {
      const newArray = [...diesel, dieselObject];
      setDiesel(newArray);
    }

    setDieselLocation("");
    setDieselPayment(0);
    setEditingIndex(null);
  };

  const handleDieselDelete = (index) => {
    const newArray = [...diesel];
    newArray.splice(index, 1);
    setDiesel(newArray);
  };

  const handleDieselEdit = (index, item) => {
    setEditingIndex(index);
    setDieselLocation(item.location);
    setDieselPayment(item.payment);
  };
  // ----------------------------------------------
  // ---------------Handling Breakfast ------------

  const putDataInBreakfast = () => {
    const breakfastObject = {
      location: breakfastLocation,
      payment: breakfastPayment,
    };

    if (editingIndex !== null) {
      const newArray = [...breakfast];
      newArray[editingIndex] = breakfastObject;
      setBreakfast(newArray);
    } else {
      const newArray = [...breakfast, breakfastObject];
      setBreakfast(newArray);
    }

    setBreakfastLocation("");
    setBreakfastPayment(0);
    setEditingIndex(null);
  };

  const handleBreakfastDelete = (index) => {
    const newArray = [...breakfast];
    newArray.splice(index, 1);
    setBreakfast(newArray);
  };

  const handleBreakfastEdit = (index, item) => {
    setEditingIndex(index);
    setBreakfastLocation(item.location);
    setBreakfastPayment(item.payment);
  };

  // ----------------------------------------------
  // ---------------Handling Dinner ------------

  const putDataInDinner = () => {
    const dinnerObject = {
      location: dinnerLocation,
      payment: dinnerPayment,
    };

    if (editingIndex !== null) {
      const newArray = [...dinner];
      newArray[editingIndex] = dinnerObject;
      setDinner(newArray);
    } else {
      const newArray = [...dinner, dinnerObject];
      setDinner(newArray);
    }

    setDinnerLocation("");
    setDinnerPayment(0);
    setEditingIndex(null);
  };

  const handleDinnerDelete = (index) => {
    const newArray = [...dinner];
    newArray.splice(index, 1);
    setDinner(newArray);
  };

  const handleDinnerEdit = (index, item) => {
    setEditingIndex(index);
    setDinnerLocation(item.location);
    setDinnerPayment(item.payment);
  };

  // ----------------------------------------------
  // ---------------Handling Stay ------------

  const putDataInStay = () => {
    const stayObject = {
      location: stayLocation,
      payment: stayPayment,
    };

    if (editingIndex !== null) {
      const newArray = [...stay];
      newArray[editingIndex] = stayObject;
      setStay(newArray);
    } else {
      const newArray = [...stay, stayObject];
      setStay(newArray);
    }

    setStayLocation("");
    setStayPayment(0);
    setEditingIndex(null);
  };

  const handleStayDelete = (index) => {
    const newArray = [...stay];
    newArray.splice(index, 1);
    setStay(newArray);
  };

  const handleStayEdit = (index, item) => {
    setEditingIndex(index);
    setStayLocation(item.location);
    setStayPayment(item.payment);
  };

  // ----------------------------------------------
  // ---------------Handling Challan ------------

  const putDataInChallan = () => {
    const challanObject = {
      location: challanLocation,
      payment: challanPayment,
    };

    if (editingIndex !== null) {
      const newArray = [...challan];
      newArray[editingIndex] = challanObject;
      setChallan(newArray);
    } else {
      const newArray = [...challan, challanObject];
      setChallan(newArray);
    }

    setChallanLocation("");
    setChallanPayment(0);
    setEditingIndex(null);
  };

  const handleChallanDelete = (index) => {
    const newArray = [...challan];
    newArray.splice(index, 1);
    setChallan(newArray);
  };

  const handleChallanEdit = (index, item) => {
    setEditingIndex(index);
    setChallanLocation(item.location);
    setChallanPayment(item.payment);
  };

  // ----------------------------------------------
  // ---------------Handling Miscellaneous ------------

  const putDataInMiscellaneous = () => {
    const miscellaneousObject = {
      details: miscellaneousDetails,
      payment: miscellaneousPayment,
    };

    if (editingIndex !== null) {
      const newArray = [...miscellaneous];
      newArray[editingIndex] = miscellaneousObject;
      setMiscellaneous(newArray);
    } else {
      const newArray = [...miscellaneous, miscellaneousObject];
      setMiscellaneous(newArray);
    }

    setMiscellaneousDetails("");
    setMiscellaneousPayment(0);
    setEditingIndex(null);
  };

  const handleMiscellaneousDelete = (index) => {
    const newArray = [...miscellaneous];
    newArray.splice(index, 1);
    setMiscellaneous(newArray);
  };

  const handleMiscellaneousEdit = (index, item) => {
    setEditingIndex(index);
    setMiscellaneousDetails(item.details);
    setMiscellaneousPayment(item.payment);
  };

  // ----------------------------------------------
  // ---------------Handling Unpaid ------------

  const putDataInUnpaid = () => {
    const unpaidObject = {
      details: unpaidDetails,
      payment: unpaidPayment,
    };

    if (editingIndex !== null) {
      const newArray = [...unpaid];
      newArray[editingIndex] = unpaidObject;
      setUnpaid(newArray);
    } else {
      const newArray = [...unpaid, unpaidObject];
      setUnpaid(newArray);
    }

    setUnpaidDetails("");
    setUnpaidPayment(0);
    setEditingIndex(null);
  };

  const handleUnpaidDelete = (index) => {
    const newArray = [...unpaid];
    newArray.splice(index, 1);
    setUnpaid(newArray);
  };

  const handleUnpaidEdit = (index, item) => {
    setEditingIndex(index);
    setUnpaidDetails(item.details);
    setUnpaidPayment(item.payment);
  };

  // ----------------------------------------------
  // ---------------Handling Additional ------------

  const putDataInAdditional = () => {
    const additionalObject = {
      details: additionalAmountDetails,
      payment: additionalPayment,
    };

    if (editingIndex !== null) {
      const newArray = [...additonalAmount];
      newArray[editingIndex] = additionalObject;
      setAdditionalAmount(newArray);
    } else {
      const newArray = [...additonalAmount, additionalObject];
      setAdditionalAmount(newArray);
    }

    setAdditionalAmountDetails("");
    setAdditionalPayment(0);
    setEditingIndex(null);
  };

  const handleAdditionalDelete = (index) => {
    const newArray = [...additonalAmount];
    newArray.splice(index, 1);
    setAdditionalAmount(newArray);
  };

  const handleAdditionalEdit = (index, item) => {
    setEditingIndex(index);
    setAdditionalAmountDetails(item.details);
    setAdditionalPayment(item.payment);
  };

  const Save = useCallback(() => {
    if (data && objId !== null) {
      const updateObj = {
        id: objId,
        title: title,
        numOfDays: numOfDays,
        date: date,
        createdOn: createdOn,
        guideName: guideName,
        clientDetails: clientDetails,
        diesel: diesel,
        toll: toll,
        breakfast: breakfast,
        dinner: dinner,
        stay: stay,
        challan: challan,
        lastUpdatedOn: {
          date: new Date(),
          by: user.email,
        },
        carRent: carRent,
        miscellaneous: miscellaneous,
        unpaid: unpaid,
        additonalAmount: additonalAmount,
      };
      const docRef = doc(FIREBASE_DB, "sheets", objId);
      setDoc(docRef, updateObj);

      // Navigate to ListSheet
      navigation.navigate("Home");
    } else {
      const createId = Math.random().toString(36).substring(7); //six digit id

      const createObj = {
        id: createId,
        title: title,
        numOfDays: numOfDays,
        date: date,
        createdOn: createdOn,
        guideName: guideName,
        clientDetails: clientDetails,
        diesel: diesel,
        toll: toll,
        breakfast: breakfast,
        dinner: dinner,
        stay: stay,
        challan: challan,
        lastUpdatedOn: {
          date: new Date(),
          by: user.email,
        },
        carRent: carRent,
        miscellaneous: miscellaneous,
        unpaid: unpaid,
        additonalAmount: additonalAmount,
      };

      const docRef = doc(FIREBASE_DB, "sheets", createId);
      setDoc(docRef, createObj);

      // Navigate to ListSheet
      navigation.navigate("Home");
    }
  });

  useEffect(() => {
    const fetchUser = async () => {
      const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
        setUser(user);
      });
      return unsubscribe;
    };

    const fetchStorageArray = async () => {
      try {
        const companyInfo = await AsyncStorage.getItem("companyInfo");
        if (companyInfo !== null) {
          setCompanyInformation(JSON.parse(companyInfo));
        }
      } catch (e) {
        console.log(e);
      }
    };

    console.log(data, index, objId);

    if (data && objId !== null) {
      setId(data.id);
      setTitle(data.title);
      setNumOfDays(data.numOfDays);
      setDate(data.date);
      setGuideName(data.guideName);
      setClientDetails(data.clientDetails);
      setDiesel(data.diesel);
      setToll(data.toll);
      setBreakfast(data.breakfast);
      setDinner(data.dinner);
      setStay(data.stay);
      setChallan(data.challan);
      setCarRent(data.carRent);
      setMiscellaneous(data.miscellaneous);
      setUnpaid(data.unpaid);
      setAdditionalAmount(data.additonalAmount);
      setCreatedOn(data.createdOn);
    }

    console.log("date", date);

    fetchUser();
    fetchStorageArray();
  }, []);

  useEffect(() => {
    let totalunpaids = 0;
    unpaid.forEach((item) => {
      totalunpaids += parseInt(item.payment);
    });
    setUnpaidTotal(totalunpaids);
  }, [unpaid]);

  useEffect(() => {
    let totalPayment = 0;
    let totalPerson = 0;
    clientDetails.forEach((item) => {
      totalPayment += item.paymentStatus ? parseInt(item.payment) : 0;
      totalPerson += parseInt(item.numOfPerson);
    });
    additonalAmount.forEach((item) => {
      totalPayment += parseInt(item.payment);
    });
    setTotalPersons(totalPerson);
    setCompletePayment(totalPayment);
  }, [clientDetails, additonalAmount]);

  useEffect(() => {
    let totalExpenses = 0;
    diesel.forEach((item) => {
      totalExpenses += parseInt(item.payment);
    });
    breakfast.forEach((item) => {
      totalExpenses += parseInt(item.payment);
    });
    dinner.forEach((item) => {
      totalExpenses += parseInt(item.payment);
    });
    stay.forEach((item) => {
      totalExpenses += parseInt(item.payment);
    });
    challan.forEach((item) => {
      totalExpenses += parseInt(item.payment);
    });
    miscellaneous.forEach((item) => {
      totalExpenses += parseInt(item.payment);
    });
    totalExpenses += parseInt(toll);
    totalExpenses += parseInt(carRent);
    setCompleteExpenses(totalExpenses);
  }, [diesel, breakfast, dinner, stay, challan, miscellaneous, toll, carRent]);

  //Function to download the pdf of the trip sheet

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

  const downloadTripSheetPdf = async () => {
    const logo = await convertImageToBase64(companyInformation?.logo);
    const name = companyInformation?.name;
    const tripTitle = title;
    const guide = guideName;

    const totalPersons = clientDetails.reduce(
      (acc, item) => acc + parseInt(item.numOfPerson),
      0
    );
    const totalPayment = clientDetails.reduce(
      (acc, item) => acc + parseInt(item.payment),
      0
    );

    let clientDetailsHTML = clientDetails
      .map(
        (item, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td>${item.numOfPerson}</td>
        <td>${item.contact}</td>
        <td>${item.pickupLocation}</td>
        <td>${item.payment}</td>
        <td>${item.reference}</td>
        <td>${item.description}</td>
      </tr>`
      )
      .join("");

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
          .details .left, .details .right {
            display: inline-block;
            vertical-align: top;
          }
          .details .left {
            width: 60%;
          }
          .details .right {
            width: 38%;
            text-align: right;
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
          .footer {
            margin: 20px;
            text-align: right;
          }
          .footer h4 {
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="${logo}" alt="Company Logo">
          <h2>${name}</h2>
          <h3>Trip Sheet</h3>
        </div>
        <div class="details">
          <div class="left">
            <h4>Trip Title: ${tripTitle}</h4>
            <h4>Guide Name: ${guide}</h4>
            <h4>Captain: </h4>
            <h4>Vehicle Number: </h4>
            <h4>Total Number of Members: ${totalPersons}</h4>
          </div>
          <div class="right">
            <h4>Date: ${date}</h4>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Client Name</th>
                <th>No. of Persons</th>
                <th>Contact</th>
                <th>Pickup</th>
                <th>Remaining</th>
                <th>Reference</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              ${clientDetailsHTML}
              <tr>
                <td colspan="5"></td>
                <td>${totalPayment}</td>
                <td colspan="2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `;

    const { uri } = await printToFileAsync({
      html: htmlContent,
    });
    await shareAsync(uri);
  };

  function dateTime(date) {
    let newDate;
    console.log("date before", date);

    if (typeof date === "object" && date.seconds !== undefined) {
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
    console.log("readableDate", readableDate);
    return readableDate;
  }

  useEffect(() => {
    const backAction = () => {
      if (
        title !== "" ||
        numOfDays !== 0 ||
        date !== "" ||
        guideName !== "" ||
        clientDetails.length > 0 ||
        diesel.length > 0 ||
        toll !== 0 ||
        breakfast.length > 0 ||
        dinner.length > 0 ||
        stay.length > 0 ||
        challan.length > 0 ||
        carRent !== 0 ||
        miscellaneous.length > 0 ||
        unpaid.length > 0 ||
        additonalAmount.length > 0
      ) {
        alert("Do you want to go back without saving?");
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [
    title,
    numOfDays,
    date,
    guideName,
    clientDetails,
    diesel,
    toll,
    breakfast,
    dinner,
    stay,
    challan,
    carRent,
    miscellaneous,
    unpaid,
    additonalAmount,
  ]);

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: companyInformation?.logo }}
            style={styles.logo}
          />
          <Text style={styles.companyName}>{companyInformation?.name}</Text>
        </View>
        <Text style={styles.createdOnText}>
          Created on: {dateTime(createdOn)}
        </Text>

        <TextInput
          style={styles.input}
          value={title}
          placeholder="Trip Title"
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          value={numOfDays}
          placeholder="No. of Days"
          keyboardType="numeric"
          onChangeText={setNumOfDays}
        />
        <TextInput
          style={styles.input}
          value={date}
          placeholder="Date (e.g., 26 December 2022)"
          onChangeText={setDate}
        />
        <TextInput
          style={styles.input}
          value={guideName}
          placeholder="Guide Name"
          onChangeText={setGuideName}
        />
        <TextInput
          style={styles.input}
          value={toll}
          placeholder="Total Toll"
          keyboardType="numeric"
          onChangeText={setToll}
        />
        <TextInput
          style={styles.input}
          value={carRent}
          placeholder="Vehicle Rent"
          keyboardType="numeric"
          onChangeText={setCarRent}
        />

        <View style={styles.divider} />

        <List.Section>
          <Text style={styles.sectionTitle}>List of Clients</Text>
          <TouchableOpacity
            style={styles.pdfButton}
            onPress={downloadTripSheetPdf}
          >
            <Text style={styles.pdfButtonText}>PDF</Text>
          </TouchableOpacity>
          <Text style={styles.totalText}>
            Total Recievings:{" "}
            {clientDetails.reduce(
              (acc, item) =>
                acc + (item.paymentStatus ? parseInt(item.payment) : 0),
              0
            )}
          </Text>
          {clientDetails.length > 0 ? (
            clientDetails.map((item, index) => (
              <View
                style={{
                  backgroundColor: item.paymentStatus
                    ? "lightgreen"
                    : "lightcoral",
                  ...styles.listItemContainer,
                }}
                key={index}
              >
                <View style={styles.clientInfoContainer}>
                  <Text style={styles.clientIndex}>{index + 1})</Text>
                  <View style={styles.clientDetails}>
                    <Text style={styles.clientName}>Name: {item.name}</Text>
                    <Text>Total Persons: {item.numOfPerson}</Text>
                    <Text>Payment: {item.payment}</Text>
                    <Text>Contact: {item.contact}</Text>
                    <Text>Pickup Location: {item.pickupLocation}</Text>
                    <Text>Reference: {item.reference}</Text>
                    <Text>Description: {item.description}</Text>
                  </View>
                </View>
                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleClientEdit(index, item)}
                  >
                    <Feather name="edit" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleClientDelete(index)}
                  >
                    <AntDesign name="delete" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noClientsText}>No Clients Added</Text>
          )}
        </List.Section>

        <View style={styles.addSection}>
          <Text style={styles.addSectionTitle}>Add a Client Details: </Text>
          <TextInput
            style={styles.input}
            value={clientName}
            placeholder="Client Name"
            onChangeText={setClientName}
          />
          <TextInput
            style={styles.input}
            value={clientNumOfPerson}
            placeholder="Number of Person"
            keyboardType="numeric"
            onChangeText={setClientNumOfPerson}
          />
          <TextInput
            style={styles.input}
            value={clientPayment}
            placeholder="Payment"
            keyboardType="numeric"
            onChangeText={setClientPayment}
          />
          <Checkbox.Item
            label="Payment Status"
            status={clientPaymentStatus ? "checked" : "unchecked"}
            onPress={() => setClientPaymentStatus(!clientPaymentStatus)}
          />
          <TextInput
            style={styles.input}
            value={clientContact}
            placeholder="Contact"
            onChangeText={setClientContact}
          />
          <TextInput
            style={styles.input}
            value={clientPickupLocation}
            placeholder="Pickup Location"
            onChangeText={setClientPickupLocation}
          />
          <TextInput
            style={styles.input}
            value={clientReference}
            placeholder="Reference"
            onChangeText={setClientReference}
          />
          <TextInput
            style={styles.input}
            value={clientDescription}
            placeholder="Description"
            onChangeText={setClientDescription}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={putDataInClientDetails}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <List.Section>
          <Text style={styles.sectionTitle}>List of Diesel Payments</Text>
          <Text style={styles.totalText}>
            Total Diesel:{" "}
            {diesel.reduce((acc, item) => acc + parseInt(item.payment), 0)}
          </Text>
          {diesel.length > 0 ? (
            diesel.map((item, index) => (
              <View style={styles.listItemContainer2} key={index}>
                <View style={styles.clientInfoContainer}>
                  <Text style={styles.clientIndex}>{index + 1})</Text>
                  <View style={styles.clientDetails}>
                    <Text style={styles.clientName}>
                      Location: {item.location}
                    </Text>
                    <Text>Payment: {item.payment}</Text>
                  </View>
                </View>
                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleDieselEdit(index, item)}
                  >
                    <Feather name="edit" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDieselDelete(index)}
                  >
                    <AntDesign name="delete" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noClientsText}>No Diesel Payments Added</Text>
          )}
        </List.Section>

        <View style={styles.addSection}>
          <Text style={styles.addSectionTitle}>
            Add Diesel Payment Details:{" "}
          </Text>
          <TextInput
            style={styles.input}
            value={dieselLocation}
            placeholder="Location"
            onChangeText={setDieselLocation}
          />
          <TextInput
            style={styles.input}
            value={dieselPayment}
            placeholder="Payment"
            keyboardType="numeric"
            onChangeText={setDieselPayment}
          />
          <TouchableOpacity style={styles.addButton} onPress={putDataInDiesel}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <List.Section>
          <Text style={styles.sectionTitle}>List of Breakfast Payments</Text>
          <Text style={styles.totalText}>
            Total Breakfast:{" "}
            {breakfast.reduce((acc, item) => acc + parseInt(item.payment), 0)}
          </Text>
          {breakfast.length > 0 ? (
            breakfast.map((item, index) => (
              <View style={styles.listItemContainer2} key={index}>
                <View style={styles.clientInfoContainer}>
                  <Text style={styles.clientIndex}>{index + 1})</Text>
                  <View style={styles.clientDetails}>
                    <Text style={styles.clientName}>
                      Location: {item.location}
                    </Text>
                    <Text>Payment: {item.payment}</Text>
                  </View>
                </View>
                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleBreakfastEdit(index, item)}
                  >
                    <Feather name="edit" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleBreakfastDelete(index)}
                  >
                    <AntDesign name="delete" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noClientsText}>
              No Breakfast Payments Added
            </Text>
          )}
        </List.Section>

        <View style={styles.addSection}>
          <Text style={styles.addSectionTitle}>
            Add Breakfast Payment Details:{" "}
          </Text>
          <TextInput
            style={styles.input}
            value={breakfastLocation}
            placeholder="Location"
            onChangeText={setBreakfastLocation}
          />
          <TextInput
            style={styles.input}
            value={breakfastPayment}
            placeholder="Payment"
            keyboardType="numeric"
            onChangeText={setBreakfastPayment}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={putDataInBreakfast}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <List.Section>
          <Text style={styles.sectionTitle}>List of Dinner Payments</Text>
          <Text style={styles.totalText}>
            Total Dinner:{" "}
            {dinner.reduce((acc, item) => acc + parseInt(item.payment), 0)}
          </Text>
          {dinner.length > 0 ? (
            dinner.map((item, index) => (
              <View style={styles.listItemContainer2} key={index}>
                <View style={styles.clientInfoContainer}>
                  <Text style={styles.clientIndex}>{index + 1})</Text>
                  <View style={styles.clientDetails}>
                    <Text style={styles.clientName}>
                      Location: {item.location}
                    </Text>
                    <Text>Payment: {item.payment}</Text>
                  </View>
                </View>
                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleDinnerEdit(index, item)}
                  >
                    <Feather name="edit" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDinnerDelete(index)}
                  >
                    <AntDesign name="delete" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noClientsText}>No Dinner Payments Added</Text>
          )}
        </List.Section>

        <View style={styles.addSection}>
          <Text style={styles.addSectionTitle}>
            Add Dinner Payment Details:{" "}
          </Text>
          <TextInput
            style={styles.input}
            value={dinnerLocation}
            placeholder="Location"
            onChangeText={setDinnerLocation}
          />
          <TextInput
            style={styles.input}
            value={dinnerPayment}
            placeholder="Payment"
            keyboardType="numeric"
            onChangeText={setDinnerPayment}
          />
          <TouchableOpacity style={styles.addButton} onPress={putDataInDinner}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <List.Section>
          <Text style={styles.sectionTitle}>List of Stay Payments</Text>
          <Text style={styles.totalText}>
            Total Stay:{" "}
            {stay.reduce((acc, item) => acc + parseInt(item.payment), 0)}
          </Text>
          {stay.length > 0 ? (
            stay.map((item, index) => (
              <View style={styles.listItemContainer2} key={index}>
                <View style={styles.clientInfoContainer}>
                  <Text style={styles.clientIndex}>{index + 1})</Text>
                  <View style={styles.clientDetails}>
                    <Text style={styles.clientName}>
                      Location: {item.location}
                    </Text>
                    <Text>Payment: {item.payment}</Text>
                  </View>
                </View>
                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleStayEdit(index, item)}
                  >
                    <Feather name="edit" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleStayDelete(index)}
                  >
                    <AntDesign name="delete" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noClientsText}>No Stay Payments Added</Text>
          )}
        </List.Section>

        <View style={styles.addSection}>
          <Text style={styles.addSectionTitle}>Add Stay Payment Details: </Text>
          <TextInput
            style={styles.input}
            value={stayLocation}
            placeholder="Location"
            onChangeText={setStayLocation}
          />
          <TextInput
            style={styles.input}
            value={stayPayment}
            placeholder="Payment"
            keyboardType="numeric"
            onChangeText={setStayPayment}
          />
          <TouchableOpacity style={styles.addButton} onPress={putDataInStay}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <List.Section>
          <Text style={styles.sectionTitle}>List of Additional Recievings</Text>
          <Text style={styles.totalText}>
            Total Additional Recievings:{" "}
            {additonalAmount.reduce(
              (acc, item) => acc + parseInt(item.payment),
              0
            )}
          </Text>
          {additonalAmount.length > 0 ? (
            additonalAmount.map((item, index) => (
              <View style={styles.listItemContainer2} key={index}>
                <View style={styles.clientInfoContainer}>
                  <Text style={styles.clientIndex}>{index + 1})</Text>
                  <View style={styles.clientDetails}>
                    <Text style={styles.clientName}>
                      Details: {item.details}
                    </Text>
                    <Text>Payment: {item.payment}</Text>
                  </View>
                </View>
                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleAdditionalEdit(index, item)}
                  >
                    <Feather name="edit" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleAdditionalDelete(index)}
                  >
                    <AntDesign name="delete" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noClientsText}>
              No Additional Recievings Added
            </Text>
          )}
        </List.Section>

        <View style={styles.addSection}>
          <Text style={styles.addSectionTitle}>
            Add Additional Recievings Details:{" "}
          </Text>
          <TextInput
            style={styles.input}
            value={additionalAmountDetails}
            placeholder="Details"
            onChangeText={setAdditionalAmountDetails}
          />
          <TextInput
            style={styles.input}
            value={additionalPayment}
            placeholder="Payment"
            keyboardType="numeric"
            onChangeText={setAdditionalPayment}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={putDataInAdditional}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <List.Section>
          <Text style={styles.sectionTitle}>List of Challans</Text>
          <Text style={styles.totalText}>
            Total Challan:{" "}
            {challan.reduce((acc, item) => acc + parseInt(item.payment), 0)}
          </Text>
          {challan.length > 0 ? (
            challan.map((item, index) => (
              <View style={styles.listItemContainer2} key={index}>
                <View style={styles.clientInfoContainer}>
                  <Text style={styles.clientIndex}>{index + 1})</Text>
                  <View style={styles.clientDetails}>
                    <Text style={styles.clientName}>
                      Location: {item.location}
                    </Text>
                    <Text>Payment: {item.payment}</Text>
                  </View>
                </View>
                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleChallanEdit(index, item)}
                  >
                    <Feather name="edit" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleChallanDelete(index)}
                  >
                    <AntDesign name="delete" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noClientsText}>No Challans Added</Text>
          )}
        </List.Section>

        <View style={styles.addSection}>
          <Text style={styles.addSectionTitle}>Add Challan Details: </Text>
          <TextInput
            style={styles.input}
            value={challanLocation}
            placeholder="Location"
            onChangeText={setChallanLocation}
          />
          <TextInput
            style={styles.input}
            value={challanPayment}
            placeholder="Payment"
            keyboardType="numeric"
            onChangeText={setChallanPayment}
          />
          <TouchableOpacity style={styles.addButton} onPress={putDataInChallan}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <List.Section>
          <Text style={styles.sectionTitle}>List of Miscellaneous Charges</Text>
          <Text style={styles.totalText}>
            Total Miscellaneous Charges:{" "}
            {miscellaneous.reduce(
              (acc, item) => acc + parseInt(item.payment),
              0
            )}
          </Text>
          {miscellaneous.length > 0 ? (
            miscellaneous.map((item, index) => (
              <View style={styles.listItemContainer2} key={index}>
                <View style={styles.clientInfoContainer}>
                  <Text style={styles.clientIndex}>{index + 1})</Text>
                  <View style={styles.clientDetails}>
                    <Text style={styles.clientName}>
                      Details: {item.details}
                    </Text>
                    <Text>Payment: {item.payment}</Text>
                  </View>
                </View>
                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleMiscellaneousEdit(index, item)}
                  >
                    <Feather name="edit" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleMiscellaneousDelete(index)}
                  >
                    <AntDesign name="delete" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noClientsText}>
              No Miscellaneous Payments Added
            </Text>
          )}
        </List.Section>

        <View style={styles.addSection}>
          <Text style={styles.addSectionTitle}>
            Add Miscellaneous Payment Details:{" "}
          </Text>
          <TextInput
            style={styles.input}
            value={miscellaneousDetails}
            placeholder="Details"
            onChangeText={setMiscellaneousDetails}
          />
          <TextInput
            style={styles.input}
            value={miscellaneousPayment}
            placeholder="Payment"
            keyboardType="numeric"
            onChangeText={setMiscellaneousPayment}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={putDataInMiscellaneous}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <List.Section>
          <Text style={styles.sectionTitle}>List of Unpaid Bills</Text>
          {unpaid.length > 0 ? (
            unpaid.map((item, index) => (
              <View style={styles.listItemContainer2} key={index}>
                <View style={styles.clientInfoContainer}>
                  <Text style={styles.clientIndex}>{index + 1})</Text>
                  <View style={styles.clientDetails}>
                    <Text style={styles.clientName}>
                      Details: {item.details}
                    </Text>
                    <Text>Payment: {item.payment}</Text>
                  </View>
                </View>
                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleUnpaidEdit(index, item)}
                  >
                    <Feather name="edit" size={20} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleUnpaidDelete(index)}
                  >
                    <AntDesign name="delete" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noClientsText}>No Unpaid Bills Added</Text>
          )}
        </List.Section>

        <View style={styles.addSection}>
          <Text style={styles.addSectionTitle}>Add Unpaid Bill Details: </Text>
          <TextInput
            style={styles.input}
            value={unpaidDetails}
            placeholder="Details"
            onChangeText={setUnpaidDetails}
          />
          <TextInput
            style={styles.input}
            value={unpaidPayment}
            placeholder="Payment"
            keyboardType="numeric"
            onChangeText={setUnpaidPayment}
          />
          <TouchableOpacity style={styles.addButton} onPress={putDataInUnpaid}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Button title="Save" style={styles.savebtn} onPress={Save} />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  scrollViewContainer: {
    paddingBottom: 50,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  companyName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  createdOnText: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  divider: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  pdfButton: {
    backgroundColor: "#007BFF",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  pdfButtonText: {
    color: "white",
    fontSize: 18,
  },
  totalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  listItemContainer: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listItemContainer2: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  clientInfoContainer: {},
  clientIndex: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  clientDetails: {
    flex: 1,
    color: "#fff",
  },
  clientName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  actionButtonsContainer: {
    flexDirection: "column",
  },
  editButton: {
    backgroundColor: "#28a745",
    padding: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
    marginRight: 10,
  },
  noClientsText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  addSection: {
    marginTop: 20,
  },
  addSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#007BFF",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
  },
  savebtn: {
    backgroundColor: "orange",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    marginTop: 10,
  },
});
