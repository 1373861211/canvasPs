interface tool {
    icon: string,
    text: string,
    value: string
}
export const TOOLS: tool[] = [
    {
        icon: 'go-back-line',
        text: '撤销',
        value: 'undo'
    },
    {
        icon: 'eraser-line',
        text: '橡皮檫',
        value: 'eraser'
    },
    {
        icon: 'color-getter-line',
        text: '吸色',
        value: 'getColor'
    },
    {
        icon: 'markup-line',
        text: '手写',
        value: 'paint'
    },
    {
        icon: 'text-line',
        text: '文字',
        value: 'word'
    },
    {
        icon: 'yes-line',
        text: '打勾',
        value: 'tick'
    },
    {
        icon: 'clockwise-line',
        text: '旋转',
        value: 'rotate'
    },
    {
        icon: 'clip-line',
        text: '裁剪',
        value: 'clip'
    }
]
interface operate {
    text: string,
    value: string
}
export const OPERATES: operate[] = [
    {
        text: '上传图片',
        value: 'upload'
    },
    {
        text: '保存',
        value: 'save'
    },
]