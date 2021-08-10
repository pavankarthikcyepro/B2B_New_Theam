import Realm from "realm";
import * as AsyncStore from "../asyncStore";

class PreEnquirySchema extends Realm.Object { }
PreEnquirySchema.schema = {
    name: "PRE_ENQUIRY_TABLE",
    properties: {
        "universalId": "string",
        "leadId": "int",
        "firstName": "string",
        "lastName": "string",
        "createdDate": "int",
        "dateOfBirth": "string?",
        "enquirySource": "string",
        "enquiryDate": "int",
        "model": "string",
        "enquirySegment": "string",
        "phone": "string",
        "leadStage": "string",
        "customerType": "string",
        "alternativeNumber": "string",
        "enquiryCategory": "string?",
        "createdBy": "string",
        "salesConsultant": "string?",
        "email": "string",
        "leadStatus": "string?"
    }
}

class CucstomerSchema extends Realm.Object { }
CucstomerSchema.schema = {
    name: "CUSTOMER_TYPE_TABLE",
    properties: {
        id: "int",
        name: "string"
    }
}

class CarModalSchema extends Realm.Object { }
CarModalSchema.schema = {
    name: "CAR_MODAL_LIST_TABLE",
    properties: {
        id: "int",
        name: "string"
    }
}


const getUserName = async () => {
    let name = await AsyncStore.getData(AsyncStore.Keys.USER_NAME);
    if (!name) {
        name = 'TEST_USER';
    }
    console.log('name: ', name);
    return name;
}

// "0001"

let realm = new Realm({
    path: "NEW_B2B_APP" + "_" + getUserName(),
    schema: [PreEnquirySchema, CucstomerSchema, CarModalSchema],
    schemaVersion: 1
});

export default realm;