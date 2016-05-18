<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 7/21/15
 * Time: 12:12 PM
 */

namespace app\modules\api\common\models;


class ApiUtility {

    const TYPE_INT = 0;
    const TYPE_BOOL = 1;
    const TYPE_REAL = 2;
    const TYPE_FLOAT = 3;
    const TYPE_ARR = 4;
    const TYPE_FILE = 5;
    const TYPE_STRING = 6;
    const TYPE_EMAIL = 7;

    const GOOGLE_API_CHAT_KEY = "AIzaSyBZ7sTWm6dH4Mt6yptVVm-0bzK8npYwkoM";
    const PUSH_FLAG_CHATROOM = 1;
    const PUSH_FLAG_USER = 2;
    const IMAGE_APP_URL = "";

    public static function paramCheck($expectedParamsKeyArr, $request)
    {
        $absentParams = [];
        foreach ($expectedParamsKeyArr as $param)
        {
            if (!isset($request[$param]))
            {
                array_push($absentParams, $param);
            }
        }
        if (!empty($absentParams))
        {
            return $absentParams;
        }
        return true;
    }

    public static function paramTypeCheck($paramToTypeArray, $request)
    {
        $faultyParams = [];
        foreach ($paramToTypeArray as $paramKey => $expectedType)
        {
            if (!self::isValidType($request[$paramKey], $expectedType))
            {
                array_push($faultyParams, $paramKey);
            }
        }
        if (!empty($faultyParams))
        {
            return $faultyParams;
        }
        return true;
    }

    public static function isValidType($param, $type)
    {
        switch ($type)
        {
            case self::TYPE_INT:
                return is_numeric($param);
            case self::TYPE_REAL:
                return is_real($param);
            case self::TYPE_FLOAT:
                return is_float($param);
            case self::TYPE_ARR:
                return is_array($param);
            case self::TYPE_FILE:
                return is_file($param);
            case self::TYPE_STRING:
                return is_string($param);
            case self::TYPE_EMAIL:
                return self::isValidEmail($param);
            default:
                return false;
        }
    }



    //TODO: implement this email verification
    public static function isValidEmail($email)
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL);
    }

    public static function isReasonableDOB($day, $month, $year)
    {
        return (intval($year) <= date('Y'));
    }

    public static function errorResponse($msg)
    {
        $response = [];
        $response['status'] = false;
        $response['error'] = $msg;
        return $response;
    }

    public static function generateAccessToken()
    {
        return bin2hex(openssl_random_pseudo_bytes(32));
    }

    public static function generateReferralCode()
    {
        return strtoupper(bin2hex(openssl_random_pseudo_bytes(4)));
    }

    public static function generatePassword()
    {
        return bin2hex(openssl_random_pseudo_bytes(6));
    }

    public static function generatePasswordHash($password)
    {
        return sha1($password);
    }

    public static function addDaysToDate($date, $days, $include_time = false){
        $dateObject = new \DateTime($date);
        $dateObject->modify('+' . $days . ' days');
        return ($include_time) ? $dateObject->format('Y-m-d H:m:s') :$dateObject->format('Y-m-d');
    }

    public static function removeDaysFromDate($date, $days, $include_time = false){
        $dateObject = new \DateTime($date);
        $dateObject->modify('-' . $days . ' days');
        return ($include_time) ? $dateObject->format('Y-m-d H:m:s') :$dateObject->format('Y-m-d');
    }

    public static function getArrayMode($array){
        $values = array_count_values($array);
        return array_search(max($values), $values);
    }

    public static function getArrayVariance($array){
        if (!count($array)) return 0;

        $mean = array_sum($array) / count($array);

        $sos = 0;    // Sum of squares
        for ($i = 0; $i < count($array); $i++)
        {
            $sos += ($array[$i] - $mean) * ($array[$i] - $mean);
        }

        return (count($array) > 1) ? sqrt($sos / (count($array)-1)) : sqrt($sos);
    }

    public static function getAgeFromDOB($date_of_birth)
    {
        $today = date_create();
        $dob = new \DateTime($date_of_birth);
        return round(date_diff($today, $dob)->days / 365);

    }
}