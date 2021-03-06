import React, {
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
  useImperativeHandle,
} from "react";
import { TreeViewProps, TreeViewNodeInfo, DataSource } from "./types";

import TreeViewNode from "./tree-view-node";

const TreeView = React.forwardRef(
  (
    {
      dataSource,
      width,
      height,
      leafHeight,
      leafWidth,
      LeafNodeComponent,
    }: TreeViewProps,
    ref
  ) => {
    const leafAllHeight = leafHeight + 40;
    const [originData, setOriginData] = useState<TreeViewNodeInfo[]>([]);
    const [okrTreeInfo, setOkrTreeInfo] = useState<TreeViewNodeInfo[]>([]);

    const wrpperRef = useRef<HTMLDivElement>(null);
    const [startDragXY, setStartDragXY] = useState<{
      x: number;
      y: number;
    } | null>(null);
    const [originY, setOriginY] = useState(0);

    const [scale, setScale] = useState(100);
    const [levelNum, setLevelNum] = useState(0);
    const [leftLevelNum, setLeftLevelNum] = useState(0);
    useImperativeHandle(
      ref,
      () => ({
        setScale: (s: number) => {
          setScale(s);
        },
        getScale: () => {
          return scale;
        },
        scale: scale,
      }),
      [scale]
    );
    // setScale(scale - 10);
    // setStartDrag;
    useEffect(() => {
      let queue: TreeViewNodeInfo[] = (
        dataSource as unknown as TreeViewNodeInfo[]
      ).map((x, i) => {
        x.level = 1;
        x.index = i;
        x.expand = true;
        x.parentExpand = false;
        x.show = true;
        x.levelIndex = i;
        x.originY = 0;
        return x;
      });
      let pos = 0;
      let indexLevelMap: { [key: string]: number } = {};

      while (pos < queue.length) {
        if (queue[pos].children) {
          const level = (queue[pos].level as number) + 1;
          queue.push(
            ...(queue[pos].children as Array<any>).map((x, i) => {
              if (indexLevelMap[level]) {
                indexLevelMap[level]++;
              } else {
                indexLevelMap[level] = 1;
              }
              x.level = level;
              // x.expand = false;
              x.expand = true;
              x.levelIndex = indexLevelMap[level];
              x.show = queue[pos].expand;

              x.index = i;
              return x;
            })
          );
        }
        pos++;
      }

      pos = 0;
      while (pos < queue.length) {
        if (queue[pos].parents) {
          if (queue[pos].level > 1) {
            continue;
          }
          const level = (queue[pos].level as number) - 1;
          queue.push(
            ...(queue[pos].parents as Array<any>).map((x, i) => {
              if (indexLevelMap[level]) {
                indexLevelMap[level]++;
              } else {
                indexLevelMap[level] = 1;
              }
              x.level = level;
              // x.parentExpand = false;
              // x.parentExpand = true;
              x.levelIndex = indexLevelMap[level];
              x.show = queue[pos].parentExpand;

              x.index = i;
              return x;
            })
          );
        }
        pos++;
      }
      // console.log(indexLevelMap);
      let indexLevelArr = Object.keys(indexLevelMap);

      setLevelNum(indexLevelArr.length + 1);
      setLeftLevelNum(indexLevelArr.filter((x) => parseInt(x, 10) < 1).length);

      setOriginData(dataSource as unknown as TreeViewNodeInfo[]);
      setOriginY(0);
    }, [dataSource]);

    useEffect(() => {
      if (originData.length < 1) {
        return;
      }
      let queue: TreeViewNodeInfo[] = originData.map((x) => x);

      let y = 0;
      for (let i = 0; i < queue.length; i++) {
        y = dfsAllTree(queue[i], y, 1, [i]);
      }

      let py = 0;
      for (let i = 0; i < queue.length; i++) {
        py = dfsParentsAllTree(queue[i], py, 1, [i]);
      }
      // dfsParentsAllTree

      y = y > py ? y : py;
      if (originY === 0) {
        setOriginY(y - leafAllHeight);
      }
      y = (y - leafAllHeight) / 2;

      // calculating the position of the nodes
      caclPosition(queue, y);

      let pos = 0;
      while (pos < queue.length) {
        if (queue[pos].expand && queue[pos].children) {
          queue.push(...(queue[pos].children as Array<any>));
        }
        if (queue[pos].parentExpand && queue[pos].parents) {
          queue.push(...(queue[pos].parents as Array<any>));
        }
        pos++;
      }

      // setOkrTreeInfo(queue);
      setOkrTreeInfo(queue);
    }, [originData]);

    useLayoutEffect(() => {
      const wrapper = wrpperRef.current;
      if (wrapper) {
        // leafAllHeight;
        wrapper.scrollTo(leftLevelNum * (leafWidth + 70), originY / 2);
      }
    }, [originY, leftLevelNum, levelNum]);

    const dfsTree = (
      treeNode: TreeViewNodeInfo,
      y: number,
      level: number,
      parentsIndex: number[] = []
    ) => {
      let nextY = y;
      treeNode.level = level;
      treeNode.parentsIndex = parentsIndex;
      // treeNode.expand = true;
      treeNode.x = (leftLevelNum + level) * 360 + level * 70;
      if (treeNode.expand && treeNode.children) {
        treeNode.expandSvgInfo = {
          pathNum: treeNode.children.length + 2,
          pathsInfo: [],
          posX: 0,
          posY: 0,
          height: 0,
        };
        let y0 = 0;
        for (let i = 0; i < treeNode.children.length; i++) {
          treeNode.children[i].show = treeNode.expand;
          nextY = dfsTree(treeNode.children[i], nextY, level + 1, [
            ...parentsIndex,
            i,
          ]);
          if (i === 0) {
            //
            y0 = treeNode.children[0].y;
          }
          treeNode.expandSvgInfo.pathsInfo.push({
            x0: 30,
            x1: 60,
            y0: treeNode.children[i].y - y0 + 2,
            y1: treeNode.children[i].y - y0 + 2,
          });
        }
        nextY -= leafAllHeight;
        treeNode.y =
          (treeNode.children[0].y +
            treeNode.children[treeNode.children.length - 1].y) /
          2;
        treeNode.expandSvgInfo.pathsInfo.push({
          x0: 30,
          x1: 30,
          y0: treeNode.children[0].y - y0 + 2,
          y1: treeNode.children[treeNode.children.length - 1].y - y0 + 2,
        });
        treeNode.expandSvgInfo.pathsInfo.push({
          x0: 0,
          x1: 30,
          y0: treeNode.y - y0 + 2,
          y1: treeNode.y - y0 + 2,
        });
        treeNode.expandSvgInfo.height =
          treeNode.children[treeNode.children.length - 1].y - y0 + 2;
        treeNode.expandSvgInfo.posY = y0 + 2;
      } else {
        treeNode.y = y;
      }

      return nextY + leafAllHeight;
    };

    const dfsAllTree = (
      treeNode: TreeViewNodeInfo,
      y: number,
      level: number,
      parentsIndex: Array<number> = []
    ) => {
      let nextY = y;
      treeNode.level = level;
      treeNode.parentsIndex = parentsIndex;
      // treeNode.expand = true;
      treeNode.x = (leftLevelNum + level) * 360 + level * 70;
      if (treeNode.children) {
        for (let i = 0; i < treeNode.children.length; i++) {
          nextY = dfsAllTree(treeNode.children[i], nextY, level + 1, [
            ...parentsIndex,
            i,
          ]);
        }
        nextY -= leafAllHeight;
        treeNode.y =
          (treeNode.children[0].y +
            treeNode.children[treeNode.children.length - 1].y) /
          2;
      } else {
        treeNode.y = y;
      }
      return nextY + leafAllHeight;
    };

    const dfsParentsAllTree = (
      treeNode: TreeViewNodeInfo,
      y: number,
      level: number,
      childrenIndex: Array<number> = []
    ) => {
      let nextY = y;
      treeNode.level = level;
      treeNode.childrenIndex = childrenIndex;
      // treeNode.expand = true;
      if (level !== 1) {
        treeNode.x = (leftLevelNum + level) * 360 + level * 70;
      }

      if (treeNode.parents) {
        for (let i = 0; i < treeNode.parents.length; i++) {
          nextY = dfsParentsAllTree(treeNode.parents[i], nextY, level - 1, [
            ...childrenIndex,
            i,
          ]);
        }
        nextY -= leafAllHeight;
        treeNode.y =
          (treeNode.parents[0].y +
            treeNode.parents[treeNode.parents.length - 1].y) /
          2;
      } else {
        treeNode.y = y;
      }
      return nextY + leafAllHeight;
    };

    const dfsParentsTree = (
      treeNode: TreeViewNodeInfo,
      y: number,
      level: number,
      childrenIndex: number[] = []
    ) => {
      let nextY = y;
      treeNode.level = level;
      treeNode.childrenIndex = childrenIndex;
      // treeNode.expand = true;
      // if (level !== 1) {
      treeNode.x = (leftLevelNum + level) * 360 + level * 70;
      // }
      // treeNode.x = -((level - 1) * 360 + level * 70);
      if (treeNode.parentExpand && treeNode.parents) {
        treeNode.parentExpandSvgInfo = {
          pathNum: treeNode.parents.length + 2,
          pathsInfo: [],
          posX: 0,
          posY: 0,
          height: 0,
        };
        let y0 = 0;
        for (let i = 0; i < treeNode.parents.length; i++) {
          treeNode.parents[i].show = treeNode.parentExpand;
          nextY = dfsParentsTree(treeNode.parents[i], nextY, level - 1, [
            ...childrenIndex,
            i,
          ]);
          if (i === 0) {
            //
            y0 = treeNode.parents[0].y;
          }
          treeNode.parentExpandSvgInfo.pathsInfo.push({
            x0: 0,
            x1: 30,
            y0: treeNode.parents[i].y - y0 + 2,
            y1: treeNode.parents[i].y - y0 + 2,
          });
        }
        nextY -= leafAllHeight;
        treeNode.y =
          (treeNode.parents[0].y +
            treeNode.parents[treeNode.parents.length - 1].y) /
          2;
        treeNode.parentExpandSvgInfo.pathsInfo.push({
          x0: 30,
          x1: 30,
          y0: treeNode.parents[0].y - y0 + 2,
          y1: treeNode.parents[treeNode.parents.length - 1].y - y0 + 2,
        });
        treeNode.parentExpandSvgInfo.pathsInfo.push({
          x0: 30,
          x1: 60,
          y0: treeNode.y - y0 + 2,
          y1: treeNode.y - y0 + 2,
        });
        treeNode.parentExpandSvgInfo.height =
          treeNode.parents[treeNode.parents.length - 1].y - y0 + 2;
        treeNode.parentExpandSvgInfo.posY = y0 + 2;
      } else {
        treeNode.y = y;

        if (level === 1) {
          console.log("------left------");
          console.log("y ", y);
          console.log(treeNode);
          console.log("treeNode.y", treeNode.y);
          console.log("");
        }
      }
      return nextY + leafAllHeight;
    };

    const caclPosition = (dataList: DataSource, y: number) => {
      let rightY = y;
      let leftY = y;
      for (let i = 0; i < dataList.length; i++) {
        rightY = dfsTree(dataList[i], y, 1, [i]);
        let rightRootY = dataList[i].y;
        leftY = dfsParentsTree(dataList[i], y, 1, [i]);
        let leftRootY = dataList[i].y;
        if (rightY > leftY) {
          leftY = rightRootY - leftRootY + y;
          dfsParentsTree(dataList[i], leftY, 1, [i]);
          y = rightY;
        } else if (rightY < leftY) {
          rightY = leftRootY - rightRootY + y;
          dfsTree(dataList[i], rightY, 1, [i]);
          y = leftY;
        } else {
          y = leftY;
        }
        // y = dfsTree(originData[i], y, 1, [i]);
      }
    };
    const handleExtend = (node: TreeViewNodeInfo) => {
      let indexArr = node.parentsIndex;
      let itemArr = originData;
      let item = null;

      if (Array.isArray(indexArr)) {
        for (let i = 0; i < indexArr.length; i++) {
          const index = indexArr[i];
          item = itemArr[index];
          itemArr = item.children;
        }
        if (!item) return;
        let itemY = item.y;
        item.expand = !item.expand;

        let y = originY / 2;
        caclPosition(originData, y);

        // console.log("---------");
        // console.log("curY", itemY);
        // console.log("nextY", item.y);
        // originData[0].originY = itemY - item.y;
        originData[0].originY = 0;

        const wrapper = wrpperRef.current;
        if (wrapper) {
          wrapper.scrollTo(
            wrapper.scrollLeft,
            wrapper.scrollTop - (scale * (itemY - item.y)) / 100
            // (wrapper.scrollHeight - wrapper.clientHeight) / 2
          );
        }
        setOriginData([...originData]);
      }
      // console.log(indexArr);

      // dfsTree()
    };
    const handleExtendParent = (node: TreeViewNodeInfo) => {
      let indexArr = node.childrenIndex;
      let itemArr = originData;
      let item = null;

      if (Array.isArray(indexArr)) {
        for (let i = 0; i < indexArr.length; i++) {
          const index = indexArr[i];
          item = itemArr[index];
          itemArr = item.parents;
        }
        if (!item) return;
        let itemY = item.y;
        item.parentExpand = !item.parentExpand;

        let y = originY / 2;
        // for (let i = 0; i < originData.length; i++) {
        //   y = dfsParentsTree(originData[i], y, 1, [i]);
        // }

        caclPosition(originData, y);

        // originData[0].originY = itemY - item.y;
        originData[0].originY = 0;

        const wrapper = wrpperRef.current;
        if (wrapper) {
          wrapper.scrollTo(
            wrapper.scrollLeft,
            wrapper.scrollTop - (scale * (itemY - item.y)) / 100
            // (wrapper.scrollHeight - wrapper.clientHeight) / 2
          );
        }
        setOriginData([...originData]);
      }
      // console.log(indexArr);

      // dfsTree()
    };
    const handleDrag: React.MouseEventHandler<HTMLDivElement> = (e) => {
      const wrapper = wrpperRef.current;

      if (startDragXY && wrapper) {
        wrpperRef.current.scrollTo(
          wrapper.scrollLeft - (e.clientX - startDragXY.x),
          wrapper.scrollTop - (e.clientY - startDragXY.y)
        );
        setStartDragXY({ x: e.clientX, y: e.clientY });
      }
    };

    useEffect(() => {
      window.addEventListener("mouseup", () => {
        setStartDragXY(null);
      });
    }, []);
    const handleDragStart: React.MouseEventHandler<HTMLDivElement> = (e) => {
      setStartDragXY({ x: e.clientX, y: e.clientY });
    };

    return (
      <div
        style={{
          width: width ? `${width}px` : "100%",
          height: height ? `${height}px` : "100%",
          position: "relative",
          overflow: "auto",
          willChange: "transform",
          cursor: startDragXY ? "grabbing" : "grab",
          userSelect: "none",
        }}
        ref={wrpperRef}
        onMouseMove={handleDrag}
        onMouseDown={handleDragStart}
      >
        <div
          style={{
            height: `${originY * 2}px`,
            width: `${(levelNum + 1) * (leafWidth + 80)}px`,
            transformOrigin: "left top",
            transform: `scale(${scale / 100})`,
          }}
        >
          {okrTreeInfo.map((x) => (
            <TreeViewNode
              nodeInfo={{ ...x }}
              key={`${x.levelIndex}-${x.level}-okr-node`}
              onToggleExtend={() => {
                handleExtend(x);
              }}
              onToggleExtendParent={() => {
                handleExtendParent(x);
              }}
              leafWidth={leafWidth}
              leafHeight={leafHeight}
            >
              <LeafNodeComponent {...x} />
            </TreeViewNode>
          ))}
        </div>
      </div>
    );
  }
);

// export default React.forwardRef(TreeView);
export default TreeView;
