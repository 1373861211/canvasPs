// 记录变换基点
let scaleOrigin = {
    x: 0,
    y: 0
};
let translateX = 0;
let translateY = 0;
let beginX: number;
let beginY: number;
let left: number;
let top: number;
let scale: number;
let scaleRatio = 1;
// 从变量名就知道它的用途与用法
let preTouchesClientx1y1x2y2 = [] as number[];
// 记录前一次触摸点的位置
let preTouchPosition = {
    x: 0,
    y: 0
};
let layerScale = false
// 查询 DOM 对象的 CSS 值
const getStyle = (target: EventTarget, style: string) => {
    let styles = window.getComputedStyle(target as HTMLElement, null);
    return styles.getPropertyValue(style);
};
const setStyle = (key: string, value: string, canvas: HTMLCanvasElement) => { canvas.style[key] = value; };
const recordPreTouchPosition = (touch: any) => {
    preTouchPosition = {
        x: touch.pageX,
        y: touch.pageY
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
// 计算相对缩放前的偏移量，rect 为当前变换后元素的四周的位置
const relativeCoordinate = (x: number, y: number, rect: ClientRect) => {
    console.log(rect.left, 'rect.left')
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
        translateX = oneTouch.pageX - preTouchPosition.x + translated.left;
        translateY = oneTouch.pageY - preTouchPosition.y + translated.top;
        let matrix = `matrix(${scaleRatio}, 0, 0, ${scaleRatio}, ${translateX}, ${translateY})`;
        setStyle('transform', matrix, canvas);
        setStyle('transform', matrix, canvasErasure);
        recordPreTouchPosition(oneTouch);
    } else {
        let one = touches['0'];
        let two = touches['1'];
        scaleRatio = distance(one.pageX, one.pageY, two.pageX, two.pageY) / distance(...preTouchesClientx1y1x2y2 as [number, number, number, number]) * scaleRatio || 1;
        if (!layerScale) {
            layerScale = true;
            // 移动视线中心
            let origin = relativeCoordinate((one.pageX + two.pageX) / 2, (one.pageY + two.pageY) / 2, canvas.getBoundingClientRect());
            // 修正视野变化带来的平移量
            translateX = (scaleRatio - 1) * (origin.x - scaleOrigin.x) + translateX;
            translateY = (scaleRatio - 1) * (origin.y - scaleOrigin.y) + translateY;
            setStyle('transform-origin', `${origin.x}px ${origin.y}px`, canvas);
            setStyle('transform-origin', `${origin.x}px ${origin.y}px`, canvasErasure);
            scaleOrigin = origin;
        }
        let matrix = `matrix(${scaleRatio}, 0, 0, ${scaleRatio}, ${translateX}, ${translateY})`;
        setStyle('transform', matrix, canvas);
        setStyle('transform', matrix, canvasErasure);
        preTouchesClientx1y1x2y2 = [one.pageX, one.pageY, two.pageX, two.pageY];
    }
    e.preventDefault();
}
export const zoomStart = (e: TouchEvent) => {
    let touches = e.touches;
    // 双指同时落下也是有先后顺序的，当发现多指触摸时进行记录
    if (touches.length > 1) {
        let one = touches['0'];
        let two = touches['1'];
        preTouchesClientx1y1x2y2 = [one.pageX, one.pageY, two.pageX, two.pageY];
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
    for (let i = 0; i < 16; i++) {
        ctx.beginPath();
        ctx.lineWidth = baseW
        ctx.moveTo(beginX, beginY);  // 从(beginX, beginY)这个坐标点开始画图
        ctx.lineTo(beginX = beginX + xd, beginY = beginY + yd);
        ctx.stroke();  // 实际地绘制出通过 moveTo() 和 lineTo() 方法定义的路径。默认颜色是黑色。
        ctx.closePath();  // 创建该条路径
    }
    ctx.restore();
};

export const paintIng = (e: TouchEvent, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, ctxErasure?: CanvasRenderingContext2D) => {
    e.preventDefault()
    const translate = getTranslate(e.touches[0].target)
    left = translate.left
    top = translate.top
    console.log(left, 'left', top, 'top', scale)
    const touches = e.touches[0];
    console.log(touches.pageX, touches.pageY, 'canvas', canvas.offsetLeft, canvas.offsetTop)

    let stopX = touches.pageX  - translateX;
    let stopY = touches.pageY - translateY;
    console.log(beginX, beginY, 'beginY')
    if (ctxErasure) {
        ctx.globalCompositeOperation = "destination-out"
        ctx.clearRect(stopX, stopY, 30, 30)
    } else {
        writing(beginX, beginY, stopX, stopY, ctx);
    }
    beginX = stopX; // 这一步很关键，需要不断更新起点，否则画出来的是射线簇
    beginY = stopY;
};
export const paintStart = (e: TouchEvent, canvas: HTMLCanvasElement) => {
    const translate = getTranslate(e.touches[0].target)
    left = translate.left
    top = translate.top
    console.log(scaleRatio, 'paint', left);
    beginX = e.touches[0].pageX  - translateX;
    beginY = e.touches[0].pageY - translateY;

}

// 获取本地上传图片
export const getFileUrl = (e: InputEvent) => {
    let files = e.target?.files, file;
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

export const reset = (canvas, canvasErasure) => {
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
    canvas.style['transform-origin']= '50% 50%'
    canvasErasure.style['transform-origin']= '50% 50%'
}