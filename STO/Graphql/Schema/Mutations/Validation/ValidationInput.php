<?php
namespace STO\Graphql\Schema\Mutations\Validation;

use STO\Graphql\Schema\Inputs\ValidationInputFieldType;
use Youshido\GraphQL\Type\InputObject\AbstractInputObjectType;

class ValidationInput extends AbstractInputObjectType {
    public function build($config) {
        $config->addFields([
            'email' => new ValidationInputFieldType(),
            'phone' => new ValidationInputFieldType(),
        ]);
    }
}