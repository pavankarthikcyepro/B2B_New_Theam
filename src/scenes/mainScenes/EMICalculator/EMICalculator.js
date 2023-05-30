import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
} from "react-native";
import { Colors, GlobalStyle } from '../../../styles';
import { TextinputComp } from '../../../components/textinputComp';
import { useDispatch, useSelector } from 'react-redux';
import { clearEmiCalculatorData, sentEmiCalculate, setInputDetails } from '../../../redux/emiCalculatorReducer';
import Slider from "@react-native-community/slider";
import { ButtonComp, LoaderComponent } from '../../../components';
import { showToast } from '../../../utils/toast';

const minLoanAmount = 10000;
const maxLoanAmount = 20000000;

const minInterestRate = 5;
const maxInterestRate = 20;

const minLoanTenure = 1;
const maxLoanTenure = 10;
const rupeeSign = "\u20B9";

const EMICalculator = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const selector = useSelector((state) => state.emiCalculatorReducer);

  useEffect(() => {
    return () => {
      // dispatch(clearEmiCalculatorData());
    };
  }, []);

  const onSliderValueChange = (value, type) => {
    if (type == "loanAmount") {
      dispatch(setInputDetails({ key: "LOAN_AMOUNT", text: value }));
    } else if (type == "interestRate") {
      dispatch(setInputDetails({ key: "INTEREST_RATE", text: value }));
    } else if (type == "loanTenure") {
      dispatch(setInputDetails({ key: "LOAN_TENURE", text: value }));
    }
  };

  const onCalculate = () => {
    Keyboard.dismiss();
    if (selector.loanAmount < minLoanAmount) {
      showToast(`Please enter minimum loan amount ${minLoanAmount}`);
      return;
    }
    if (selector.loanAmount > maxLoanAmount) {
      showToast(`Please enter maximum loan amount ${maxLoanAmount}`);
      return;
    }

    if (selector.interestRate < minInterestRate) {
      showToast(`Please enter minimum interest rate ${minInterestRate}`);
      return;
    }
    if (selector.interestRate > maxInterestRate) {
      showToast(`Please enter maximum interest rate ${maxInterestRate}`);
      return;
    }

    if (selector.loanTenure < minLoanTenure) {
      showToast(`Please enter minimum loan tenure ${minLoanTenure} year`);
      return;
    }
    if (selector.loanTenure > maxLoanTenure) {
      showToast(`Please enter maximum loan tenure ${maxLoanTenure} year`);
      return;
    }

    let payload = {
      loanAmount: selector.loanAmount,
      interestRate: selector.interestRate,
      tenure: selector.loanTenure,
    };

    dispatch(sentEmiCalculate(payload));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        enabled
        keyboardVerticalOffset={100}
      >
        <ScrollView
          automaticallyAdjustContentInsets={true}
          bounces={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 10 }}
          style={{ flex: 1 }}
        >
          <View style={styles.mainInputContainer}>
            <TextinputComp
              style={styles.textInputComp}
              value={`${selector.loanAmount}`}
              label={"Loan Amount*"}
              keyboardType={"number-pad"}
              maxLength={8}
              onChangeText={(text) =>
                dispatch(setInputDetails({ key: "LOAN_AMOUNT", text: text }))
              }
            />
            <View style={styles.sliderMainContainer}>
              <Slider
                style={styles.sliderContainer}
                value={
                  selector.loanAmount
                    ? Number(selector.loanAmount)
                    : minLoanAmount
                }
                minimumValue={minLoanAmount}
                maximumValue={maxLoanAmount}
                thumbTintColor={Colors.PINK}
                minimumTrackTintColor={Colors.PINK}
                maximumTrackTintColor={Colors.LIGHT_GRAY2}
                step={1}
                onValueChange={(value) =>
                  onSliderValueChange(value, "loanAmount")
                }
              />
              <View style={styles.sliderMinMaxRow}>
                <Text>{`${rupeeSign}${minLoanAmount}`}</Text>
                <Text>{`${rupeeSign}${maxLoanAmount}`}</Text>
              </View>
            </View>
            <TextinputComp
              style={styles.textInputComp}
              value={`${selector.interestRate}`}
              label={"Interest Rate*"}
              keyboardType={"decimal-pad"}
              maxLength={5}
              onChangeText={(text) =>
                dispatch(setInputDetails({ key: "INTEREST_RATE", text: text }))
              }
            />
            <View style={styles.sliderMainContainer}>
              <Slider
                style={styles.sliderContainer}
                value={
                  selector.interestRate
                    ? Number(selector.interestRate)
                    : minInterestRate
                }
                minimumValue={minInterestRate}
                maximumValue={maxInterestRate}
                thumbTintColor={Colors.PINK}
                minimumTrackTintColor={Colors.PINK}
                maximumTrackTintColor={Colors.LIGHT_GRAY2}
                step={0.5}
                onValueChange={(value) =>
                  onSliderValueChange(value, "interestRate")
                }
              />
              <View style={styles.sliderMinMaxRow}>
                <Text>{`${minInterestRate}%`}</Text>
                <Text>{`${maxInterestRate}%`}</Text>
              </View>
            </View>
            <TextinputComp
              style={styles.textInputComp}
              value={`${selector.loanTenure}`}
              label={"Loan Tenure*"}
              keyboardType={"number-pad"}
              maxLength={2}
              onChangeText={(text) =>
                dispatch(setInputDetails({ key: "LOAN_TENURE", text: text }))
              }
            />
            <View style={styles.sliderMainContainer}>
              <Slider
                style={styles.sliderContainer}
                value={
                  selector.loanTenure
                    ? Number(selector.loanTenure)
                    : minLoanTenure
                }
                minimumValue={minLoanTenure}
                maximumValue={maxLoanTenure}
                thumbTintColor={Colors.PINK}
                minimumTrackTintColor={Colors.PINK}
                maximumTrackTintColor={Colors.LIGHT_GRAY2}
                step={0.5}
                onValueChange={(value) =>
                  onSliderValueChange(value, "loanTenure")
                }
              />
              <View style={styles.sliderMinMaxRow}>
                <Text>{`${minLoanTenure} year`}</Text>
                <Text>{`${maxLoanTenure} year`}</Text>
              </View>
            </View>
          </View>
          <View style={styles.btnContainer}>
            <View style={styles.individualBtnContainer}>
              <ButtonComp
                title={"CLEAR"}
                width={"100%"}
                onPress={() => {
                  dispatch(clearEmiCalculatorData());
                }}
                style={{ backgroundColor: Colors.WHITE }}
                labelStyle={{ color: Colors.PINK }}
              />
            </View>
            <View style={styles.individualBtnContainer}>
              <ButtonComp
                title={"CALCULATE"}
                width={"100%"}
                onPress={() => onCalculate()}
              />
            </View>
          </View>

          <View style={styles.emiAmtRow}>
            <Text style={styles.emiRowText}>EMI Amt:</Text>
            <Text style={styles.emiRowText}>{`${rupeeSign}${
              selector.emiResponse?.emiPerMonth ?? "0"
            }`}</Text>
          </View>

          <View style={styles.resultContainer}>
            <View style={styles.emiResultRow}>
              <Text style={styles.emiResultRowText}>Principle Amt:</Text>
              <Text style={styles.emiResultRowText}>{`${rupeeSign}${
                selector.emiResponse ? selector.loanAmount : "0"
              }`}</Text>
            </View>

            <View style={styles.emiResultRow}>
              <Text style={styles.emiResultRowText}>Total Interest:</Text>
              <Text style={styles.emiResultRowText}>{`${rupeeSign}${
                selector.emiResponse?.totalInterest ?? "0"
              }`}</Text>
            </View>

            <View style={styles.emiResultRow}>
              <Text style={styles.emiResultRowText}>Total Amt Payble:</Text>
              <Text style={styles.emiResultRowText}>{`${rupeeSign}${
                selector.emiResponse?.totalPayment ?? "0"
              }`}</Text>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <LoaderComponent visible={selector.isLoading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainInputContainer: { backgroundColor: Colors.WHITE, paddingBottom: 15 },
  textInputComp: {
    height: 50,
  },
  sliderMainContainer: {},
  sliderContainer: {
    height: 50,
    width: "95%",
    alignSelf: "center",
  },
  sliderMinMaxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  btnContainer: {
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  individualBtnContainer: {
    width: "45%",
  },
  resultContainer: {
    paddingVertical: 10,
  },

  emiAmtRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 5,
    ...GlobalStyle.shadow,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  emiResultRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: Colors.TARGET_GRAY,
  },
  emiRowText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
    color: Colors.PINK,
  },
  emiResultRowText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.DARK_GRAY,
  },

  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  resultRowTitleText: {
    fontSize: 16,
    fontWeight: "bold",
    width: "50%",
    marginLeft: 5,
  },
  textResultInputComp: {
    marginVertical: 5,
    marginRight: 5,
    height: 50,
    width: "45%",
    borderRadius: 5,
  },
});

export default EMICalculator;