import { default as MarketplaceList } from '../marketplaceList/';

/**
 * Marketplace Module
 * For use in brand app to display marketplace
 * 
 * @param {*} props 
 * @returns 
 */
 const Marketplace = ({methods, constants, Components, ...props}) => {
    const [ isLoading, setIsLoading ] = methods.useState( true );
	const [ marketplaceCategories, setMarketplaceCategories ] = methods.useState( ['All'] );
    const [ marketplaceItems, setMarketplaceItems ] = methods.useState( [] );
	const [ initialTab, setInitialTab ] = methods.useState( 'all' );

	// const location = methods.useLocation();
	// const navigate = methods.useNavigate();

	const onTabNavigate = ( tabName ) => {
		// methods.navigate( '/marketplace/' + tabName, { replace: true } );
        // console.log( tabName );
    };

	// useEffect( () => {
	// 	if ( location.pathname.includes( '/services' ) ) {
	// 		setInitialTab( 'services' );
	// 	} else if ( location.pathname.includes( '/themes' ) ) {
	// 		setInitialTab( 'themes' );
	// 	} else if ( ! location.pathname.includes( '/plugins' ) ) {
	// 		methods.navigate( '/marketplace/plugins', { replace: true } );
	// 	}
	// 	setIsLoading( false );
	// }, [ location ] );
    
    /**
     * on mount load all marketplace data from module api
     */
    methods.useEffect(() => {
        methods.apiFetch( {
            url: `${constants.resturl}/newfold-marketplace/v1/marketplace`
        }).then( ( response ) => {
            setIsLoading( false );
            setMarketplaceItems( response );
            setMarketplaceCategories( collectCategories( response ) );
		});
	}, [] );

    /**
     * map all categories into an array for consuming by tabpanel component
     * @param Array products 
     * @returns 
     */
    const collectCategories = ( products ) => {
		let categories = [
			{
				name: 'all',
				title: 'Everything',
                currentCount: constants.perPage
			}
		];
		let cats = new Set();
		products.forEach((product) => {
			product.category.forEach((category) => {
				cats.add( category );
			});
		});
		cats.forEach((cat)=>{
			categories.push( {
				name: cat,
				title: cat,
                currentCount: constants.perPage
			});
		});
		return categories;
    };

    /**
     * Save a potential updated display counts per category
     * @param string categoryName 
     * @param Number newCount 
     */
    const saveCategoryDisplayCount = (categoryName, newCount) => {
        let updatedMarketplaceCategories = [...marketplaceCategories];
        // find matching cat, and update perPage amount
        updatedMarketplaceCategories.forEach((cat)=>{
            if (cat.name === categoryName ) {
                cat.currentCount = newCount;
            }
        });
        setMarketplaceCategories( updatedMarketplaceCategories );
    };

    return (
        <div className={methods.classnames('newfold-marketplace-wrapper')}>
            { isLoading && 
                <Components.Spinner />
            }
            <Components.TabPanel
				className="newfold-marketplace-tabs"
				activeClass="current-tab"
				orientation="vertical"
				initialTabName={ initialTab }
				onSelect={ onTabNavigate }
				tabs={ marketplaceCategories }
			>
				{ ( tab ) => <MarketplaceList
                    marketplaceItems={marketplaceItems}
					category={tab.name}
                    Components={Components}
					methods={methods}
					constants={constants}
                    currentCount={tab.currentCount}
                    saveCategoryDisplayCount={saveCategoryDisplayCount}
                /> }
			</Components.TabPanel>
        </div>
    )

};

export default Marketplace;