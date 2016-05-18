<?php

namespace app\modules\api\modules\v1\models;

use Yii;

/**
 * This is the model class for table "accounts".
 *
 * @property string $account_id
 * @property string $account_balance
 * @property string $user_id
 * @property integer $active_status
 * @property string $created_at
 * @property string $modified_at
 *
 * @property Users $user
 */
class Accounts extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'accounts';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['user_id', 'created_at', 'modified_at'], 'required'],
            [['user_id', 'active_status'], 'integer'],
            [['created_at', 'modified_at'], 'safe'],
            [['account_balance'], 'string', 'max' => 50]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'account_id' => 'Account ID',
            'account_balance' => 'Account Balance',
            'user_id' => 'User ID',
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
}
