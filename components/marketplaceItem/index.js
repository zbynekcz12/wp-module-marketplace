/**
 * MarketplaceItem Component
 * For use in Marketplace to display marketplace items
 * 
 * @param {*} props 
 * @returns 
 */
 const MarketplaceItem = ({ item, Components, methods, constants }) => {

    /**
     * Send events to the WP REST API
     *
     * @param {Object} event The event data to be tracked.
     */
	 const sendEvent = (event)  => {
        event.data = event.data || {};
        event.data.page = window.location.href;
        methods.apiFetch({
            url: `${constants.resturl}${constants.eventendpoint}`,
            method: 'POST', 
            data: event
        });
    }

    /**
     * Handle button clicks
     * @param Event event 
     * @returns 
     */
    const onButtonNavigate = ( event ) => {
        if ( event.keycode && ENTER !== event.keycode ) {
			return;
		}
        sendEvent({
            action: 'newfold-marketplaceitem-click',
            data: {
                element: 'button',
                label: event.target.innerText,
                productId: item.id,
            }
        })
    }

    /**
     * Handle link clicks
     * @param Event event 
     * @returns 
     */
    const onAnchorNavigate = ( event ) => {
        if ( event.keycode && ENTER !== event.keycode ) {
			return;
		}
        sendEvent({
            action: 'newfold-marketplaceitem-click',
            data: {
                element: 'a',
                href: event.target.getAttribute('href'),
                label: event.target.innerText,
                productId: item.id,
            }
        })
    }
	
    /**
     * initial set up - adding event listeners
     */
	methods.useEffect(() => {
        const itemContainer   = document.getElementById(`marketplace-item-${ item.id }`);
        const itemButtons     = Array.from(itemContainer.querySelectorAll('button'));
        const itemAnchors     = Array.from(itemContainer.querySelectorAll('a'));

		if (itemButtons.length) {
            itemButtons.forEach(
                button => {
                    if (button.getAttribute('data-action') !== 'close') {
                        button.addEventListener('click', onButtonNavigate);
                        button.addEventListener('onkeydown', onButtonNavigate);
                    }
                }
            )
        }

        if (itemAnchors.length) {
            itemAnchors.forEach(
                link => {
                    if (link.getAttribute('data-action') !== 'close') {
                        link.addEventListener('click', onAnchorNavigate);
                        link.addEventListener('onkeydown', onAnchorNavigate);
                    }
                }
            )
        }

        // unmount remove event listeners
        return () => {
			if (itemButtons.length) {
                itemButtons.forEach(
					button => {
						if (button.getAttribute('data-action') !== 'close') {
                            button.removeEventListener('click', onButtonNavigate);
                            button.removeEventListener('onkeydown', onButtonNavigate);
						}
					}
				)
            }
            if (itemAnchors.length) {
				itemAnchors.forEach(
					link => {
						if (link.getAttribute('data-action') !== 'close') {
                            link.removeEventListener('click', onAnchorNavigate);
                            link.removeEventListener('onkeydown', onAnchorNavigate);
						}
					}
				)
            }
		}
	}, [] );

    return (
        <Components.Card className={ `marketplace-item marketplace-item-${ item.id }` } id={`marketplace-item-${ item.id }`}>
			{ item.productThumbnailUrl && (
				<Components.CardMedia>
					<img src={ item.productThumbnailUrl } alt={ item.name + ' thumbnail' } />
				</Components.CardMedia>
			) }
			<Components.CardHeader>
				<h3>{ item.name }</h3>
				{ item.price && <em className="price">{ item.price }</em> }
			</Components.CardHeader>
			{ item.description && <Components.CardBody>{ item.description }</Components.CardBody> }
			<Components.CardFooter>
                { item.primaryCallToAction && item.primaryUrl &&
                    <Components.Button 
                        variant="primary" 
                        href={ item.clickToBuyId ? undefined : item.primaryUrl }
                        data-action={ item.clickToBuyId ? 'load-nfd-ctb' : undefined }
                        data-ctb-id={ item.clickToBuyId ? item.clickToBuyId : undefined }
                    >
                        { item.primaryCallToAction }
                    </Components.Button>
                }
                { item.secondaryCallToAction && item.secondaryUrl &&
                    <Components.Button variant="secondary" href={ item.secondaryUrl }>
                        { item.secondaryCallToAction }
                    </Components.Button>
                }
			</Components.CardFooter>
		</Components.Card>
    );
};

export default MarketplaceItem;