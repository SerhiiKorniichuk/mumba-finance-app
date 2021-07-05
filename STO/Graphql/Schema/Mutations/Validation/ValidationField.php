<?php
namespace STO\Graphql\Schema\Mutations\Validation;

use STO\Graphql\Utils\Exception;
use STO\Utils\Phone;
use STO\Utils\Structures;
use STO\Validation\ValidationService;
use STO\Validation\ValidationStorage;
use Youshido\GraphQL\Config\Field\FieldConfig;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Field\AbstractField;
use Youshido\GraphQL\Type\ListType\ListType;
use Youshido\GraphQL\Type\NonNullType;
use Youshido\GraphQL\Type\Scalar\StringType;


class ValidationField extends AbstractField {
    public function getType() {
        return new ListType([
            'state' => new NonNullType(new StringType()),
        ]);
    }
    public function build(FieldConfig $config) {
        $config->addArgument(new NonNullType(new ValidationInput()));
    }

    private function result($result) {
        $state = Structures::getResponseCode($result);
        $data  = Structures::getResponseData($result);
        switch ($state) {
            case ValidationService::RESULT_CODE_FAILED:
                throw new Exception(Exception::CODE_IS_INCORRECT);
                break;
            case ValidationService::RESULT_START_FAILED:
                throw new Exception(Exception::INTERNAL_ERROR);
                break;
            case ValidationService::RESULT_RESEND_FAILED:
                throw new Exception(Exception::CANT_RESEND_CODE);
                break;
        }
        $delay = (int)$data['resend_delay'];
        return [
            'state'  => $state,
            'delay'  => $delay,
        ];
    }

    public function resolve($root, $params, ResolveInfo $info) {
        $email = $root['email'];
        $phone = $root['phone'];
        $email_code = $params['email']['code'];
        $phone_code = $params['phone']['code'];
        $from = $root['from'];
        $resend = $params['resend'];
        $validation = new ValidationService();
        $phone_result = [];
        $email_result = [];
        if ($email) {
            if (!$email_code) {
                $validation->delete($from, ValidationStorage::TYPE_EMAIL, $email);
            }
            $email_result = $validation->email($from, $email, $email_code, $resend);
        }
        if ($phone) {
            if (!$phone_code) {
                $validation->delete($from, ValidationStorage::TYPE_PHONE, $phone);
            }
            $phone_result = $validation->phone($from, $phone, $phone_code, $resend);
        }

        return [
            'email' => $email_result ? $this->result($email_result) : null,
            'phone' => $phone_result ? $this->result($phone_result) : null,
        ];
    }
}
