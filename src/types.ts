export type TreeViewProps = {
    dataSource: {}[];
    width: number;
    height: number;
    scaleTool: Boolean;
}

export type TreeViewNodeProps = {
    onToggleExtend: Function;
    nodeInfo: {
        x: number;
        y: number;
        data: Object;
        expandSvgInfo: {
            pathsInfo: {x0: number; y0: number; x1: number; y1: number}[];
            height: number;
            posY: number;
            posX: number;
        };
        show: Boolean;
        expand: Boolean;
        key: string;
        children: TreeViewNodeProps[];
    },
}