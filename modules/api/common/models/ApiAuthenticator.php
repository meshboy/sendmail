<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 3/26/15
 * Time: 10:50 AM
 */

namespace app\modules\api\common\models;

class ApiAuthenticator {

    const STANDARD_API_KEY = "642b5370ff48d57a9dcb21f4b2007fe3";

    public function generateApiKey(){
        return md5(uniqid(rand(), true));
    }

    public static function verifyApiKey()
    {
        if(!isset($_GET['key']))
        {
            echo json_encode(ApiUtility::errorResponse("Permission denied, Api Key is needed to access this"));
            exit;
        }

        $apiKey = $_GET['key'];

        if($apiKey != ApiAuthenticator::STANDARD_API_KEY)
        {
            echo json_encode(ApiUtility::errorResponse("Permission denied, Invalid Api Key"));
            exit;
        }

    }


}

