<?php

namespace app\modules\api\modules\v1\models;

use Yii;

/**
 * This is the model class for table "chat_rooms".
 *
 * @property string $chat_room_id
 * @property string $chat_room_name
 * @property integer $active_status
 * @property string $created_at
 * @property string $modified_at
 *
 * @property Messages[] $messages
 */
class ChatRooms extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'chat_rooms';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['active_status'], 'integer'],
            [['created_at', 'modified_at'], 'required'],
            [['created_at', 'modified_at'], 'safe'],
            [['chat_room_name'], 'string', 'max' => 50]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'chat_room_id' => 'Chat Room ID',
            'chat_room_name' => 'Chat Room Name',
            'active_status' => 'Active Status',
            'created_at' => 'Created At',
            'modified_at' => 'Modified At',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getMessages()
    {
        return $this->hasMany(Messages::className(), ['chat_room_id' => 'chat_room_id']);
    }
}
