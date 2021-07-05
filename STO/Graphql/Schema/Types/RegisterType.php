<?php
namespace STO\Graphql\Schema\Types;

use Youshido\GraphQL\Type\Object\AbstractObjectType;
use Youshido\GraphQL\Type\Scalar\StringType;

class RegisterType extends AbstractObjectType {
    public function build($config) {
        $config->addFields([
            'step'         => new StringType(),
            'validation'   => new ValidationType(),
        ]);

    }
}