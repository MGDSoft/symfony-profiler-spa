<?php

namespace Symfony\Component\DependencyInjection\Loader\Configurator;

use MGDSoft\SymfonyProfilerSPA\Bundle\Controller\DebugToolbarSPAController;

return static function (ContainerConfigurator $container) {
    $container->services()
        ->set('mgd_profiler_spa.controller.load', DebugToolbarSPAController::class)
        ->public()
            ->args([
                service('twig'),
            ])
    ;
};
