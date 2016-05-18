<?php

namespace app\modules\api\common\models;




class JsonResponse extends Response {

    const STATUS_ERROR = false;
    const STATUS_SUCCESS = true;



    /**
     * @var array
     */
    private $data = array();

    private $status;
    public function get()
    {
        return json_encode(
            array(
                'status' => $this->status,
                'message' => $this->message,
                'data' => $this->data
            )
        );
    }


    public function setData($data){
        $this->data = $data;
    }

    public function setStatus($status){
        $this->status = $status;
    }

    public static function success( $message='', $data=array()){
        $response = new JsonResponse($message);
        $response->setData($data);

        $response->setStatus(JsonResponse::STATUS_SUCCESS);
        return $response->get();
    }



    public static function error($message='An error has occurred', $data=array()){
        $response = new JsonResponse($message);
        $response->setData($data);
        $response->setStatus(JsonResponse::STATUS_ERROR);
        return $response->get();
    }
} 