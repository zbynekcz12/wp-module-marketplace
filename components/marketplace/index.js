/**
 * Marketplace Module
 * For use in brand app to display marketplace
 * 
 * @param {*} props 
 * @returns 
 */
 const Marketplace = ({methods, constants, Components, ...props}) => {
    const [ isLoading, setIsLoading ] = methods.useState( true );
	// const [ marketplaceTypes, setMarketplaceTypes ] = useState( [] );
    const [ marketplaceItems, setMarketplaceItems ] = methods.useState( [] );

	const [ initialTab, setInitialTab ] = methods.useState( 'all' );
	// const location = methods.useLocation();
	// const navigate = useNavigate();

	const onTabNavigate = ( tabName ) => {
		// navigate( '/marketplace/' + tabName, { replace: true } );
        console.log(tabName);
    };

	// useEffect( () => {
	// 	if ( location.pathname.includes( '/services' ) ) {
	// 		setInitialTab( 'services' );
	// 	} else if ( location.pathname.includes( '/themes' ) ) {
	// 		setInitialTab( 'themes' );
	// 	} else if ( ! location.pathname.includes( '/plugins' ) ) {
	// 		navigate( '/marketplace/plugins', { replace: true } );
	// 	}
	// 	setIsLoading( false );
	// }, [ location ] );

	// if ( isLoading || ! marketplaceItems.length < 0 ) {
	// 	return <Components.Spinner />;
	// }
    
    // on mount load all marketplace data from module api
    methods.useEffect(() => {
        methods.apiFetch( {
            url: `${constants.resturl}/newfold-marketplace/v1/marketplace`
        }).then( ( response ) => {
            setIsLoading(false);
            setMarketplaceItems(response); // all products
            // setMarketplaceTypes(response); // map all types into an array
		});
	}, [] );

    return (
        <div className={methods.classnames('newfold-marketplace-wrapper')}>
            <Components.TabPanel
				className="newfold-marketplace-tabs"
				activeClass="current-tab"
				orientation="vertical"
				initialTabName={ initialTab }
				onSelect={ onTabNavigate }
				tabs={ [
					{
						name: 'all',
						className: 'all',
						title: 'Everything'
					},
					{
						name: 'plugin',
						className: 'plugins',
						title: 'Plugins'
					},
					{
						name: 'service',
						className: 'services',
						title: 'Services'
					},
					{
						name: 'theme',
						className: 'themes',
						title: 'Themes'
					},
				] }
			>
				{ ( tab ) => <MarketplaceList
                    marketplaceItems={marketplaceItems}
                    type={tab.name}
                    Components={Components}
                /> }
			</Components.TabPanel>
        </div>
    )

};

const MarketplaceList = ({ marketplaceItems, type = 'all', Components }) => {
    return (
        <div className="grid col2">
            {marketplaceItems.filter((item) => {
                return type === 'all' || item.type === type
            }).map((item) => (
                <MarketplaceItem 
                    type={type}
                    key={item.hash} 
                    item={item}
                    Components={Components}
                />
            ))}
        </div>
    )
};

const MarketplaceItem = ({ item, Components }) => {

    return (
        <Components.Card className={ `marketplace-item marketplace-item-${ item.hash }` }>
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
                    <Components.Button variant="primary" href={ item.primaryUrl }>
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

export default Marketplace;