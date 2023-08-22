import { default as MarketplaceList } from '../marketplaceList/';
import { default as MarketplaceIsLoading } from '../marketplaceIsLoading/';

/**
 * Marketplace Module
 * For use in brand app to display marketplace
 * 
 * @param {*} props 
 * @returns 
 */
 const Marketplace = ({methods, constants, ...props}) => {
	const [ isLoading, setIsLoading ] = methods.useState( true );
	const [ isError, setIsError ] = methods.useState( false );
	const [ marketplaceCategories, setMarketplaceCategories ] = methods.useState( [] );
	const [ marketplaceItems, setMarketplaceItems ] = methods.useState( [] );
    const [ products, setProducts ] = methods.useState( [] );
    const [ activeCategoryIndex, setActiveCategoryIndex ] = methods.useState( 0 );
	let location = methods.useLocation();

	/**
	 * on mount load all marketplace data from module api
	 */
	methods.useEffect(() => {
		methods.apiFetch( {
			url: methods.NewfoldRuntime.createApiUrl( `/newfold-marketplace/v1/marketplace` )
		}).then( ( response ) => {
			// check response for data
			if ( ! response.hasOwnProperty('categories') || ! response.hasOwnProperty('products') ) {
				setIsError( true );
			} else {
				setMarketplaceItems( response.products.data );
				setMarketplaceCategories( validateCategories(response.categories.data) );
			}
		});
	}, [] );

	/**
	 * When marketplaceItems changes
	 * verify that there are products
	 */
	 methods.useEffect(() => {
		// only after a response
		if ( !isLoading ) {
			// if no marketplace items, display error
			if ( marketplaceItems.length < 1 ) {
				setIsError( true );
			} else {
				setIsError( false );
			}
		}
	}, [ marketplaceItems, products ] );

	/**
	 * When marketplaceCategories changes
	 * verify that the tab is a category
	 */
	 methods.useEffect(() => {
		let aci = 0;
		// only before rendered, but after categories are populated
		if ( marketplaceCategories.length > 1 ) {
			// read initial tab from path
			if ( location.pathname.includes( 'marketplace/' ) ) {
				const urlpath = location.pathname.substring( 
					location.pathname.lastIndexOf( '/' ) + 1
				);

				// make sure a category exists for that path
				if ( urlpath && marketplaceCategories.filter(cat => cat.name === urlpath ).length != 0 ) {
					// if found, set the active category
					marketplaceCategories.forEach((cat, i) => {
						if ( cat.name === urlpath ) {
							aci = i;
						}
					});
				}
			}
			setActiveCategoryIndex( aci );
			filterProducts( aci );
			applyStyles();
		}
	}, [ marketplaceCategories, location.pathname ] );

	/**
	 * Filter products based on urlpath
	 */
	const filterProducts = ( activeCategoryIndex ) => {
		const category = marketplaceCategories[activeCategoryIndex].name;
        const filterdProducts = marketplaceItems.filter((product) => {
            return product.categories.some(element => {
                return element.toLowerCase() === category.toLowerCase();
              });
              
        });            

        setProducts(filterdProducts);
        setIsLoading(false);
    };

	/**
	 * Validate provided category data
	 * @param Array categories 
	 * @returns 
	 */
	const validateCategories = ( categories ) => {
		
		if ( ! categories.length ) {
			return [];
		}
		
		let thecategories = [];
		categories.forEach((cat)=>{
			cat.currentCount = constants.perPage;
			cat.className = 'newfold-marketplace-category-'+cat.name;

			if ( cat.products_count > 0 ) {
				thecategories.push(cat);
			}
		});
		
		return thecategories;
	};

	/**
	 * Save a potential updated display counts per category
	 * @param string categoryName 
	 * @param Number newCount 
	 */
	const saveCategoryDisplayCount = (categoryName, newCount) => {
		let updatedMarketplaceCategories = [...marketplaceCategories];
		// find matching cat, and update perPage amount
		updatedMarketplaceCategories.forEach( (cat) => {
			if (cat.name === categoryName ) {
				cat.currentCount = newCount;
			}
		});
		setMarketplaceCategories( updatedMarketplaceCategories );
	};

	/**
	 * Apply styles if they exist
	 */
	 const applyStyles = () => {
		if ( marketplaceCategories ) {
			marketplaceCategories.forEach( (category) => {
				if( 
					category.styles && // category has styles
					!document.querySelector('[data-styleid="' + category.className + '"]') // not already added
				) {
					const style = document.createElement("style")
					style.textContent = category.styles;
					style.dataset.styleid = category.className;
					document.head.appendChild(style);
				}
			});
		}
	};

	/**
	 * render marketplace preloader
	 * 
	 * @returns React Component
	 */
	 const renderSkeleton = () => {
		// render default skeleton
		return <MarketplaceIsLoading />;
	}

	return (
		<div className={methods.classnames('newfold-marketplace-wrapper')}>
			{ isLoading && 
				renderSkeleton()
			}
			{ isError && 
				<h3>Oops, there was an error loading the marketplace, please try again later.</h3>
			}
			{ !isLoading && !isError &&
					<MarketplaceList
						marketplaceItems={products}
						category={marketplaceCategories[activeCategoryIndex]}
						currentCount={marketplaceCategories[activeCategoryIndex].currentCount}
						methods={methods}
						constants={constants}
					/>

			}
		</div>
	)

};

export default Marketplace;