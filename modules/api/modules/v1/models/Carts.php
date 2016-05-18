<?php

namespace app\modules\api\modules\v1\models;

use Yii;

/**
 * This is the model class for table "carts".
 *
 * @property string $cart_id
 * @property string $user_id
 * @property string $product_id
 * @property integer $active_status
 * @property string $created_at
 * @property string $modified_at
 *
 * @property Users $user
 * @property Products $product
 */
class Carts extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'carts';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['user_id', 'product_id', 'created_at', 'modified_at'], 'required'],
            [['user_id', 'product_id', 'active_status'], 'integer'],
            [['created_at', 'modified_at'], 'safe']
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'cart_id' => 'Cart ID',
            'user_id' => 'User ID',
            'product_id' => 'Product ID',
            'active_status' => 'Active Status',
            'created_at' => 'Created At',
            'modified_at' => 'Modified At',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getUser()
    {
        return $this->hasOne(Users::className(), ['user_id' => 'user_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getProduct()
    {
        return $this->hasOne(Products::className(), ['product_id' => 'product_id']);
    }
}
