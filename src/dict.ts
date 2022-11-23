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
        icon: 'arrow-go-forward-line',
        text: '恢复',
        value: 'recover'
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
        icon: 'no-line',
        text: '打叉',
        value: 'cross'
    },
    {
        icon: 'clockwise-line',
        text: '旋转',
        value: 'rotate'
    },
    {
        icon: 'artboard-line',
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
        text: '如何使用',
        value: 'help'
    },
    {
        text: '上一张',
        value: 'prev'
    },
    {
        text: '下一张',
        value: 'next'
    },
    {
        text: '保存',
        value: 'save'
    },
]