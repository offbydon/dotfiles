// Constants
var POSTMAN_WEB_URL_PRODUCTION = "https://www.getpostman.com";
var POSTMAN_WEB_URL_STAGING = "https://stage.getpostman.com";
var POSTMAN_WEB_URL_DEV = "http://dev.getpostman.com";
var POSTMAN_WEB_URL_LOCAL = "http://dev.getpostman.com";
var POSTMAN_WEB_URL_SYNC_STAGE = "https://sync-staging.getpostman.com";
var POSTMAN_WEB_URL_SYNC_DEV = "http://sync-dev.getpostman.com";
//var POSTMAN_WEB_URL_SYNC_DEV = "https://sync-staging.getpostman.com";

var POSTMAN_INTERCEPTOR_ID_PRODUCTION = "aicmkgpgakddgnaphhhpliifpcfhicfo";
var POSTMAN_INTERCEPTOR_ID_STAGING = "flaanggmaikfebcchaambfkdefklniag";
var POSTMAN_INTERCEPTOR_ID_DEV = "cjjnlahgfafgalfgmabkndcldfdinjci";
var POSTMAN_INTERCEPTOR_ID_LOCAL = "bjoagefjpflhinlkfjbldkmhnbndiipp";
var POSTMAN_INTERCEPTOR_ID_SYNC_STAGE = "hfhmekcnabkelajbpjkinmhaplilkicm";

var POSTMAN_INDEXED_DB_PRODUCTION = "postman";
var POSTMAN_INDEXED_DB_TESTING = "postman_test";

var POSTMAN_SYNCSERVER_LOCAL = "http://localhost:1337";
var POSTMAN_SYNCSERVER_STAGING = "http://sync-server.getpostman.com";
var POSTMAN_SYNCSERVER_DEV = "http://sync.getpostman.com";//"http://104.200.18.102:1337";
var POSTMAN_SYNCSERVER_PRODUCTION = "https://sync-server.getpostman.com";
var POSTMAN_SYNCSERVER_SYNC_STAGE = "https://sync.getpostman.com";
var POSTMAN_SYNCSERVER_SYNC_DEV = "http://sync.getpostman.com";

var POSTMAN_OAUTH2_CALLBACK_URL_PRODUCTION = "https://www.getpostman.com/oauth2/callback";
var POSTMAN_OAUTH2_CALLBACK_URL_SYNC_STAGE = "http://sync-staging.getpostman.com/oauth2/callback";
var POSTMAN_OAUTH2_CALLBACK_URL_STAGING = "http://stage.getpostman.com:443";
var POSTMAN_OAUTH2_CALLBACK_URL_DEV = "http://dev.getpostman.com";
var POSTMAN_OAUTH2_CALLBACK_URL_SYNC_DEV = "http://sync.getpostman.com";


// Config variables
var postman_flag_is_testing = false;
var postman_web_url = POSTMAN_WEB_URL_PRODUCTION;
var postman_all_purchases_available = false;
var postman_interceptor_id = POSTMAN_INTERCEPTOR_ID_PRODUCTION;
var postman_syncserver_url = POSTMAN_SYNCSERVER_PRODUCTION;
var postman_oauth2_callback_url = POSTMAN_OAUTH2_CALLBACK_URL_PRODUCTION;

var postman_sync_api_version = "v1";

var postman_env = "production";

var postman_trial_duration = 1209600000; // 14 days
// var postman_trial_duration = 1000 * 60 * 60 * 2;

var postman_database_name;

if (postman_flag_is_testing) {
	postman_database_name = POSTMAN_INDEXED_DB_TESTING;
}
else {
	postman_database_name = POSTMAN_INDEXED_DB_PRODUCTION;
}