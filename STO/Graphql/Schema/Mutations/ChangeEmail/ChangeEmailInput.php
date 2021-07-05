<?php
namespace STO\Graphql\Schema\Mutations\ChangeEmail;

use Youshido\GraphQL\Type\InputObject\AbstractInputObjectType;
use Youshido\GraphQL\Type\NonNullType;
use Youshido\GraphQL\Type\Scalar\IntType;
use Youshido\GraphQL\Type\Scalar\StringType;

class ChangeEmailInput extends AbstractInputObjectType {
    public function build($config) {
        $config->addFields([
            'email' => new NonNullType(new StringType()),
        ]);
    }
}