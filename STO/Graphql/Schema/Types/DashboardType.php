<?php
namespace STO\Graphql\Schema\Types;

use Youshido\GraphQL\Type\Object\AbstractObjectType;
use Youshido\GraphQL\Type\Scalar\IntType;
use Youshido\GraphQL\Type\Scalar\StringType;

class DashboardType extends AbstractObjectType {
    public function build($config) {
        $config->addFields([
            'allUsersCount'          => new IntType(),
            'allTokensCount'         => new IntType(),
            'monthlyUsersCount'      => new IntType(),
            'soldTokensCount'        => new IntType(),
            'residueTokensCount'     => new IntType(),
            'receivedUsd'            => new StringType(),
            'receivedBtc'            => new StringType(),
            'receivedMoney'          => new StringType(),
            'usersChartData'         => new StringType(),
        ]);

    }
}