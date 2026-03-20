const environment = "localhost"; // "dev" = staging (tngis) | "prod" | "stagingLocal" = local WAMP API

const baseUrls = {
    // Remote staging – deploy fixed fn_otp_operation.php here to fix "Invalid OTP" for first-time numbers
    // dev: "https://tngis.tnega.org/medical_indent_api/v1",
    localhost: 'http://192.168.4.251/lcap/medical_indent_api/v1',
    prod: "https://imhayush.tn.gov.in/medical_indent_api/v1",
};

const BASE_API_URL = baseUrls[environment];
const BASE_UPLOAD_URL = BASE_API_URL.replace(/\/v1$/, '') + "/uploads/";



