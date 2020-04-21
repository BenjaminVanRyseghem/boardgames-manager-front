export default function yearCopyright(startingYear) {
	let year = startingYear.toString();
	let currentYear = new Date()
		.getFullYear()
		.toString();

	if (year === currentYear) {
		return year;
	}

	return `${year} - ${currentYear}`;
}
