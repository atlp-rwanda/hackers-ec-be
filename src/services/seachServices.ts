import { Op } from "sequelize";
import { queryParamsAttribute } from "../types/searchProductParams";
import { findCategory } from "../utils/search.util";

const searchCondtion = async (queryParams: queryParamsAttribute) => {
	const { name, minPrice, maxPrice, categoryName } = queryParams;
	const condition: any = {};
	if (name) {
		condition.name = { [Op.iLike]: `%${name}%` };
	}
	if (maxPrice && minPrice) {
		condition.price = {
			[Op.between]: [minPrice, maxPrice],
		};
	} else if (minPrice) {
		condition.price = {
			[Op.gt]: [minPrice],
		};
	} else if (maxPrice) {
		condition.price = {
			[Op.lt]: [maxPrice],
		};
	}

	if (categoryName) {
		const category = await findCategory(categoryName);
		if (category) {
			condition.categoryId = {
				[Op.eq]: category,
			};
		}
	}
	const whereClause = { [Op.or]: condition };
	return whereClause;
};
export default searchCondtion;
