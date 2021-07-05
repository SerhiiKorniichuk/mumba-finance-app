<?php
namespace STO\Graphql\Schema\Inputs;

use Youshido\GraphQL\Type\InputObject\AbstractInputObjectType;
use Youshido\GraphQL\Type\Scalar\BooleanType;
use Youshido\GraphQL\Type\Scalar\StringType;

class ValidationInputFieldType extends AbstractInputObjectType {
    public function build($config) {
        $config->addFields([
            'code' => new StringType(),
            'resend' => new BooleanType(),
        ]);
    }
}