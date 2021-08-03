
// Production Urls:

export const hrms_url = "http://ec2-3-109-35-105.ap-south-1.compute.amazonaws.com:8083/hrms";
export const ops_url = "http://ec2-3-108-253-173.ap-south-1.compute.amazonaws.com:8085/ops";
export const roleManagement_url = "http://ec2-3-109-35-105.ap-south-1.compute.amazonaws.com:8084/role-management";
export const sales_url = "http://ec2-3-7-117-218.ap-south-1.compute.amazonaws.com:8081/sales";
export const inventory_url = "http://ec2-3-108-253-173.ap-south-1.compute.amazonaws.com:8086/inventory";
export const vehicleServices_url = "http://ec2-3-7-117-218.ap-south-1.compute.amazonaws.com:8085/vehicle-services";
export const admin_url = "http://ec2-3-7-117-218.ap-south-1.compute.amazonaws.com:8082/admin";
export const notificationServices_url = "http://ec2-3-108-253-173.ap-south-1.compute.amazonaws.com:8083/notification-service";
export const vehicleInfoService_url = "http://ec2-3-109-35-105.ap-south-1.compute.amazonaws.com:8082/vehicle-information-service";
export const customerService_url = "http://ec2-3-108-253-173.ap-south-1.compute.amazonaws.com:8084/customer-service";

// Dev Urls:

// export const hrms_url = "http://ec2-13-232-91-189.ap-south-1.compute.amazonaws.com:8083/hrms";
// export const sales_url = "http://ec2-65-1-56-2.ap-south-1.compute.amazonaws.com:8081/sales";
// export const roleManagement_url = "http://ec2-13-232-91-189.ap-south-1.compute.amazonaws.com:8084/role-management";
// export const vehicleInfoService_url = "http://ec2-13-232-91-189.ap-south-1.compute.amazonaws.com:8082/vehicle-information-service";

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
}

export default URL;