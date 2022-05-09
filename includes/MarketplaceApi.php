<?php

namespace NewFoldLabs\WP\Module\Marketplace;

// use WP_Forge\Helpers\Arr;

use function NewfoldLabs\WP\ModuleLoader\container;

/**
 * Class MarketplaceApi
 */
class MarketplaceApi {

	/**
	 * Register notification routes.
	 */
	public static function registerRoutes() {

		// Add route for fetching marketplace
		register_rest_route(
			'newfold-marketplace/v1',
			'/marketplace',
			array(
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => function ( \WP_REST_Request $request ) {
                    
                    // $marketplace = wp_remote_get(
                    //     NFD_HIIVE_URL . '/marketplace',
                    //     array(
                    //         'headers' => array(
                    //             'Content-Type'  => 'application/json',
                    //             'Accept'        => 'application/json',
                    //             'Authorization' => 'Bearer ' . HiiveConnection::get_auth_token(),
                    //         ),
                    //     )
                    // );

                    $results = self::get_test_marketplace_data(); 

					return rest_ensure_response( $results );
				},
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);

	}

    public static function get_test_marketplace_data() {
        return json_decode( file_get_contents(__DIR__ . '/../sample-plugins.json'), true );
    }
}
