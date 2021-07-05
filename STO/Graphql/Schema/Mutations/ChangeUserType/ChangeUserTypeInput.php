<?php
namespace STO\Graphql\Schema\Mutations\ChangeUserType;
use Youshido\GraphQL\Type\NonNullType;
use Youshido\GraphQL\Type\Scalar\IntType;
use Youshido\GraphQL\Type\Scalar\StringType;
use Youshido\GraphQL\Type\InputObject\AbstractInputObjectType;

class ChangeUserTypeInput extends AbstractInputObjectType {
    public function build($config) {
        $config->addFields([
            'userId'  => new NonNullType(new IntType()),
            'userType' => new NonNullType(new IntType()),
        ]);
    }
}
