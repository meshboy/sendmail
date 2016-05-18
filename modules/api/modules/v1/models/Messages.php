<?php

namespace app\modules\api\modules\v1\models;

use Yii;


/**
 * This is the model class for table "messages".
 *
 * @property string $message_id
 * @property string $chat_room_id
 * @property string $user_id
 * @property string $message
 * @property integer $active_status
 * @property string $created_at
 * @property string $modified_at
 *
 * @property Users $user
 * @property ChatRooms $chatRoom
 */
class Messages extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'messages';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['chat_room_id', 'user_id', 'active_status'], 'integer'],
            [['user_id', 'created_at', 'modified_at'], 'required'],
            [['created_at', 'modified_at'], 'safe'],
            [['message'], 'string', 'max' => 150]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'message_id' => 'Message ID',
            'chat_room_id' => 'Chat Room ID',
            'user_id' => 'User ID',
            'message' => 'Message',
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
    public function getChatRoom()
    {
        return $this->hasOne(ChatRooms::className(), ['chat_room_id' => 'chat_room_id']);
    }

    public static function  getMessageByChatId($chat_room_id)
    {
        $resultArray = Messages::findBySql("SELECT cr.chat_room_id, u.username, u.access_token, c.message, c.message_id, cr.chat_room_name, cr.created_at
                  FROM chat_rooms cr LEFT JOIN messages c ON c.chat_room_id = cr.chat_room_id
                LEFT JOIN users u ON u.user_id = c.user_id WHERE cr.chat_room_id = $chat_room_id")->asArray(true)->all();

        return $resultArray;
    }

    public static function getMessageByMessageIdAndUserId($message_id, $user_id)
    {
        $resultArray = Messages::findBySql("SELECT user.username, user.email, user.access_token, msg.message, msg.message_id, msg.created_at, msg.chat_room_id
                          FROM messages msg
                          JOIN users user
                          WHERE msg.message_id = $message_id
                          AND user.user_id = $user_id")->asArray(true)->all();

        return $resultArray;
    }

}
