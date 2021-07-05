<?php
namespace STO\Graphql\Schema\Mutations\ChangeUserDeactivated;
use Youshido\GraphQL\Type\NonNullType;
use Youshido\GraphQL\Type\Scalar\IntType;
use Youshido\GraphQL\Type\Scalar\StringType;
use Youshido\GraphQL\Type\InputObject\AbstractInputObjectType;

class ChangeUserDeactivatedInput extends AbstractInputObjectType {
    public function build($config) {
        $config->addFields([
            'userId'            => new NonNullType(new IntType()),
            'deactivatedStatus' => new NonNullType(new IntType()),
            'banDate'           => new NonNullType(new StringType()),
        ]);
    }
}
