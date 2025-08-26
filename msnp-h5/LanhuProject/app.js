const fs = require('fs');
const path = require('path');

// 定义对应关系映射表
const mapping = {
  "lanhu_daipingjiahuodongxinxi": "待评价-活动信息",
  "lanhu_danxuan": "单选",
  "lanhu_duoxuan": "多选",
  "lanhu_fabudaishenhelishishenhejilu": "发布待审核-历史审核记录",
  "lanhu_fabudaishenheshenhehuodong": "发布待审核-审核活动",
  "lanhu_fabudaishenheshenhexiangqingbianjizhong": "发布待审核-审核详情-编辑中",
  "lanhu_fabudaishenheshenhexiangqingchakan": "发布待审核-审核详情-查看",
  "lanhu_huodongguanlicaogaozhengzaishuruhuodongmingchengyoushaixuanshi": "活动管理-草稿-正在输入活动名称、有筛选时",
  "lanhu_huodongguanlikongzhuangtai": "活动管理-空状态",
  "lanhu_huodongguanliquanbu": "活动管理-全部",
  "lanhu_huodongshenhebutongguogengxinhuodong": "活动审核不通过-更新活动",
  "lanhu_huodongshenhebutongguolishishenhejilu": "活动审核不通过-历史审核记录",
  "lanhu_huodongshenhetongguoqiandaox2ffankuierweima": "活动审核通过-签到／反馈二维码",
  "lanhu_huodongsousuobeifen": "活动搜索备份",
  "lanhu_huodongxiangqinghuodongxinxibaocun": "活动详情-活动信息-保存",
  "lanhu_huodongxiangqinghuodongxinxibianji": "活动详情-活动信息-编辑",
  "lanhu_huodongxiangqinghuodongxinxibukebianji": "活动详情-活动信息-不可编辑",
  "lanhu_huodongxiangqingshenhejilu": "活动详情-审核记录",
  "lanhu_pingjiashenhebutongguogengxinpingjiafankui1": "评价审核不通过-更新评价反馈1",
  "lanhu_pingjiashenhetongguofankuierweima": "评价审核通过-反馈二维码",
  "lanhu_xinjianhuodongchanshuohui": "新建活动-产说会",
  "lanhu_xinjianhuodongjiankangjiangzuo": "新建活动-健康讲座",
  "lanhu_xinjianhuodongjiankangjiangzuoduozujiangshi": "新建活动-健康讲座-多组讲师",
  "lanhu_xinjianhuodongyizhen": "新建活动-义诊",
  "lanhu_yipingjiadaishenhelishishenhejilu": "已评价待审核-历史审核记录",
  "lanhu_yipingjiadaishenheshenhepingjiafankuichakan": "已评价待审核-审核评价反馈-查看",
  "lanhu_yipingjiadaishenheshenhepingjiafankuishenhe": "已评价待审核-审核评价反馈-审核"
};

// 设置目录路径（根据实际位置修改）
const dir2Path = './';

// 读取目录内容
fs.readdir(dir2Path, { withFileTypes: true }, (err, dirents) => {
  if (err) {
    console.error('读取目录失败:', err);
    return;
  }

  // 筛选文件夹
  const folders = dirents
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  // 执行重命名
  folders.forEach(oldName => {
    if (mapping[oldName]) {
      const newName = mapping[oldName];
      const oldPath = path.join(dir2Path, oldName);
      const newPath = path.join(dir2Path, newName);

      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          console.error(`重命名失败: ${oldName} => ${newName}`, err);
        } else {
          console.log(`重命名成功: ${oldName} => ${newName}`);
        }
      });
    } else {
      console.log(`跳过未映射项: ${oldName}`);
    }
  });
});
