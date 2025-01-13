import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const SheetViewModal = ({ visible, onClose, data, companyInformation }) => {
  if (!data) return null;

  // Calculations for the summary
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

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <ScrollView>
            <Text style={styles.modalTitle}>Trip Details</Text>
            <Text style={styles.modalText}>Title: {data.title}</Text>
            <Text style={styles.modalText}>Guide Name: {data.guideName}</Text>
            <Text style={styles.modalText}>Date: {data.date}</Text>

            <View style={styles.gridsContainer}>
              <View style={styles.leftGrid}>
                <Text style={styles.sectionTitle}>Client Details</Text>
                <Text>
                  Total Recieved:{" "}
                  {data.clientDetails?.reduce(
                    (acc, item) =>
                      acc + (item.paymentStatus ? parseInt(item.payment) : 0),
                    0
                  )}
                </Text>
                {data.clientDetails?.length > 0 ? (
                  data.clientDetails.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: item.paymentStatus
                          ? "#c8e6c9"
                          : "#ffcdd2",
                        ...styles.itemContainer,
                      }}
                    >
                      <Text style={styles.itemText}>
                        Client Name:{" "}
                        <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                      </Text>
                      <Text style={styles.itemText}>
                        No. of Persons:{" "}
                        <Text style={{ fontWeight: "bold" }}>
                          {item.numOfPerson}
                        </Text>
                      </Text>
                      <Text style={styles.itemText}>
                        Contact:
                        <Text style={{ fontWeight: "bold" }}>
                          {item.contact}
                        </Text>
                      </Text>
                      <Text style={styles.itemText}>
                        Pickup:
                        <Text style={{ fontWeight: "bold" }}>
                          {item.pickupLocation}
                        </Text>
                      </Text>
                      <Text style={styles.itemText}>
                        Remaining:
                        <Text style={{ fontWeight: "bold" }}>
                          {item.payment}
                        </Text>{" "}
                        PKR
                      </Text>
                      <Text style={styles.itemText}>
                        Reference:
                        <Text style={{ fontWeight: "bold" }}>
                          {item.reference}
                        </Text>
                      </Text>
                      <Text style={styles.itemText}>
                        Description:
                        <Text style={{ fontWeight: "bold" }}>
                          {item.description}
                        </Text>
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noDetailsText}>No Client Details</Text>
                )}

                <Text style={styles.sectionTitle}>Diesel Details</Text>
                <Text>
                  Total Diesel:{" "}
                  {data.diesel?.reduce(
                    (acc, item) => acc + parseInt(item.payment),
                    0
                  )}
                </Text>
                {data.diesel?.length > 0 ? (
                  data.diesel.map((item, index) => (
                    <View key={index} style={styles.itemContainer}>
                      <Text style={styles.itemText}>
                        Location:
                        <Text style={{ fontWeight: "bold" }}>
                          {item.location}
                        </Text>
                      </Text>
                      <Text style={styles.itemText}>
                        Payment:
                        <Text style={{ fontWeight: "bold" }}>
                          {item.payment}
                        </Text>
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noDetailsText}>No Diesel Details</Text>
                )}

                <Text style={styles.sectionTitle}>Breakfast Details</Text>
                <Text>
                  Total Breakfast:{" "}
                  {data.breakfast?.reduce(
                    (acc, item) => acc + parseInt(item.payment),
                    0
                  )}
                </Text>
                {data.breakfast?.length > 0 ? (
                  data.breakfast.map((item, index) => (
                    <View key={index} style={styles.itemContainer}>
                      <Text style={styles.itemText}>
                        Location:
                        <Text style={{ fontWeight: "bold" }}>
                          {item.location}
                        </Text>
                      </Text>
                      <Text style={styles.itemText}>
                        Payment:
                        <Text style={{ fontWeight: "bold" }}>
                          {item.payment}
                        </Text>
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noDetailsText}>No Breakfast Details</Text>
                )}

                <Text style={styles.sectionTitle}>Dinner Details</Text>
                <Text>
                  Total Dinner:{" "}
                  {data.dinner?.reduce(
                    (acc, item) => acc + parseInt(item.payment),
                    0
                  )}
                </Text>
                {data.dinner?.length > 0 ? (
                  data.dinner.map((item, index) => (
                    <View key={index} style={styles.itemContainer}>
                      <Text style={styles.itemText}>
                        Location:
                        <Text style={{ fontWeight: "bold" }}>
                          {item.location}
                        </Text>
                      </Text>
                      <Text style={styles.itemText}>
                        Payment:
                        <Text style={{ fontWeight: "bold" }}>
                          {item.payment}
                        </Text>
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noDetailsText}>No Dinner Details</Text>
                )}

                <Text style={styles.sectionTitle}>Stay Details</Text>
                <Text>
                  Total Stay:{" "}
                  {data.stay?.reduce(
                    (acc, item) => acc + parseInt(item.payment),
                    0
                  )}
                </Text>
                {data.stay?.length > 0 ? (
                  data.stay.map((item, index) => (
                    <View key={index} style={styles.itemContainer}>
                      <Text style={styles.itemText}>
                        Location:
                        <Text style={{ fontWeight: "bold" }}>
                          {item.location}
                        </Text>
                      </Text>
                      <Text style={styles.itemText}>
                        Payment:
                        <Text style={{ fontWeight: "bold" }}>
                          {item.payment}
                        </Text>
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noDetailsText}>No Stay Details</Text>
                )}

                <Text style={styles.sectionTitle}>Challan Details</Text>
                <Text>
                  Total Challan:{" "}
                  {data.challan?.reduce(
                    (acc, item) => acc + parseInt(item.payment),
                    0
                  )}
                </Text>
                {data.challan?.length > 0 ? (
                  data.challan.map((item, index) => (
                    <View key={index} style={styles.itemContainer}>
                      <Text style={styles.itemText}>
                        Location:
                        <Text style={{ fontWeight: "bold" }}>
                          {item.location}
                        </Text>
                      </Text>
                      <Text style={styles.itemText}>
                        Payment:
                        <Text style={{ fontWeight: "bold" }}>
                          {item.payment}
                        </Text>
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noDetailsText}>No Challan Details</Text>
                )}

                <Text style={styles.sectionTitle}>Miscellaneous Expenses</Text>
                <Text>
                  Total Miscellaneous:{" "}
                  {data.miscellaneous?.reduce(
                    (acc, item) => acc + parseInt(item.payment),
                    0
                  )}
                </Text>
                {data.miscellaneous?.length > 0 ? (
                  data.miscellaneous.map((item, index) => (
                    <View key={index} style={styles.itemContainer}>
                      <Text style={styles.itemText}>
                        Location:
                        <Text style={{ fontWeight: "bold" }}>
                          {item.location}
                        </Text>
                      </Text>
                      <Text style={styles.itemText}>
                        Payment:
                        <Text style={{ fontWeight: "bold" }}>
                          {item.payment}
                        </Text>
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noDetailsText}>
                    No Miscellaneous Expenses
                  </Text>
                )}

                <Text style={styles.sectionTitle}>Additional Amounts</Text>
                <Text>
                  Additional Recievings:{" "}
                  {data.additionalAmount?.reduce(
                    (acc, item) => acc + parseInt(item.payment),
                    0
                  )}
                </Text>
                {data.additionalAmount?.length > 0 ? (
                  data.additionalAmount.map((item, index) => (
                    <View key={index} style={styles.itemContainer}>
                      <Text style={styles.itemText}>
                        Details: {item.details}
                      </Text>
                      <Text style={styles.itemText}>
                        Amount:
                        <Text style={{ fontWeight: "bold" }}>
                          {item.payment}
                        </Text>
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noDetailsText}>
                    No Additional Amounts
                  </Text>
                )}

                <Text style={styles.sectionTitle}>Unpaid Details</Text>
                <Text>
                  Total Unpaid:{" "}
                  {data.unpaid?.reduce(
                    (acc, item) => acc + parseInt(item.payment),
                    0
                  )}
                </Text>
                {data.unpaid?.length > 0 ? (
                  data.unpaid.map((item, index) => (
                    <View key={index} style={styles.itemContainer}>
                      <Text style={styles.itemText}>
                        Location:
                        <Text style={{ fontWeight: "bold" }}>
                          {item.location}
                        </Text>
                      </Text>
                      <Text style={styles.itemText}>
                        Payment:
                        <Text style={{ fontWeight: "bold" }}>
                          {item.payment}
                        </Text>
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noDetailsText}>No Unpaid Details</Text>
                )}
              </View>

              <View style={styles.rightGrid}>
                <Text style={styles.modalTitle}>Summary</Text>
                <Text style={styles.summaryText}>
                  Total Payment:{" "}
                  <Text style={{ fontWeight: "bold" }}> {totalPayment}</Text>{" "}
                  PKR
                </Text>
                <Text style={styles.summaryText}>
                  Total Expenses:{" "}
                  <Text style={{ fontWeight: "bold" }}> {totalExpenses}</Text>{" "}
                  PKR
                </Text>
                <Text style={styles.summaryText}>
                  Unpaid Total:{" "}
                  <Text style={{ fontWeight: "bold" }}> {totalUnpaids}</Text>{" "}
                  PKR
                </Text>
                <Text style={styles.summaryText}>
                  Remaining:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {" "}
                    {totalPayment - totalExpenses}
                  </Text>{" "}
                  PKR
                </Text>
                <Text style={styles.summaryText}>
                  Cost per Person:{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {" "}
                    {isFinite(totalExpenses / totalPerson)
                      ? parseInt(totalExpenses / totalPerson)
                      : 0}{" "}
                  </Text>
                  PKR
                </Text>
              </View>
            </View>
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    height: "90%",
  },
  gridsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftGrid: {
    flex: 1,
    marginRight: 10,
  },
  rightGrid: {
    flex: 1,
    marginLeft: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  itemContainer: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 10,
  },
  itemText: {
    fontSize: 16,
  },
  noDetailsText: {
    fontSize: 16,
    color: "#888",
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    alignItems: "center",
  },
  closeButtonText: {
    color: "blue",
    fontSize: 16,
  },
});

export default SheetViewModal;
