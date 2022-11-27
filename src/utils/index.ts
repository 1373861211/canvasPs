let scaleRatio = 1;
// 从变量名就知道它的用途与用法
let preTouchesClientx1y1x2y2 = [] as number[];
// 记录前一次触摸点的位置
let preTouchPosition = {
    x: 0,
    y: 0
};
let originHaveSet = false
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
    let scale = parseInt(nums[0]) || 1;
    return { left, top, scale };
};
// 计算相对缩放前的偏移量，rect 为当前变换后元素的四周的位置
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
// 记录变换基点
let scaleOrigin = {
    x: 0,
    y: 0
};
let translateX = 0;
let translateY = 0;
export const zoomIng = (e: TouchEvent, canvas: HTMLCanvasElement, canvasErasure: HTMLCanvasElement) => {
    let touches = e.touches;
    if (touches.length === 1) {
        let oneTouch = touches['0'];
        let translated = getTranslate(oneTouch.target);
        translateX = oneTouch.clientX - preTouchPosition.x + translated.left;
        translateY = oneTouch.clientY - preTouchPosition.y + translated.top;
        let matrix = `matrix(${scaleRatio}, 0, 0, ${scaleRatio}, ${translateX}, ${translateY})`;
        setStyle('transform', matrix, canvas);
        setStyle('transform', matrix, canvasErasure);
        recordPreTouchPosition(oneTouch);
    } else {
        let one = touches['0'];
        let two = touches['1'];
        scaleRatio = distance(one.clientX, one.clientY, two.clientX, two.clientY) / distance(...preTouchesClientx1y1x2y2 as [number,number,number,number]) * scaleRatio || 1;
        if (!originHaveSet) {
            originHaveSet = true;
            // 移动视线中心
            let origin = relativeCoordinate((one.clientX + two.clientX) / 2, (one.clientY + two.clientY) / 2, canvas.getBoundingClientRect());
            // 修正视野变化带来的平移量
            translateX = (scaleRatio - 1) * (origin.x - scaleOrigin.x) + translateX;
            translateY = (scaleRatio - 1) * (origin.y - scaleOrigin.y) + translateY;
            setStyle('transform-origin', `${origin.x}px ${origin.y}px`, canvas);
            setStyle('transform-origin', `${origin.x}px ${origin.y}px`, canvasErasure);
            scaleOrigin = origin;
        }
        let matrix = `matrix(${scaleRatio}, 0, 0, ${scaleRatio}, ${translateX}, ${translateY})`;
        console.log(scaleRatio,'scaleRatio',translateX)
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
        originHaveSet = false;

    }
    recordPreTouchPosition(touches['0']);
};
export const zoomEvent = (e: TouchEvent) => {
    let touches = e.touches;
    if (touches.length === 1) {
        recordPreTouchPosition(touches['0']);
    }
}


const writing = (
    beginX: number,
    beginY: number,
    stopX: number,
    stopY: number,
    ctx: CanvasRenderingContext2D,
) => {
    ctx.beginPath();  // 开启一条新路径
    ctx.globalAlpha = 1;  // 设置图片的透明度
    ctx.lineWidth = 3;  // 设置线宽
    ctx.strokeStyle = 'red';  // 设置路径颜色
    ctx.moveTo(beginX, beginY);  // 从(beginX, beginY)这个坐标点开始画图
    ctx.lineTo(stopX, stopY);  // 定义从(beginX, beginY)到(stopX, stopY)的线条（该方法不会创建线条）
    ctx.closePath();  // 创建该条路径
    ctx.stroke();  // 实际地绘制出通过 moveTo() 和 lineTo() 方法定义的路径。默认颜色是黑色。
};

const erasure = (
    beginX: number,
    beginY: number,
    stopX: number,
    stopY: number,
    ctx: CanvasRenderingContext2D,
    ctxErasure: CanvasRenderingContext2D
) =>{
        const imgData=ctxErasure.getImageData(beginX,beginY,3,3);
        ctx.putImageData(imgData,stopX,stopY);
}
let beginX: number;
let beginY: number;
let left: number;
let top: number;
let scale: number;
export const paintIng = (e:TouchEvent, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, ctxErasure?: CanvasRenderingContext2D) => {
    const touches = e.touches[0];
    let stopX = touches.pageX - canvas.offsetLeft - left;
    let stopY = touches.pageY - canvas.offsetTop - top;
    if(ctxErasure) {
        ctx.clearRect(stopX , stopY, 30, 30)
    } else {
        writing(beginX, beginY, stopX, stopY, ctx);
    }
    beginX = stopX; // 这一步很关键，需要不断更新起点，否则画出来的是射线簇
    beginY = stopY;
};
export const paintStart = (e:TouchEvent, canvas: HTMLCanvasElement) => {
    const translate = getTranslate(e.touches[0].target)
    left = translate.left
    top = translate.top
    scale = translate.scale
    beginX = e.touches[0].pageX - canvas.offsetLeft - left;
    beginY = e.touches[0].pageY - canvas.offsetTop - top;

}