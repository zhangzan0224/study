// 格式化时间,通过时间戳格式成中国时间
export  function formatDate(timestamp) {
	const date = new Date(+timestamp);
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date
		.getDate()
		.toString()
		.padStart(2, "0");
	return `${date.getFullYear()}-${month}-${day}`;
}
