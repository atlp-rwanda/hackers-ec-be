export const deleteTableData = async (Model: any, tableName: string) => {
	try {
		const deletedRows = await Model.destroy({
			where: {},
			truncate: true,
			cascade: true
		});
		if (deletedRows) {
			console.log(`${deletedRows} rows have been deleted from ${tableName}.`);
		}
	} catch (error) {
		console.log("Something went wrong in the process:", error);
	}
};
