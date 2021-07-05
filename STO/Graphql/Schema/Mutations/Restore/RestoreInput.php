<?php
namespace STO\Graphql\Schema\Mutations\Restore;

use Youshido\GraphQL\Type\NonNullType;
use Youshido\GraphQL\Type\Scalar\StringType;
use Youshido\GraphQL\Type\InputObject\AbstractInputObjectType;

class RestoreInput extends AbstractInputObjectType {
    public function build($config) {
        $config->addFields([
            'username'          => new NonNullType(new StringType()),
            'password'          => new StringType(),
            'passwordRepeat'    => new StringType(),
        ]);
    }
}