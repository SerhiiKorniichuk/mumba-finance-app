<?php
namespace STO\Graphql\Schema\Mutations\Deactivate;
use Youshido\GraphQL\Type\NonNullType;
use Youshido\GraphQL\Type\Scalar\StringType;
use Youshido\GraphQL\Type\InputObject\AbstractInputObjectType;

class DeactivateInput extends AbstractInputObjectType {
    public function build($config) {
        $config->addFields([
            'password' => new NonNullType(new StringType()),
        ]);
    }
}
