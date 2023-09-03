// 记录变换基点
let scaleOrigin = {
    x: 0,
    y: 0
};
let translateX = 0;
let translateY = 0;
let beginX: number;
let beginY: number;
let scaleRatio = 1;
// 从变量名就知道它的用途与用法
let preTouchesClientx1y1x2y2 = [] as number[];
// 记录前一次触摸点的位置
let preTouchPosition = {
    x: 0,
    y: 0
};
let layerScale = false
let origin = {
    x: 0,
    y: 0
}
// 查询 DOM 对象的 CSS 值
const getStyle = (target: EventTarget, style: string) => {
    let styles = window.getComputedStyle(target as HTMLElement, null);
    return styles.getPropertyValue(style);
};
const setStyle = (key: string, value: string, canvas: HTMLCanvasElement) => { canvas.style[key] = value; };
const recordPreTouchPosition = (touch: any) => {
    preTouchPosition = {
        x: touch.clientX,
        y: touch.clientY
    };
};
// 获取并解析元素当前的位移量
const getTranslate = (target: EventTarget) => {
    let matrix = getStyle(target, 'transform');
    let nums = matrix.substring(7, matrix.length - 1).split(', ');
    let left = parseInt(nums[4]) || 0;
    let top = parseInt(nums[5]) || 0;
    let scale = nums[0] || 1;
    return { left, top, scale };
};
// 计算新的缩放中心原点，rect 为当前变换后元素的四周的位置
// （为甚么要除以放大值）因为缩放中心原点是相对该元素的，放大后，需重新除以缩放值
const relativeCoordinate = (x: number, y: number, rect: ClientRect) => {
    let cx = (x - rect.left) / scaleRatio;
    let cy = (y - rect.top) / scaleRatio;
    return {
        x: cx,
        y: cy
    };
};
const distance = (x1: number, y1: number, x2: number, y2: number) => {
    let a = x1 - x2;
    let b = y1 - y2;
    return Math.sqrt(a * a + b * b);
};
export const zoomIng = (e: TouchEvent, canvas: HTMLCanvasElement, canvasErasure: HTMLCanvasElement) => {
    let touches = e.touches;
    if (touches.length === 1) {
        let oneTouch = touches['0'];
        let translated = getTranslate(oneTouch.target);
        // preTouchPosition的值在触摸前赋值了
        // 所以oneTouch.clientX - preTouchPosition.x即为translated.left的偏移值
        translateX = oneTouch.clientX - preTouchPosition.x + translated.left;
        translateY = oneTouch.clientY - preTouchPosition.y + translated.top;
        let matrix = `matrix(${scaleRatio}, 0, 0, ${scaleRatio}, ${translateX}, ${translateY})`;
        setStyle('transform', matrix, canvas);
        setStyle('transform', matrix, canvasErasure);
        recordPreTouchPosition(oneTouch);
    } else {
        let one = touches['0'];
        let two = touches['1'];
        scaleRatio = distance(one.clientX, one.clientY, two.clientX, two.clientY) / distance(...preTouchesClientx1y1x2y2 as [number, number, number, number]) * scaleRatio || 1;
        console.log(scaleRatio,'scaleRatio');
        // layerScale为false，才需要重新计算缩放原点、translateX、translateY，固加个条件做下性能优化
        if (!layerScale) {
            layerScale = true;
            // 计算新的缩放中心原点
            origin = relativeCoordinate((one.clientX + two.clientX) / 2, (one.clientY + two.clientY) / 2, canvas.getBoundingClientRect());
            // 缩放后会影响translateX、translateY，缩放后需要重新计算
            // origin.x - scaleOrigin.x为缩放原点变化的值，
            // (scaleRatio - 1)是缩放倍数差值
            // (scaleRatio - 1) * (origin.x - scaleOrigin.x) 则是对应偏移量
            translateX = (scaleRatio - 1) * (origin.x - scaleOrigin.x) + translateX;
            translateY = (scaleRatio - 1) * (origin.y - scaleOrigin.y) + translateY;
            setStyle('transform-origin', `${origin.x}px ${origin.y}px`, canvas);
            setStyle('transform-origin', `${origin.x}px ${origin.y}px`, canvasErasure);
            scaleOrigin = origin;
        }
        let matrix = `matrix(${scaleRatio}, 0, 0, ${scaleRatio}, ${translateX}, ${translateY})`;
        setStyle('transform', matrix, canvas);
        setStyle('transform', matrix, canvasErasure);
        preTouchesClientx1y1x2y2 = [one.clientX, one.clientY, two.clientX, two.clientY];
    }
    e.preventDefault();
}
export const zoomStart = (e: TouchEvent) => {
    let touches = e.touches;
    // 双指同时落下也是有先后顺序的，当发现多指触摸时进行记录
    if (touches.length > 1) {
        let one = touches['0'];
        let two = touches['1'];
        preTouchesClientx1y1x2y2 = [one.clientX, one.clientY, two.clientX, two.clientY];
        // ... 开始缩放事件时，将标志置为 false
        layerScale = false;

    }
    recordPreTouchPosition(touches['0']);
    e.preventDefault();
};
export const zoomEvent = (e: TouchEvent) => {
    let touches = e.touches;
    if (touches.length === 1) {
        recordPreTouchPosition(touches['0']);
    }
    e.preventDefault();
}


const writing = (
    beginX: number,
    beginY: number,
    stopX: number,
    stopY: number,
    ctx: CanvasRenderingContext2D,
) => {
    ctx.save();
    ctx.globalAlpha = 1;  // 设置图片的透明度
    ctx.strokeStyle = 'red';  // 设置路径颜色
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const drawTimes = 16;
    const baseX = beginX, baseY = beginY, baseW = 8;
    const xd = (stopX - baseX) / drawTimes;
    const yd = (stopY - baseY) / drawTimes;
    ctx.beginPath();
    for (let i = 0; i < 16; i++) {
        ctx.lineWidth = baseW
        ctx.moveTo(beginX, beginY);  // 从(beginX, beginY)这个坐标点开始画图
        ctx.lineTo(beginX = beginX + xd, beginY = beginY + yd);
        ctx.stroke();  // 实际地绘制出通过 moveTo() 和 lineTo() 方法定义的路径。默认颜色是黑色。
    }
    ctx.closePath();  // 创建该条路径
    ctx.restore();
};

export const paintIng = (e: TouchEvent, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, ctxErasure?: CanvasRenderingContext2D) => {
    e.preventDefault()
    const touches = e.touches[0];
    const rect = canvas.getBoundingClientRect()
    let stopX = (touches.clientX - rect.left) / scaleRatio;
    let stopY = (touches.clientY - rect.top) / scaleRatio;
    if (ctxErasure) {
        ctx.clearRect(stopX, stopY, 8 * 3, 8 * 3)
    } else {
        writing(beginX, beginY, stopX, stopY, ctx);
    }
    beginX = stopX; // 这一步很关键，需要不断更新起点，否则画出来的是射线簇
    beginY = stopY;
};
export const paintStart = (e: TouchEvent, canvas: HTMLCanvasElement) => {
    const touches = e.touches[0]
    const rect = canvas.getBoundingClientRect()
    beginX = (touches.clientX - rect.left) / scaleRatio;
    beginY = (touches.clientY - rect.top) / scaleRatio;

}

/**
 * 根据父容器大小计算子内容的contain展示方式
 * @param {*} containerWidth
 * @param {*} containerHeight
 * @param {*} imageWidth
 * @param {*} imageHeight
 * @returns
 */
export const getContainSize = (containerWidth :number, containerHeight:number, imageWidth:number, imageHeight:number)=> {
    const layerRatio = containerWidth / containerHeight;
    const imageRatio = imageWidth / imageHeight;

    let width, height, x, y;

    // ratio越小，图片越修长
    // layerRatio <= imageRatio时，图层比较修长，原图宽度占满
    if (layerRatio <= imageRatio) {
        // 图层比较修长，原图宽度占满
        width = containerWidth;
        height = Math.floor(containerWidth / imageRatio);
        x = 0;
        y = (containerHeight - height) / 2;
    } else {
        // 原图比较修长，原图高度占满
        width = Math.floor(containerHeight * imageRatio);
        height = containerHeight;
        x = (containerWidth - width) / 2;
        y = 0;
    }

    return {
        width,
        height,
        x,
        y
    };
};

export const paintEnd = (e: TouchEvent) => {
    let touches = e.touches;
    if (touches.length === 1) {
        recordPreTouchPosition(touches['0']);
    }
}
// 获取本地上传图片
export const getFileUrl = (e: InputEvent) => {
    let files = e.target?.files, file;
    console.log(files, 'files');
    
    if (files && files.length > 0) {
        // 获取目前上传的文件
        file = files[0];
        // 来在控制台看看到底这个对象是什么
        console.log(file);
        // 那么我们可以做一下诸如文件大小校验的动作
        if (file.size > 1024 * 1024 * 5) {
            alert('图片大小不能超过 5MB!');
            return false;
        }
        // 下面是关键的关键，通过这个 file 对象生成一个可用的图像 URL
        // 获取 window 的 URL 工具
        let URL = window.URL || window.webkitURL;
        // 通过 file 生成目标 url
        return URL.createObjectURL(file);
    }
    return ''
}

export const downloadImg = (dataUrl: string) => {
    let aLink = document.createElement('a')
    aLink.download = 'sds.jpg' // 文件名后缀需要和dataurl表示的相同，否则可能乱码
    aLink.href = dataUrl
    console.log(dataUrl, 'dataUrl')
    aLink.click()
}

export const reset = (canvas: HTMLCanvasElement, canvasErasure: HTMLCanvasElement) => {
    scaleRatio = 1
    scaleOrigin = {
        x: 0,
        y: 0
    };
    preTouchPosition = {
        x: 0,
        y: 0
    };
    translateX = 0;
    translateY = 0;
    canvas.style.transform = ''
    canvasErasure.style.transform = ''
    canvas.style.transformOrigin = '50% 50%'
    canvasErasure.style.transformOrigin = '50% 50%';
}

export const mergeCanvas = (contentCanvas: HTMLCanvasElement, baseCanvas: HTMLCanvasElement) => {
    // contentCanvas 和 baseCanvas 分别是两个要合并的 Canvas 元素

    // 创建一个新的 Canvas，宽度和高度等于两个 Canvas 中最大的宽度和高度
    const combinedCanvas = document.createElement('canvas');
    const maxWidth = Math.max(contentCanvas.width, baseCanvas.width);
    const maxHeight = Math.max(contentCanvas.height, baseCanvas.height);
    combinedCanvas.width = maxWidth;
    combinedCanvas.height = maxHeight;

    // 获取两个 Canvas 的内容，并创建对应的 Image 对象
    const image1 = new Image();
    const image2 = new Image();
    image1.src = contentCanvas.toDataURL();
    image1.onload = function () {

        image2.src = baseCanvas.toDataURL();
        image2.onload = function () {

            // 将两个 Image 对象绘制到新的 Canvas 上, 要注意顺序，基底在前面
            const context = combinedCanvas.getContext('2d') as CanvasRenderingContext2D;
            context.drawImage(image2, 0, 0, baseCanvas.width, baseCanvas.height, 0, 0, baseCanvas.width, baseCanvas.height);
            context.drawImage(image1, 0, 0, contentCanvas.width, contentCanvas.height, 0, 0, contentCanvas.width, contentCanvas.height);

            // 将合并后的 Canvas 转换为一个图片文件，然后进行下载
            combinedCanvas.toBlob((blob :Blob | null) => {
                const url = URL.createObjectURL(blob as Blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'combined.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 'image/png');
        }
    }

}