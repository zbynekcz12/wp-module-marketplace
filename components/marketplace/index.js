/**
 * Marketplace Module
 * For use in brand app to display marketplace
 * 
 * @param {*} props 
 * @returns 
 */
 const Marketplace = ({useState, useEffect, ...props}) => {
    const [ isLoading, setIsLoading ] = useState( true );
	// const [ marketplaceTypes, setMarketplaceTypes ] = useState( [] );
    const [ marketplaceItems, setMarketplaceItems ] = useState( [] );
    
    // on mount load all marketplace data from module api
    useEffect(() => {
        props.apiFetch( {
            url: `${props.resturl}/newfold-marketplace/v1/marketplace`
        }).then( ( response ) => {
            setIsLoading(false);
            setMarketplaceItems(response); // all products
            // setMarketplaceTypes(response); // map all types into an array
		});
	}, [] );

    return (
        <div className={props.classnames('newfold-marketplace-wrapper')}>
            <h1>Marketplace</h1>
            <div className="grid col2">
                {marketplaceItems.map((item) => (
                    <MarketplaceItem 
                        key={item.hash} 
                        item={item}
                        Card={props.Card}
                        CardHeader={props.CardHeader}
                        CardFooter={props.CardFooter}
                        CardMedia={props.CardMedia}
                        CardBody={props.CardBody}
                        Button={props.Button}
                    />
                ))}
            </div>
        </div>
    )

};

const MarketplaceItem = ({ item, Card, CardMedia, CardHeader, CardBody, CardFooter, Button }) => {

    return (
        <Card className={ `marketplace-item marketplace-item-${ item.hash }` }>
			{ item.productThumbnailUrl && (
				<CardMedia>
					<img src={ item.productThumbnailUrl } alt={ item.name + ' thumbnail' } />
				</CardMedia>
			) }
			<CardHeader>
				<h3>{ item.name }</h3>
				{ item.price && <em className="price">{ item.price }</em> }
			</CardHeader>
			{ item.description && <CardBody>{ item.description }</CardBody> }
			<CardFooter>
                { item.primaryCallToAction && item.primaryUrl &&
                    <Button variant="primary" href={ item.primaryUrl }>
                        { item.primaryCallToAction }
                    </Button>
                }
                { item.secondaryCallToAction && item.secondaryUrl &&
                    <Button variant="secondary" href={ item.secondaryUrl }>
                        { item.secondaryCallToAction }
                    </Button>
                }
			</CardFooter>
		</Card>
    );
};

export default Marketplace;