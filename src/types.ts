import React from 'react';
;

export type TreeViewProps = {
    dataSource: DataSource[];
    width: number;
    height: number;
    scaleTool: Boolean;
    leafHeight: number;
    leafWidth: number;
    LeafNodeComponent: React.FC<any>;
}

export interface DataSource {
    [key: string]: any
    children?: DataSource[]
}


export interface TreeViewNodeInfo {
    level:number;
    index:number;
    x: number;
    y: number;
    expandSvgInfo: {
        pathsInfo: {x0: number; y0: number; x1: number; y1: number}[];
        height: number;
        posY: number;
        posX: number;
        pathNum: number;
    };
    show: Boolean;
    expand: Boolean;
    key: string;
    children: TreeViewNodeInfo[];
    parentsIndex: Array<number>
    levelIndex:number;
    originY:number;
}
export type TreeViewNodeProps = {
    onToggleExtend: Function;
    nodeInfo: TreeViewNodeInfo,
}



