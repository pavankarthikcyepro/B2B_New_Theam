
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
// export const dynamicForms = "http://ec2-3-109-65-7.ap-south-1.compute.amazonaws.com:8083/dynamic-forms"

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
export const dynamicReports_url = "http://ec2-3-109-65-7.ap-south-1.compute.amazonaws.com:8083/dynamic-reports";
export const dynamicForms = "http://ec2-3-109-65-7.ap-south-1.compute.amazonaws.com:8083/dynamic-forms";

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
    },
    GET_ON_ROAD_PRICE_DTO_LIST: (leadId) => {
        return sales_url + `/on-road-price/lead/${leadId}`
    },
    SEND_ON_ROAD_PRICE_DETAILS: () => sales_url + "/on-road-price",
    GET_ALL_OFFERS: (varientId, vehicleId) => {
        return ops_url + "/api/allofferdetail" + `?varientId=${varientId}&vehicleId=${vehicleId}`
    },
    GET_TASK_DETAILS: (taskId) => {
        return sales_url + `/workflow/task/${taskId}`;
    },
    GET_TEST_DRIVE_DSE_LIST: () => roleManagement_url + "/user/role/name/Testdrive_DSE",
    GET_DRIVERS_LIST: () => roleManagement_url + "/user/role/name/Driver",
    GET_TEST_DRIVE_VEHICLES: (branchId, orgId) => {
        return inventory_url + `/demoVehicle/vehicles?branchId=${branchId}&orgId=${orgId}&type=TESTDRIVE`
    },
    GET_CURRENT_TASK_LIST: () => {
        return sales_url + `/task-history/current-day-task?`;
    },
    GET_FEATURE_PENDING_TASK_LIST: (empId, offset) => {
        return sales_url + `/task-history/future-or-past-tasks?`;
    },
    BOOK_TEST_DRIVE_APPOINTMENT: () => ops_url + "/testdrive/appointment",
    UPDATE_TEST_DRIVE_TASK: () => sales_url + "/dms/updateTestDriveTask",
    GET_TEST_DRIVE_APPOINTMENT_DETAILS: (entityModuleId, branchId, orgId) => {
        return ops_url + `/testdrive/history?branchId=${branchId}&filterType=TESTDRIVE&filterVal=${entityModuleId}&orgId=${orgId}`
    },
    VALIDATE_TEST_DRIVE_DATE: (date, vehicleId) => {
        return inventory_url + `/allotment/vehicle/allotments?allotmentDate=${date}&id=${vehicleId}`
    },
    CUSTOMER_LEAD_REFERENCE: () => sales_url + "/lead-customer-reference",
    GET_COMPLAINTS: () => dynamicReports_url + "/v2-generate-query",
    GET_EVENTS: () => {
        return ops_url + `/dms/getAllServiceEventsByFilter`;
    },
    GET_SOURCE_OF_ENQUIRY: () => {
        return sales_url + "/master-data/source-of-enquiry";
    },
    GET_DROP_DATA: () => {
        return dynamicForms + "/dropdown";
    },
    PRE_BOOKING_PAYMENT: () => {
        return sales_url + "/payment";
    },
    BOOKING_AMOUNT: () => {
        return sales_url + "/booking-amount";
    },
    GET_PRE_BOOKING_PAYMENT_DETAILS: (leadId) => {
        return sales_url + `/payment?leadId=${leadId}`;
    },
    GET_BOOKING_AMOUNT_DETAILS: (leadId) => {
        return sales_url + `/booking-amount/lead/${leadId}`;
    },
    GET_ASSIGNED_TASKS_AT_PRE_BOOKING: (universalId) => {
        return sales_url + `/workflow/lead/stage/${universalId}`;
    },
    GET_EVENT_LIST: (startDate, endDate, empId) => {
        return ops_url + `/dms/getAllServiceEventsByFilterWithoutPagination?startdate=${startDate}&enddate=${endDate}&organiserid=${empId}`;
    }
}

export default URL;