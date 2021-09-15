
// Production Urls:

// export const hrms_url = "http://ec2-3-109-35-105.ap-south-1.compute.amazonaws.com:8083/hrms";
// export const ops_url = "http://ec2-3-108-253-173.ap-south-1.compute.amazonaws.com:8085/ops";
// export const roleManagement_url = "http://ec2-3-109-35-105.ap-south-1.compute.amazonaws.com:8084/role-management";
// export const sales_url = "http://ec2-3-7-117-218.ap-south-1.compute.amazonaws.com:8081/sales";
// export const inventory_url = "http://ec2-3-108-253-173.ap-south-1.compute.amazonaws.com:8086/inventory";
// export const vehicleServices_url = "http://ec2-3-7-117-218.ap-south-1.compute.amazonaws.com:8085/vehicle-services";
// export const admin_url = "http://ec2-3-7-117-218.ap-south-1.compute.amazonaws.com:8082/admin";
// export const notificationServices_url = "http://ec2-3-108-253-173.ap-south-1.compute.amazonaws.com:8083/notification-service";
// export const vehicleInfoService_url = "http://ec2-3-109-35-105.ap-south-1.compute.amazonaws.com:8082/vehicle-information-service";
// export const customerService_url = "http://ec2-3-108-253-173.ap-south-1.compute.amazonaws.com:8084/customer-service";

// Dev Urls:

//New End Points July21 20 for Dev  Server
export const hrms_url = "http://ec2-3-109-35-105.ap-south-1.compute.amazonaws.com:8083/hrms";
export const sales_url = "http://ec2-3-7-117-218.ap-south-1.compute.amazonaws.com:8081/sales";
export const roleManagement_url = "http://ec2-3-109-35-105.ap-south-1.compute.amazonaws.com:8084/role-management";
export const vehicleInfoService_url = "http://ec2-3-109-35-105.ap-south-1.compute.amazonaws.com:8082/vehicle-information-service";

export const ops_url = "http://ec2-3-108-253-173.ap-south-1.compute.amazonaws.com:8085/ops";
export const inventory_url = "http://ec2-3-108-253-173.ap-south-1.compute.amazonaws.com:8086/inventory";
export const vehicleServices_url = "http://ec2-3-7-117-218.ap-south-1.compute.amazonaws.com:8085/vehicle-services";
export const admin_url = "http://ec2-3-7-117-218.ap-south-1.compute.amazonaws.com:8082/admin";
export const notificationServices_url = "http://ec2-3-108-253-173.ap-south-1.compute.amazonaws.com:8083/notification-service";
export const customerService_url = "http://ec2-3-108-253-173.ap-south-1.compute.amazonaws.com:8084/customer-service";

const URL = {
    LOGIN: () => hrms_url + "/emplogin",
    LEADS_LIST_API: () => sales_url + "/lead/all",
    MENULIST_API: (userName) => {
        return roleManagement_url + "/user/" + userName;
    },
    VEHICLE_MODELS: (orgId) => {
        return vehicleInfoService_url + "/api/vehicle_details/?organizationId=" + orgId;
    },
    CUSTOMER_TYPE: () => sales_url + "/master-data/customertype",
    MY_TASKS: () => sales_url + "/workflow/assignedTasks?",
    CONTACT_DETAILS: (universalId) => {
        return sales_url + "/lead/id/" + universalId;
    },
    NO_THANKS: (leadId) => {
        return roleManagement_url + `/nothanks?leadId=${leadId}`;
    },
    TASKS_PRE_ENQUIRY: () => sales_url + '/workflow/lead/universalId/',
    ASSIGN_TASK: () => sales_url + "/dms/task",
    CHANGE_ENQUIRY_STATUS: () => sales_url + "/dms/lead/stage/",
    SOURCE_OF_ENQUIRY_ENQUIRY: (sourceOfEnquiryId) => {
        return sales_url + "/employees/source-of-enquiry/" + `${sourceOfEnquiryId}`
    },
    SALES_CONSULTANT: () => sales_url + "/lead/sales-consultant/manual",
    CREATE_CONTACT: () => sales_url + "",
    ENQUIRY_DETAILS: (universalId) => {
        return sales_url + "/enquiry/lead/id/" + `${universalId}`;
    },
    UPDATE_ENQUIRY_DETAILS: () => sales_url + "/enquiry/lead",
    GET_CUSTOMER_TYPES: () => sales_url + "/master-data/customertype",
    DROP_ENQUIRY: () => sales_url + "/lead-drop",
    UPLOAD_DOCUMENT: () => sales_url + "/documents",
    GET_ON_ROAD_PRICE_AND_INSURENCE_DETAILS: (varientId, vehicleId) => {
        return vehicleInfoService_url + `/api/vehicle_on_road_prices/${varientId}/${vehicleId}`;
    },
    GET_PAID_ACCESSORIES_LIST: (orgId) => {
        return inventory_url + `/inventory/accessories/${orgId}?pageNo=0&pageSize=1000`
    }
}

export default URL;