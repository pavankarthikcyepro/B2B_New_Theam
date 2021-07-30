
const BASE_URL_1 = "http://ec2-13-232-91-189.ap-south-1.compute.amazonaws.com:8083";
const BASE_URL_2 = "http://ec2-65-1-56-2.ap-south-1.compute.amazonaws.com:8081";
const BASE_URL_3 = "http://ec2-13-232-91-189.ap-south-1.compute.amazonaws.com:8084";
const BASE_URL_4 = "http://ec2-13-232-91-189.ap-south-1.compute.amazonaws.com:8082";

const URL = {
    LOGIN: () => BASE_URL_1 + "/hrms/emplogin",
    LEADS_LIST_API: () => BASE_URL_2 + "/sales/lead/all",
    MENULIST_API: (userName) => {
        return BASE_URL_3 + "/role-management/user/" + userName;
    },
    VEHICLE_MODELS: (orgId) => {
        return BASE_URL_4 + "/vehicle-information-service/api/vehicle_details/?organizationId=" + orgId;
    },
    CUSTOMER_TYPE: () => BASE_URL_2 + "/sales/master-data/customertype",
}

export default URL;