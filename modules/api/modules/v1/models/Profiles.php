<?php

namespace app\modules\api\modules\v1\models;

use Yii;

/**
 * This is the model class for table "profiles".
 *
 * @property string $profile_id
 * @property string $user_id
 * @property string $user_bio
 * @property string $profile_image_name
 * @property integer $active_status
 * @property string $created_at
 * @property string $modified_at
 *
 * @property Users $user
 */
class Profiles extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'profiles';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['user_id', 'created_at', 'modified_at'], 'required'],
            [['user_id', 'active_status'], 'integer'],
            [['user_bio'], 'string'],
            [['created_at', 'modified_at'], 'safe'],
            [['profile_image_name'], 'string', 'max' => 50]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'profile_id' => 'Profile ID',
            'user_id' => 'User ID',
            'user_bio' => 'User Bio',
            'profile_image_name' => 'Profile Image Name',
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
