<?php

declare(strict_types=1);

namespace MGDSoft\SymfonyProfilerSPA\Bundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Twig\Environment;

class DebugToolbarSPAController
{
    public function __construct(private Environment $twig)
    {
    }

    public function loadToolbarAction(string $token, Request $request): Response
    {
        return new Response(
            $this->twig->render('@WebProfiler/Profiler/toolbar_js.html.twig', [
                'full_stack' => false,
                'excluded_ajax_paths' => true,
                'token' => $token,
                'request' => $request,
                'csp_script_nonce' => null,
                'csp_style_nonce' => null,
            ]
        ));
    }
}
