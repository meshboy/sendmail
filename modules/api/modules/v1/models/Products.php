<?php

namespace app\modules\api\modules\v1\models;

use Yii;
use yii\data\Pagination;

/**
 * This is the model class for table "{{%products}}".
 *
 * @property string $product_id
 * @property string $product_name
 * @property string $product_image_extension
 * @property string $product_details
 * @property string $product_cost
 * @property string $product_old_cost
 * @property string $product_tutorial_link
 * @property integer $active_status
 * @property string $created_at
 * @property string $modified_at
 *
 * @property Carts[] $carts
 */
class Products extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return '{{%products}}';
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['product_details'], 'string'],
            [['active_status'], 'integer'],
            [['created_at', 'modified_at'], 'required'],
            [['created_at', 'modified_at'], 'safe'],
            [['product_name', 'product_image_extension', 'product_cost', 'product_old_cost'], 'string', 'max' => 50],
            [['product_tutorial_link'], 'string', 'max' => 200],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'product_id' => 'Product ID',
            'product_name' => 'Product Name',
            'product_image_extension' => 'Product Image Extension',
            'product_details' => 'Product Details',
            'product_cost' => 'Product Cost',
            'product_old_cost' => 'Product Old Cost',
            'product_tutorial_link' => 'Product Tutorial Link',
            'active_status' => 'Active Status',
            'created_at' => 'Created At',
            'modified_at' => 'Modified At',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getCarts()
    {
        return $this->hasMany(Carts::className(), ['product_id' => 'product_id']);
    }


    public function fetchallproduct()
    {
        $products = Products::find()->where(['active_status' => 1]);

        $count = $products->count();
        $pagination = new Pagination(['totalCount'=> $count]);



//            $allproduct = Products::findBySql("SELECT product_id, product_name, product_cost, product_old_cost, CONCAT( \"http://www.hercules.com.ng/web/assets/ProductUpload/\",product_id,product_image_extension) AS filename
//            FROM products WHERE active_status = 1
//             ORDER BY created_at DESC LIMIT $pagination->offset,$pagination->limit
//                                ")->asArray()->All();

        $allproduct = Products::findBySql("SELECT product_id, product_name, product_details, product_cost, product_old_cost, CONCAT( \"http://www.hercules.com.ng/web/assets/ProductUpload/\",product_id,product_image_extension) AS filename
            FROM products WHERE active_status = 1
             ORDER BY created_at DESC
                                ")->asArray()->All();

        return $allproduct;

    }

    public function fetchproductdetails($product_id)
    {
//        $products = Products::find()->where(['active_status' => 1]);


        $product = Products::findBySql("SELECT product_id, product_details, product_name, product_cost, product_old_cost, CONCAT( \"http://www.hercules.com.ng/web/assets/ProductUpload/\",product_id,product_image_extension) AS filename
            FROM products WHERE active_status = 1 AND product_id = $product_id
                                ")->asArray()->one();

        return $product;

    }

    public function searchproduct($query)
    {
        $searchproduct = "%".$query."%";
//        $searchproduct = $query;
        $productsearch = Products::findBySql("SELECT product_id, product_name, product_cost, product_old_cost, CONCAT( \"http://www.hercules.com.ng/web/assets/ProductUpload/\",product_id,product_image_extension) AS filename
            FROM products WHERE product_name LIKE '$searchproduct' OR product_details LIKE '$searchproduct'  AND active_status = 1")->asArray(true)->All();

        return $productsearch;
    }

    public function removeproduct($product_id)
    {
        $product = Products::findOne($product_id);
        $product->active_status = 0;
        return $product->update();
    }
}
