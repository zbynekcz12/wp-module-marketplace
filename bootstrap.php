<?php

use NewfoldLabs\WP\ModuleLoader\Container;
use function NewfoldLabs\WP\ModuleLoader\register;

if ( function_exists( 'add_action' ) ) {

	add_action(
		'plugins_loaded',
		function () {

			register(
				[
					'name'     => 'marketplace',
					'label'    => __( 'Marketplace', 'newfold-marketplace-module' ),
					'callback' => function ( Container $container ) {
						new Marketplace( $container );
					},
					'isActive' => true,
					'isHidden' => true,
				]
			);

		}
	);

}
