<?php
namespace STO\Graphql\Schema\Inputs;
use Youshido\GraphQL\Type\NonNullType;
use Youshido\GraphQL\Type\Scalar\IntType;
use Youshido\GraphQL\Type\Scalar\StringType;
use Youshido\GraphQL\Type\InputObject\AbstractInputObjectType;

class Upload extends AbstractInputObjectType {
    public function build($config) {
        $config->addFields([
            'name' => new StringType(),
            'type' => new StringType(),
            'tmp_name' => new StringType(),
            'error' => new IntType(),
            'size' => new IntType(),
        ]);
    }
}