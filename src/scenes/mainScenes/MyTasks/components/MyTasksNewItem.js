import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Colors } from "../../../../styles";
import {
  convertTimeStampToDateString,
  callNumber,
  navigatetoCallWebView,
  sendWhatsApp,
} from "../../../../utils/helperFunctions";
import { IconButton } from "react-native-paper";
import moment from "moment";
import { AppNavigator, AuthNavigator } from "../../../../navigations";
import * as AsyncStore from "../../../../asyncStore";
import { showToastRedAlert } from "../../../../utils/toast";
import {
  VIP_ICON,
  VIP_ICON2,
  VIP_ICON3,
  VIP_ICON4,
  VIP_ICON5,
} from "../../../../assets/icon";

const statusBgColors = {
  CANCELLED: {
    color: Colors.RED,
    title: "Cancelled",
  },
  CLOSED: {
    color: Colors.GREEN_V2,
    title: "Closed",
  },
  ASSIGNED: {
    color: Colors.GREEN,
    title: "Assigned",
  },
  SENT_FOR_APPROVAL: {
    color: Colors.YELLOW,
    title: "Sent For Approval",
  },
  RESCHEDULED: {
    color: Colors.BLUE,
    title: "Rescheduled",
  },
};

const IconComp = ({ iconName, onPress, opacity = 1 }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          width: 32,
          height: 32,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#002C5F",
          borderRadius: 5,
          opacity,
        }}
      >
        <IconButton icon={iconName} color={Colors.GREEN} size={17} />
      </View>
    </TouchableOpacity>
  );
};

const callWebViewRecord = async ({ navigator, phone, uniqueId, type }) => {
  try {
    let extensionId = await AsyncStore.getData(AsyncStore.Keys.EXTENSION_ID);
    var password = await AsyncStore.getData(AsyncStore.Keys.EXTENSSION_PWD);
    password = await encodeURIComponent(password);
    var uri =
      "https://ardemoiipl.s3.ap-south-1.amazonaws.com/call/webphone/click2call.html?u=" +
      extensionId +
      "&p=" +
      password +
      "&c=" +
      phone +
      "&type=" +
      type +
      "&uniqueId=" +
      uniqueId;

    // await alert("phone" + phone + "  type" + type + "  uniqueId" + uniqueId + "  userName" + extensionId + "  pwd " + password)
    //alert(uri)
    if (extensionId && extensionId != null && extensionId != "") {
      var granted = await navigatetoCallWebView();

      if (granted) {
        navigator.navigate(AppNavigator.EmsStackIdentifiers.webViewComp, {
          phone: phone,
          type: type,
          uniqueId: uniqueId,
          userName: extensionId,
          password: password,
          url: uri,
        });
      }
    } else callNumber(phone);
    // alert(phone + uniqueId + "/" + type + "/" + password)
  } catch (error) {}
};

export const MyTaskNewItem = ({
  from = "MY_TASKS",
  navigator,
  type,
  uniqueId = "",
  name,
  status,
  created,
  dmsLead,
  phone,
  source,
  model,
  leadStatus = "",
  leadStage = "",
  needStatus = "",
  enqCat = "",
  onItemPress,
  onDocPress,
  stageAccess,
  onlylead = false,
  EmployeesRoles,
  userData,
  tdflage = "",
  hvflage = "",
  showTdHvHighLight = false,
  updatedOn,
  IsVip = false,
  IsHni = false,
}) => {
  let date = "";
  if (from == "MY_TASKS") {
    date = moment(updatedOn, "YYYY-MM-DD hh-mm-s").format("DD/MM/YYYY h:mm a");
  } else {
    date = convertTimeStampToDateString(created);
  }

  let bgColor = Colors.BLUE;
  let statusName = status;
  if (
    status === "CANCELLED" ||
    status === "ASSIGNED" ||
    status === "SENT_FOR_APPROVAL" ||
    status === "CLOSED" ||
    status === "RESCHEDULED"
  ) {
    bgColor = statusBgColors[status].color;
    statusName = statusBgColors[status].title;
  }

  function getStageColor(leadStage, leadStatus) {
    return leadStatus === "PREENQUIRYCOMPLETED" ||
      (leadStatus === "ENQUIRYCOMPLETED" && leadStage === "ENQUIRY") ||
      (leadStatus === "PREBOOKINGCOMPLETED" && leadStage === "PREBOOKING") ||
      (leadStatus === "PREDELIVERYCOMPLETED" && leadStage === "PREDELIVERY") ||
      (leadStatus === "INVOICECOMPLETED" && leadStage === "INVOICE") ||
      (leadStatus === "DELIVERYCOMPLETED" && leadStage === "DELIVERY") ||
      (leadStatus === "BOOKINGCOMPLETED" && leadStage === "BOOKING")
      ? "#18a835"
      : "#f29a22";
  }
  function getCategoryTextColor(cat) {
    let color = "#7b79f6";
    if (!cat) {
      return color;
    }
    switch (cat.toLowerCase()) {
      case "hot":
        color = Colors.RED;
        break;
      case "warm":
        color = "#7b79f6";
        break;
      case "cold":
        color = Colors.LIGHT_GRAY2;
        break;
    }
    return color;
  }

  const cannotEditLead = () => {
    const leadStages = ["INVOICE", "DELIVERY", "PREDELIVERY"];
    return leadStages.includes(leadStage);
  };

  return (
    <TouchableOpacity
      onPress={onItemPress}
      style={{
        ...styles.section,
        borderLeftWidth: IsVip || IsHni ? 3 : 0,
        borderLeftColor: Colors.RED,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
        }}
      >
        <View style={{ width: "65%" }}>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                maxWidth: "73%",
                flexDirection: "row",
                alignItems: "flex-end",
                position: "relative",
                paddingTop: 5,
              }}
            >
              <Text style={styles.text1}>{name}</Text>
              <View style={styles.badgeContainer}>
                {/* <Text style={styles.badgeText}>{"VIP"}</Text> */}
                {/* {IsVip && <Image
                  source={VIP_ICON2}
                  style={{
                    width: 25,
                    height: 25,
                    // top: 0,
                    right: -25,
                    position: "absolute",
                    zIndex: 1000,
                  }}
                  resizeMode={"contain"}
                />} */}
              </View>
            </View>
            {/*<Text style={styles.catText}>{enqCat}</Text>*/}
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <Text style={styles.text2}>{date}</Text>

              <Text style={styles.text2}>{source + " - " + dmsLead}</Text>
              <Text style={styles.text2}>{phone}</Text>
            </View>
            <View>
              {/* {true && (
                <Image
                  source={VIP_ICON5}
                  style={{
                    width: 36,
                    height: 36,
                    marginRight: 5,
                  }}
                  resizeMode={"contain"}
                />
              )} */}
            </View>
          </View>

          <>
            {from !== "PRE_ENQUIRY" && (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {/* {showTdHvHighLight ? (
                  <View style={styles.tdHvRow}>
                    <View style={styles.tdHvContainer}>
                      {tdflage == "CLOSED" ? (
                        <IconButton
                          icon={"check-all"}
                          size={12}
                          color={Colors.PINK}
                          style={{ margin: 0 }}
                        />
                      ) : null}
                      <Text style={styles.tdHvText}>TD</Text>
                    </View>
                    <View style={styles.tdHvDivider} />
                    <View style={styles.tdHvContainer}>
                      {hvflage == "CLOSED" ? (
                        <IconButton
                          icon={"check-all"}
                          size={12}
                          color={Colors.PINK}
                          style={{ margin: 0 }}
                        />
                      ) : null}
                      <Text style={styles.tdHvText}>HV</Text>
                    </View>
                  </View>
                ) : null} */}

                {showTdHvHighLight &&
                (tdflage == "CLOSED" || hvflage == "CLOSED") ? (
                  <View style={styles.tdHvRow}>
                    {tdflage == "CLOSED" ? (
                      <View style={styles.tdHvContainer}>
                        <Text style={styles.tdHvText}>TD</Text>
                      </View>
                    ) : null}

                    {tdflage == "CLOSED" && hvflage == "CLOSED" ? (
                      <View style={styles.tdHvDivider} />
                    ) : null}

                    {hvflage == "CLOSED" ? (
                      <View style={styles.tdHvContainer}>
                        <Text style={styles.tdHvText}>HV</Text>
                      </View>
                    ) : null}
                  </View>
                ) : null}

                <>
                  {leadStage == "ENQUIRY" &&
                    enqCat !== "" &&
                    enqCat?.length > 0 && (
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={[
                            styles.text3,
                            { color: getCategoryTextColor(enqCat) },
                          ]}
                        >
                          {enqCat}
                        </Text>
                        <Text
                          style={{ fontWeight: "600", color: Colors.BLACK }}
                        >
                          {" "}
                          |{" "}
                        </Text>
                      </View>
                    )}
                </>
                {leadStage ? (
                  <Text
                    style={[
                      styles.text3,
                      { color: getStageColor(leadStage, leadStatus) },
                    ]}
                  >
                    {leadStage === "PREBOOKING"
                      ? "BOOKING APPROVAL"
                      : leadStage}
                  </Text>
                ) : null}
              </View>
            )}
          </>
          {(status === "CANCELLED" || status === "CLOSED") && (
            <Text style={[styles.text2, { color: bgColor }]}>{statusName}</Text>
          )}
        </View>
        <View style={{ width: "35%", alignItems: "center", paddingTop: 10 }}>
          {(IsVip || IsHni) && (
            <View style={styles.vipHniRow}>
              {IsVip && <Text style={styles.badgeText}>{"VIP"}</Text>}
              {IsVip && IsHni && <View style={styles.vipHniDivider} />}
              {IsHni && <Text style={styles.badgeText}>{"HNI"}</Text>}
            </View>
          )}
          {uniqueId ? (
            <Text style={styles.leadIdText}>Lead ID : {uniqueId}</Text>
          ) : null}
          <View style={styles.modal}>
            <Text numberOfLines={2} style={styles.text4}>
              {model}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <IconComp
              iconName={"format-list-bulleted-square"}
              disabled={true}
              opacity={cannotEditLead() ? 0.5 : 1}
              onPress={() => {
                if (onlylead) {
                  let user = userData.toLowerCase();
                  if (EmployeesRoles.includes(user)) {
                    if (stageAccess[0]?.viewStage?.includes(leadStage)) {
                      cannotEditLead()
                        ? showToastRedAlert("You don't have Permission")
                        : onDocPress();
                    } else {
                      alert("No Access");
                    }
                  } else {
                    cannotEditLead()
                      ? showToastRedAlert("You don't have Permission")
                      : onDocPress();
                  }
                } else {
                  cannotEditLead()
                    ? showToastRedAlert("You don't have Permission")
                    : onDocPress();
                }
              }}
            />
            <View style={{ padding: 5 }} />
            <IconComp
              iconName={"phone-outline"}
              onPress={() => {
                // if (from == "MY_TASKS") {
                //   navigator.navigate(
                //     AppNavigator.MyTasksStackIdentifiers.webCallScreen,
                //     {
                //       phone,
                //       uniqueId,
                //     }
                //   );
                // } else {
                  callWebViewRecord({
                    navigator,
                    phone,
                    uniqueId,
                    type,
                  });
                // }
                return;
                if (onlylead) {
                  let user = userData.toLowerCase();
                  if (EmployeesRoles.includes(user)) {
                    if (stageAccess[0]?.viewStage?.includes(leadStage)) {
                      callWebViewRecord({
                        navigator,
                        phone,
                        uniqueId,
                        type,
                      });
                    } else {
                      alert("No Access");
                    }
                  } else {
                    callWebViewRecord({
                      navigator,
                      phone,
                      uniqueId,
                      type,
                    });
                  }
                } else {
                  callWebViewRecord({
                    navigator,
                    phone,
                    uniqueId,
                    type,
                  });
                }
                // cannotEditLead() ?
                //     showToastRedAlert("You don't have Permission") :
              }}
            />
            <View style={{ padding: 5 }} />
            <IconComp
              iconName={"whatsapp"}
              onPress={
                () => {
                  sendWhatsApp(phone);
                  // if (onlylead) {
                  //   let user = userData.toLowerCase();
                  //   if (EmployeesRoles.includes(user)) {
                  //     if (stageAccess[0]?.viewStage?.includes(leadStage)) {
                  //       sendWhatsApp(phone);
                  //     } else {
                  //       alert("No Access");
                  //     }
                  //   } else {
                  //     sendWhatsApp(phone);
                  //   }
                  // } else {
                  //   sendWhatsApp(phone);
                  // }
                }

                // cannotEditLead() ? showToastRedAlert("You don't have Permission") :
              }
            />
          </View>
        </View>
      </View>
      {/* {IsVip && (
        <Image
          source={VIP_ICON}
          style={{
            width: 40,
            height: 40,
            top: -15,
            right: -10,
            position: "absolute",
            zIndex: 1000,
          }}
          resizeMode={"contain"}
        />
      )} */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text1: {
    color: Colors.BLACK,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 5,
  },
  text2: {
    color: Colors.BLACK,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
  },
  leadIdText: {
    color: Colors.BLACK,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
  },
  text3: {
    color: Colors.DARK_GRAY,
    fontSize: 12,
    fontWeight: "600",
  },
  text4: {
    color: Colors.WHITE,
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 2,
  },
  section: {
    // flex: 1,
    // padding: 5,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 3,
    marginHorizontal: 5,
    marginVertical: 6,
    position: "relative",
  },
  modal: {
    backgroundColor: Colors.RED,
    borderRadius: 4,
    width: "100%",
    minHeight: 21,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  catText: {
    color: "#7b79f6",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 5,
    marginLeft: 5,
    textTransform: "uppercase",
  },
  tdHvRow: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 5,
  },
  tdHvContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 24,
    width: 24,
    borderRadius: 24 / 2,
    borderColor: "#18a835",
    // borderColor: Colors.DARK_GREEN,
    borderWidth: 2,
  },
  tdHvText: {
    fontSize: 10,
    color: Colors.GRAY,
  },
  tdHvDivider: {
    height: 12,
    width: 1,
    backgroundColor: Colors.PINK,
    marginHorizontal: 5,
  },
  testDriveIconImage: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  badgeContainer: {
    marginLeft: 3,
    bottom: 4,
    alignSelf: "flex-start",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { fontSize: 15, color: Colors.PINK, fontWeight: "bold" },
  vipHniRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  vipHniDivider: {
    width: 1.5,
    height: "80%",
    backgroundColor: Colors.BLACK,
    marginHorizontal: 5
  },
});
