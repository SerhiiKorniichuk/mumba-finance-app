<?php
namespace STO\Graphql\Schema\Mutations\ChangePassword;
use Youshido\GraphQL\Type\NonNullType;
use Youshido\GraphQL\Type\Scalar\StringType;
use Youshido\GraphQL\Type\InputObject\AbstractInputObjectType;

class ChangePasswordInput extends AbstractInputObjectType {
    public function build($config) {
        $config->addFields([
            'oldPassword' => new NonNullType(new StringType()),
            'newPassword' => new NonNullType(new StringType()),
            'newPasswordRepeat' => new NonNullType(new StringType()),
        ]);
    }
}