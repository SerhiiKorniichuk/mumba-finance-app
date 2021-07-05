<?php
namespace STO\Graphql\Schema\Queries\Dashboard;

use STO\Graphql\Schema\Queries\AdminAccess\AdminAccessField;
use STO\Graphql\Schema\Types\DashboardType;
use STO\Log\LogStorage;
use STO\Users\UsersStorage;
use Youshido\GraphQL\Execution\ResolveInfo;
use Youshido\GraphQL\Field\AbstractField;

class DashboardField extends AbstractField {
    public function getType() {
        return new DashboardType();
    }
    public function resolve($root, $params, ResolveInfo $info) {
        $result = new AdminAccessField();
        $result->resolve($root, $params, $info);
        $users = new UsersStorage();
        $logs = new LogStorage();

        list($allUsersCount) = $users->search(['limit' => 0]);
        $monthlyUsersCount = (int)$users->getMonthlyUsersCount();
        $usersChartData = $logs->getUsersChartData();

        return [
            'allUsersCount'          => (int)$allUsersCount,
            'monthlyUsersCount'      => $monthlyUsersCount,
            'allTokensCount'         => 0,
            'monthlyUsers'           => 0,
            'soldTokensCount'        => 0,
            'residueTokensCount'     => 0,
            'receivedUsd'            => '0.0',
            'receivedBtc'            => '0.0',
            'receivedMoney'          => '0.0',
            'usersChartData'         => json_encode($usersChartData)
        ];
    }
}