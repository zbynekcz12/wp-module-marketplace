
import { default as MarketplaceItem } from '../marketplaceItem/';

/**
 * MarketplaceList Component
 * For use in Marketplace to display a list of marketplace items
 * 
 * @param {*} props 
 * @returns 
 */

const MarketplaceList = ({ marketplaceItems, category = 'all', Components, methods, constants }) => {
    return (
        <div className="grid col2">
            {
			marketplaceItems
				.filter((item) => {
					return category === 'all' || item.category.includes( category )
				})
				.map((item) => (
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
    )
};

export default MarketplaceList;