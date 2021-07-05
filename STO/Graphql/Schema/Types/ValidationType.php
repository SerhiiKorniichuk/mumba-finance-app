<?php
namespace STO\Graphql\Schema\Types;

use Youshido\GraphQL\Type\Object\AbstractObjectType;

class ValidationType extends AbstractObjectType {
    public function build($config) {
        $config->addFields([
            'email'      => new ValidationResultType(),
            'phone'      => new ValidationResultType(),
        ]);
    }
}