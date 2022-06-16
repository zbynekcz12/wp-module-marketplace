<?php

namespace NewFoldLabs\WP\Module\Marketplace;

// use WP_Forge\Helpers\Arr;

use NewfoldLabs\WP\Module\Data\HiiveConnection;
use function NewfoldLabs\WP\ModuleLoader\container;

/**
 * Class MarketplaceApi
 */
class MarketplaceApi {

	/**
	 * Register notification routes.
	 */
	public static function registerRoutes() {

		// Add route for fetching marketplace products per brand
		register_rest_route(
			'newfold-marketplace/v1',
			'/marketplace',
			array(
				'methods'  => \WP_REST_Server::READABLE,
				'callback' => function ( \WP_REST_Request $request ) {
					
					$marketplace_endpoint = add_query_arg( array(
						'brand' => container()->plugin()->id,
					), NFD_HIIVE_URL . '/sites/v1/products' );

                    $response = wp_remote_get(
                        $marketplace_endpoint,
                        array(
                            'headers' => array(
                                'Content-Type'  => 'application/json',
                                'Accept'        => 'application/json',
                                'Authorization' => 'Bearer ' . HiiveConnection::get_auth_token(),
                            ),
                        )
                    );

					// return rest_ensure_response( $response );
					if ( ! is_wp_error( $response ) ) {
						$body = wp_remote_retrieve_body( $response );
						$data = json_decode( $body, true );
						if ( $data && is_array( $data ) ) {
							$marketplace = $data;
							// set_transient( self::TRANSIENT, $marketplace, 7 * DAY_IN_SECONDS );
						}
					}
					return $marketplace;
				},
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			)
		);

	}

}
