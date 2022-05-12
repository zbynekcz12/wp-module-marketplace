
import { default as MarketplaceItem } from '../marketplaceItem/';

/**
 * MarketplaceList Component
 * For use in Marketplace to display a list of marketplace items
 * 
 * @param {*} props 
 * @returns 
 */

const MarketplaceList = ({ marketplaceItems, category = 'all', Components, methods, constants }) => {
    const perPage = 6;
    const [ itemsCount, setItemsCount ] = methods.useState( 6 );
    const [ currentItems, setCurrentItems ] = methods.useState( [] );
    const [ activeItems, setActiveItems ] = methods.useState( [] )

    const filterParoductsByCategory = (items, category) => {
        return items.filter((item) => {
            return category === 'all' || item.category.includes( category )
        });
    };

    const setProductListLength = (items, itemsCount) => {
        let itemCount = 0;
        return items.filter((item) => {
            itemCount++;
            return itemCount <= itemsCount;
        });
    };

    // increment itemCount by perPage amount
    const loadMoreClick = () => {
        setItemsCount( itemsCount + perPage );
    };

    // init
    methods.useEffect(() => {
        setCurrentItems( filterParoductsByCategory(marketplaceItems, category) );
    }, []);

    // recalculate activeItems if perPage changes
    methods.useEffect(() => {
        setActiveItems( setProductListLength(currentItems, itemsCount) );
    }, [ currentItems, itemsCount ] );


    return (
        <div className="marketplaceList">
            <div className="grid col2">
                {
                activeItems.map((item) => (
                        <MarketplaceItem
                            key={item.hash} 
                            item={item}
                            Components={Components}
                            methods={methods}
                            constants={constants}
                        />
                    ))
                }
            </div>
            { currentItems && currentItems.length > itemsCount &&
                <div style={{ display: 'flex', margin: '1rem 0'}}>
                    <Components.Button
                        onClick={loadMoreClick}
                        variant="primary" 
                        className="align-center"
                        style={{margin: 'auto'}}
                    >
                        Load More
                    </Components.Button>
                </div>
            }
        </div>
    )
};

export default MarketplaceList;