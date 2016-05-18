<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 9/18/15
 * Time: 9:21 PM
 */
namespace app\modules\api\modules\v1\models;

class ApiKeyHelper {
    CONST ACCESS_TOKEN = "access_token";
    CONST PAGE = "page";
    CONST FILTER = "filter";
    CONST LIMIT = "limit";
    CONST LAST_ID = "last_id";
    CONST FROM_ACCESS_TOKEN = "from_access_token";
    CONST TO_ACCESS_TOKEN = "to_access_token";
    CONST GOOGLE_API_KEY = "google_api_key";
    CONST APP_TOKEN = "token";
    CONST APP_IMAGE_URL  = "image";
}

class UserApiKeyHelper extends ApiKeyHelper{

    const USERNAME = "username";
    const PASSWORD = "password";
    const USER_ID = "user_id";
    const FIRSTNAME = "firstname";
    const LASTNAME = "lastname";
    const USER_PHONE_NUM = "user_phone_num";
    const EMAIL = "email";
    const GCM_REG_ID = "gcm_reg_id";
}

class ProfileApiKeyHelper extends ApiKeyHelper{
    const PROFILE_ID = "profile_id";
    const PROFILE_IMAGE_NAME = "profile_image_name";
    const USER_BIO = "user_bio";
}

class AccountApiKeyHelper extends ApiKeyHelper{

    const ACCOUNT_ID = "account_id";
    const ACCOUNT_BALANCE = "account_balance";

}

class CartApiKeyHelper extends ApiKeyHelper{

    const CART_ID = "cart_id";
    const PRODUCT_ID = "product_id";
}

class ProductApiKeyHelper extends ApiKeyHelper{
    const PRODUCT_ID = "product_id";
    const PRODUCT_NAME = "product_name";
    const PRODUCT_IMAGE_EXTENSION = "product_image_extension";
    const PRODUCT_DETAILS = "product_details";
    const PRODUCT_COST = "product_cost";
    const PRODUCT_OLD_COST = "product_old_cost";
    const PRODUCT_TUTORIAL_LINK = "product_tutorial_link";

}

class MessageApiKeyHelper extends ApiKeyHelper{

    const MESSAGE_ID = "message_id";
    const MESSAGE = "message";
}

class Chat_RoomsApiKeyHelper extends ApiKeyHelper{
    const CHAT_ROOM_ID = "chat_room_id";
    const NAME = "name";
}

class SearchApiKeyHelper extends ApiKeyHelper{
    const SEARCH_QUERY = "search_query";

}

