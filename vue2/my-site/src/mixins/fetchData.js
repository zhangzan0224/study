// 公共的远程获取数据的代码
export default function (defaultValue = null) {
	return {
		data() {
			return {
				isLoading: true,
				data: defaultValue,
			}
		},
		async created() {
			this.isLoading = true
			this.data = await this.fetchData()
			this.isLoading = false
		},
	}
}
