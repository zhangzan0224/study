// 定义一个vue可以使用的loading指令
// 使用方式：<div v-loading="loading"></div>
// loading为一个布尔值，为true时显示loading，为false时隐藏loading
import loadingUrl from '@/assets/loading.svg'
import styles from './loading.module.less'
function getLoadingImg(el) {
	return el.querySelector('img[data-role=loading]')
}
function createLoadingImg() {
	const img = document.createElement('img')
	img.dataset.role = 'loading'
	img.src = loadingUrl
	img.className = styles.loading
	return img
}
export default function (el, binding) {
	if (binding.value) {
		// 代表需要展示loading
		if (!getLoadingImg(el)) {
			const img = createLoadingImg()
			el.appendChild(img)
		}
	} else {
		if (getLoadingImg(el)){
			getLoadingImg(el).remove()
		}
	}
}
