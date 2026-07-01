// 基础工具函数
function loadImage(src) {
  return new Promise((resolve, reject) => {
    // const img = new Image();
    const img = document.createElement("img");

    img.onload = () => resolve(img); // 加载成功
    img.onerror = () => reject(new Error(`图片加载失败: ${src}`)); // 加载失败
    img.src = src; // 触发加载
  });
}

// 使用
async function loadImages(imageUrls) {
  try {
    // map() 会对数组中的每个元素执行一个函数
    // (url) => loadImage(url)返回一个处理后的数组数据
    const images = await Promise.all(imageUrls.map((url) => loadImage(url)));

    // 所有图片加载完成后显示
    // console.log(images);

    // renderImages(images);
  } catch (error) {
    console.error("图片加载失败:", error);
  }
}

// 调用
loadImages([
  "https://ss-mpvolc.meipian.me/users/1037183/cd559a3ef156ab24e4c5ee136d5d7d6empand__jpg.heic~tplv-s1ctq42ewb-wm-s2-cC-q:watermark/1/image/dG9zLWNuLWktczFjdHE0MmV3Yi9hcnRpY2xlL2NvbnRlbnRfaW1nX2xvZ28ucG5n/dissolve/80/gravity/SouthEast/dx/12/dy/86/ws/0.09/wst/2%7Cwatermark/2/text/QOabvOiIng/dissolve/80/gravity/SouthEast/dx/12/dy/47/font/UWluaXUgRm9udA/fontsize/460/fill/I2ZmZmZmZg%7Cwatermark/2/text/576O56-H5Y-3OjEwMzcxODM/dissolve/80/gravity/SouthEast/dx/12/dy/12/font/UWluaXUgRm9udA/fontsize/460/fill/I2ZmZmZmZg:750:0:0:0:q80.webp",
  "https://ss-mpvolc.meipian.me/users/1037183/a25f61409bde68db059c2d3fac7e8a72mpand__jpg.heic~tplv-s1ctq42ewb-wm-s2-cC-q:watermark/1/image/dG9zLWNuLWktczFjdHE0MmV3Yi9hcnRpY2xlL2NvbnRlbnRfaW1nX2xvZ28ucG5n/dissolve/80/gravity/SouthEast/dx/13/dy/99/ws/0.09/wst/2%7Cwatermark/2/text/QOabvOiIng/dissolve/80/gravity/SouthEast/dx/13/dy/52/font/UWluaXUgRm9udA/fontsize/520/fill/I2ZmZmZmZg%7Cwatermark/2/text/576O56-H5Y-3OjEwMzcxODM/dissolve/80/gravity/SouthEast/dx/13/dy/13/font/UWluaXUgRm9udA/fontsize/520/fill/I2ZmZmZmZg:750:0:0:0:q80.webp",
  "https://ss-mpvolc.meipian.me/users/1037183/a25f61409bde68db059c2d3fac7e8a72mpand__jpg.heic~tplv-s1ctq42ewb-wm-s2-cC-q:watermark/1/image/dG9zLWNuLWktczFjdHE0MmV3Yi9hcnRpY2xlL2NvbnRlbnRfaW1nX2xvZ28ucG5n/dissolve/80/gravity/SouthEast/dx/13/dy/99/ws/0.09/wst/2%7Cwatermark/2/text/QOabvOiIng/dissolve/80/gravity/SouthEast/dx/13/dy/52/font/UWluaXUgRm9udA/fontsize/520/fill/I2ZmZmZmZg%7Cwatermark/2/text/576O56-H5Y-3OjEwMzcxODM/dissolve/80/gravity/SouthEast/dx/13/dy/13/font/UWluaXUgRm9udA/fontsize/520/fill/I2ZmZmZmZg:750:0:0:0:q80.webp",
  "https://ss-mpvolc.meipian.me/users/1037183/cd559a3ef156ab24e4c5ee136d5d7d6empand__jpg.heic~tplv-s1ctq42ewb-wm-s2-cC-q:watermark/1/image/dG9zLWNuLWktczFjdHE0MmV3Yi9hcnRpY2xlL2NvbnRlbnRfaW1nX2xvZ28ucG5n/dissolve/80/gravity/SouthEast/dx/12/dy/86/ws/0.09/wst/2%7Cwatermark/2/text/QOabvOiIng/dissolve/80/gravity/SouthEast/dx/12/dy/47/font/UWluaXUgRm9udA/fontsize/460/fill/I2ZmZmZmZg%7Cwatermark/2/text/576O56-H5Y-3OjEwMzcxODM/dissolve/80/gravity/SouthEast/dx/12/dy/12/font/UWluaXUgRm9udA/fontsize/460/fill/I2ZmZmZmZg:750:0:0:0:q80.webp",
  "https://ss-mpvolc.meipian.me/users/1037183/a25f61409bde68db059c2d3fac7e8a72mpand__jpg.heic~tplv-s1ctq42ewb-wm-s2-cC-q:watermark/1/image/dG9zLWNuLWktczFjdHE0MmV3Yi9hcnRpY2xlL2NvbnRlbnRfaW1nX2xvZ28ucG5n/dissolve/80/gravity/SouthEast/dx/13/dy/99/ws/0.09/wst/2%7Cwatermark/2/text/QOabvOiIng/dissolve/80/gravity/SouthEast/dx/13/dy/52/font/UWluaXUgRm9udA/fontsize/520/fill/I2ZmZmZmZg%7Cwatermark/2/text/576O56-H5Y-3OjEwMzcxODM/dissolve/80/gravity/SouthEast/dx/13/dy/13/font/UWluaXUgRm9udA/fontsize/520/fill/I2ZmZmZmZg:750:0:0:0:q80.webp",
  "https://ss-mpvolc.meipian.me/users/1037183/a25f61409bde68db059c2d3fac7e8a72mpand__jpg.heic~tplv-s1ctq42ewb-wm-s2-cC-q:watermark/1/image/dG9zLWNuLWktczFjdHE0MmV3Yi9hcnRpY2xlL2NvbnRlbnRfaW1nX2xvZ28ucG5n/dissolve/80/gravity/SouthEast/dx/13/dy/99/ws/0.09/wst/2%7Cwatermark/2/text/QOabvOiIng/dissolve/80/gravity/SouthEast/dx/13/dy/52/font/UWluaXUgRm9udA/fontsize/520/fill/I2ZmZmZmZg%7Cwatermark/2/text/576O56-H5Y-3OjEwMzcxODM/dissolve/80/gravity/SouthEast/dx/13/dy/13/font/UWluaXUgRm9udA/fontsize/520/fill/I2ZmZmZmZg:750:0:0:0:q80.webp",
]);
