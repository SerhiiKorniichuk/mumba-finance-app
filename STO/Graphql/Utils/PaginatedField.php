<?php
namespace STO\Graphql\Utils;


use Youshido\GraphQL\Config\Field\FieldConfig;
use Youshido\GraphQL\Field\AbstractField;
use Youshido\GraphQL\Type\Scalar\IntType;
use Youshido\GraphQLExtension\Type\PaginatedResultType;

abstract class PaginatedField extends AbstractField {

    public function getResultType($type) {
        return new PaginatedResultType($type);
    }

    public function addParams(FieldConfig $config, $params) {
        $config->addArguments([
            'offset' => new IntType(),
            'limit'  => new IntType(),
        ]);
        $config->addArguments($params);

    }

    public function response($items, $total, $limit, $offset = 0) {
        return [
            'items' => $items,
            'pagingInfo' => [
                'totalCount' => $total,
                'limit' => $limit,
                'offset' => ($items? $offset + $limit : $offset),
            ],
        ];
    }
}