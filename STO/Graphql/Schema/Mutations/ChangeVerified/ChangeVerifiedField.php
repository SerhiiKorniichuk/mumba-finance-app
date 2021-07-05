<?php
namespace STO\Graphql\Schema\Mutations\ChangeVerified;

use STO\Graphql\Schema\Queries\AdminAccess\AdminAccessField;
use STO\Graphql\Utils\Exception;
use STO\Users\UsersStorage;
use STO\Verification\VerificationStorage;
use Youshido\GraphQL\Config\Field\FieldConfig;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Field\AbstractField;
use Youshido\GraphQL\Type\NonNullType;
use Youshido\GraphQL\Type\Scalar\BooleanType;

class ChangeVerifiedField extends AbstractField {
    public function getType() {
        return new BooleanType();
    }

    public function build(FieldConfig $config) {
        $config->addArguments([
            'input'         => new NonNullType(new ChangeVerifiedInput()),
        ]);
    }

    public function resolve($root, $params, ResolveInfo $info) {
        $result = new AdminAccessField();
        $result->resolve($root, $params, $info);
        $input = $params['input'];

        $verification = new VerificationStorage();
        $users        = new UsersStorage();

        $verifiedStatus = (int)$input['verifiedStatus'];
        if (!$verification->isCorrectStatus($verifiedStatus)) {
            throw new Exception(Exception::INCORRECT_VERIFIED_STATUS);
        }
        $message = $input['message'];
        $userId = $input['userId'];
        if (!$userId || !$users->getUser($userId)) {
            throw new Exception(Exception::USER_NOT_FOUND);
        }

        $isVerified = UsersStorage::VERIFIED_NONE;
        if ($verifiedStatus === VerificationStorage::STATUS_APPROVED) {
            $isVerified = UsersStorage::VERIFIED_VERIFIED;
        }
        if (!$users->updateVerified($userId, $isVerified)) {
            throw new Exception(Exception::INTERNAL_ERROR);
        }
        if (!$verification->updateStatusMessage($userId, $verifiedStatus, $message)) {
            throw new Exception(Exception::INTERNAL_ERROR);
        }

        return true;
    }
}