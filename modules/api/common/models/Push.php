<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 3/12/16
 * Time: 11:24 PM
 */

namespace app\modules\api\common\models;

/**
 * Class Push
 * @package app\modules\api\common\models
 * This class prepares the required json format that is transferred as a push message to device.
 * If you want to add additional fields to json, you need to add them in this class.
 */
class Push {

    // push message title
    private $title;

    // push message payload
    private $data;

    // flag indicating background task on push received
    private $is_background;

    // flag to indicate the type of notification
    private $flag;

    function __construct() {

    }

    public function setTitle($title){
        $this->title = $title;
    }

    public function setData($data){
        $this->data = $data;
    }

    public function setIsBackground($is_background){
        $this->is_background = $is_background;
    }

    public function setFlag($flag){
        $this->flag = $flag;
    }

    public function getPush(){
        $res = array();
        $res['title'] = $this->title;
        $res['is_background'] = $this->is_background;
        $res['flag'] = $this->flag;
        $res['data'] = $this->data;

        return $res;
    }
} 