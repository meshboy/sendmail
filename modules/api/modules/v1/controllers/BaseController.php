<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 7/21/15
 * Time: 12:38 PM
 */

namespace app\modules\api\modules\v1\controllers;



use app\modules\api\common\models\ApiUtility;
use Yii;
use yii\rest\Controller;

class BaseController extends Controller{

    public function setHeader($status)
    {

        $status_header = 'HTTP/1.1 ' . $status . ' ' . $this->_getStatusCodeMessage($status);
        $content_type="application/json; charset=utf-8";

        header($status_header);
        header('Access-Control-Allow-Origin: *');
        header('Content-type: ' . $content_type);
        header('X-Powered-By: ' . "Netfind");
    }



    private function _getStatusCodeMessage($status)
    {
        // these could be stored in a .ini file and loaded
        // via parse_ini_file()... however, this will suffice
        // for an example
        $codes = Array(
            200 => 'OK',
            400 => 'Bad Request',
            401 => 'Unauthorized',
            402 => 'Payment Required',
            403 => 'Forbidden',
            404 => 'Not Found',
            500 => 'Internal Server Error',
            501 => 'Not Implemented',
        );
        return (isset($codes[$status])) ? $codes[$status] : '';
    }


    public function paramCheck($paramsKeyValuePair, $params)
    {
        $keys = array_keys($paramsKeyValuePair);
        $paramsCheckResult = ApiUtility::paramCheck($keys, $params);
        if (is_array($paramsCheckResult)){
            $this->setHeader(400);
            $errorMsg = 'Missing params: ' . implode(', ', $paramsCheckResult);
            echo json_encode(ApiUtility::errorResponse($errorMsg));
            exit;
        }

        $paramsTypeCheckResult = ApiUtility::paramTypeCheck($paramsKeyValuePair, $params);
        if (is_array($paramsTypeCheckResult))
        {
            $this->setHeader(400);
            $errorMsg = 'The following param had wrong types: ' . implode(', ', $paramsTypeCheckResult);
            echo json_encode(ApiUtility::errorResponse($errorMsg));
            exit;
        }

        return true;
    }


}