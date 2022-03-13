# react-tree-view

## A lightweight tree view component for React.

## demo

[https://react-tree-view.vercel.app](https://react-tree-view.vercel.app/)

## demo source

[https://github.com/PaigeWw/react-tree-view/tree/main/example](https://github.com/PaigeWw/react-tree-view/tree/main/example)

## preview

![img](https://cdn.nlark.com/yuque/0/2022/png/603715/1645277684296-d57010bc-0bc3-4906-a358-0ca65fc0186a.png)

## Usage

```typescript
import TreeView from ''

<TreeView
    dataSource={dataList as DataSource[]}
    height={800}
    width={1200}
    LeafNodeComponent={LeafNodeComponent}
    leafHeight={80}
    leafWidth={360}
    ref={treeViewRef}
/>
```

## API

```typescript
type TreeViewProps = {
    dataSource: DataSource[];
    width?: number;
    height?: number;
    ref?:  React.MutableRefObject<any>;
    leafHeight: number;
    leafWidth: number;
    LeafNodeComponent: React.FC<any>;
}
```
