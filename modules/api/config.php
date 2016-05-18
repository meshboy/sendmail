<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 7/21/15
 * Time: 3:50 PM
 */

return [
    'modules' => [
        'v1' => [
            'class' => 'app\modules\api\modules\v1\Module',
        ],
        'v2' => [
            'class' => 'app\modules\api\modules\v2\Module',
        ],
    ],
    'components' => [
        'request' => [
            'class' => 'yii\web\Response',
            'parsers' => [
                'application/json' => 'yii\web\JsonParser',
            ]
        ],
    ],
    'params' => [

    ]
];