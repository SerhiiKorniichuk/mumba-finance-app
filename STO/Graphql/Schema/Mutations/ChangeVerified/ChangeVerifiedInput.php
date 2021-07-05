<?php
namespace STO\Graphql\Schema\Mutations\ChangeVerified;

use Youshido\GraphQL\Type\InputObject\AbstractInputObjectType;
use Youshido\GraphQL\Type\NonNullType;
use Youshido\GraphQL\Type\Scalar\IntType;
use Youshido\GraphQL\Type\Scalar\StringType;

class ChangeVerifiedInput extends AbstractInputObjectType {
    public function build($config) {
        $config->addFields([
            'userId'         => new NonNullType(new IntType()),
            'verifiedStatus' => new NonNullType(new IntType()),
            'message'        => new NonNullType(new StringType()),
        ]);
    }
}
