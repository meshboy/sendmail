<?php

namespace app\modules\api\modules\v1\models;

use Yii;

/**
 * This is the model class for table "users".
 *
 * @property string $user_id
 * @property string $username
 * @property string $email
 * @property string $firstname
 * @property string $lastname
 * @property string $user_phone_num
 * @property string $access_token
 * @property string $password
 * @property string $gcm_reg_id
 * @property string $created_at
 * @property string $modified_at
 * @property integer $active_status
 *
 * @property Accounts[] $accounts
 * @property Carts[] $carts
 * @property Messages[] $messages
 * @property Profiles[] $profiles
 */
class Users extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'users';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['username', 'email', 'firstname', 'lastname', 'user_phone_num', 'access_token', 'password', 'created_at', 'modified_at'], 'required'],
            [['gcm_reg_id', 'active_status'], 'integer'],
            [['created_at', 'modified_at'], 'safe'],
            [['username', 'access_token'], 'string', 'max' => 100],
            [['email', 'firstname', 'lastname', 'password'], 'string', 'max' => 200],
            [['user_phone_num'], 'string', 'max' => 30],
            [['email'], 'unique']
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'user_id' => 'User ID',
            'username' => 'Username',
            'email' => 'Email',
            'firstname' => 'Firstname',
            'lastname' => 'Lastname',
            'user_phone_num' => 'User Phone Num',
            'access_token' => 'Access Token',
            'password' => 'Password',
            'gcm_reg_id' => 'Gcm Reg ID',
            'created_at' => 'Created At',
            'modified_at' => 'Modified At',
            'active_status' => 'Active Status',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getAccounts()
    {
        return $this->hasMany(Accounts::className(), ['user_id' => 'user_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getCarts()
    {
        return $this->hasMany(Carts::className(), ['user_id' => 'user_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getMessages()
    {
        return $this->hasMany(Messages::className(), ['user_id' => 'user_id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getProfiles()
    {
        return $this->hasMany(Profiles::className(), ['user_id' => 'user_id']);
    }

    public function fetchusertdetails($user_id)
    {
//        $products = Products::find()->where(['active_status' => 1]);

        $user = Users::findBySql("SELECT us.firstname, us.username, us.lastname, us.email, us.user_phone_num, us.gcm_reg_id,
                                    pr.user_bio FROM users us LEFT JOIN profiles pr ON us.user_id = pr.user_id WHERE us.user_id = $user_id
                                    AND us.active_status = 1 AND pr.active_status = 1")->asArray(true)->one();

        return $user;

    }

    public static function getUsers($access_tokens)
    {
        $users = array();

        if(sizeof($users) > 0)
        {
            $query = "SELECT user_id, username, gcm_reg_id, created_at FROM users WHERE access_token IN (";

            foreach ($access_tokens as $access_token)
            {
                $query .= $access_token . ', ';
            }

            $query = substr($query, 0, strlen($query) - 1);
            $query .= ')';

            $users = Users::findBySql($query)->asArray(true)->all();

        }

        return $users;
    }

    public static function getUserIdFromToken($token)
    {
        $userArray = Users::findOne(['access_token' => $token, 'active_status' => 1]);

        return $userArray['user_id'];
    }

}
