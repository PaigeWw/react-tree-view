import React from 'react';
export declare type TreeViewProps = {
    dataSource: DataSource[];
    width?: number;
    height?: number;
    ref?: React.MutableRefObject<any>;
    leafHeight: number;
    leafWidth: number;
    LeafNodeComponent: React.FC<any>;
};
export interface TreeViewRef {
    scale: number;
    setScale: (s: number) => void;
}
export interface DataSource {
    [key: string]: any;
    children?: DataSource[];
}
export interface TreeViewNodeInfo {
    level: number;
    index: number;
    x: number;
    y: number;
    expandSvgInfo: {
        pathsInfo: {
            x0: number;
            y0: number;
            x1: number;
            y1: number;
        }[];
        height: number;
        posY: number;
        posX: number;
        pathNum: number;
    };
    show: Boolean;
    expand: Boolean;
    key: string;
    children: TreeViewNodeInfo[];
    parentsIndex: Array<number>;
    levelIndex: number;
    originY: number;
}
export declare type TreeViewNodeProps = {
    onToggleExtend: Function;
    nodeInfo: TreeViewNodeInfo;
    leafHeight: number;
    leafWidth: number;
};
