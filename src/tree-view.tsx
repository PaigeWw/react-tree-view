import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
import { TreeViewProps } from "./types";

import TreeViewNode from "./tree-view-node";

const TreeView: React.FunctionComponent = ({
  dataSource,
  width,
  height,
}: //   scaleTool,
TreeViewProps) => {
  const [originData, setOriginData] = useState([]);
  const [okrTreeInfo, setOkrTreeInfo] = useState([]);

  const wrpperRef = useRef(null);
  const [startDragXY, setStartDragXY] = useState(null);
  const [baseY, setBaseY] = useState(0);
  const [originY, setOriginY] = useState(0);
  const [scale, setScale] = useState(100);
  // setScale(scale - 10);
  // setStartDrag;
  useEffect(() => {
    let queue = dataSource.map((x, i) => {
      x.level = 1;
      x.index = i;
      x.expand = true;
      x.show = true;
      x.levelIndex = i;
      x.originY = 0;
      return x;
    });
    let pos = 0;
    let indexLevelMap = {};
    // let queue = [];
    while (pos < queue.length) {
      if (queue[pos].children) {
        const level = queue[pos].level + 1;
        queue[pos].childrenIds = queue[pos].children.map((x) => x.id);
        queue.push(
          ...queue[pos].children.map((x, i) => {
            if (indexLevelMap[level]) {
              indexLevelMap[level]++;
            } else {
              indexLevelMap[level] = 1;
            }
            x.level = level;
            x.expand = false;
            x.levelIndex = indexLevelMap[level];
            x.show = queue[pos].expand;

            x.index = i;
            return x;
          })
        );
      }
      pos++;
    }
    // console.log("originData", dataSource);
    setOriginData(dataSource);
  }, [dataSource]);

  useEffect(() => {
    if (originData.length < 1) {
      return;
    }
    let queue = originData.map((x) => x);

    let y = 0;

    for (let i = 0; i < queue.length; i++) {
      y = dfsAllTree(queue[i], y, 1, [i]);
    }

    if (originY === 0) {
      setOriginY(y - 120);
    }
    y = (y - 120) / 2;
    for (let i = 0; i < queue.length; i++) {
      y = dfsTree(queue[i], y, 1, [i]);
    }

    // console.log(y);
    let pos = 0;
    while (pos < queue.length) {
      if (queue[pos].expand && queue[pos].children) {
        // const level = queue[pos].level + 1;
        queue[pos].childrenIds = queue[pos].children.map((x) => x.id);
        queue.push(...queue[pos].children);
      }
      pos++;
    }

    // setOkrTreeInfo(queue);
    setOkrTreeInfo(queue);
  }, [originData]);

  useLayoutEffect(() => {
    let wrapper = wrpperRef.current;
    // console.dir(wrpperRef.current);
    // return;
    // console.log("baseY", baseY);
    // if (originY === 0) {
    wrpperRef.current.scrollTo(
      wrapper.scrollLeft,
      baseY ? wrapper.scrollTop - (scale * baseY) / 100 : originY / 2
      // (wrapper.scrollHeight - wrapper.clientHeight) / 2
    );
    // }

    // console.log("wrpperRef.current", wrpperRef.current.scrollTo);
  }, [baseY, originY]);

  const dfsTree = (treeNode, y, level, parentsIndex = []) => {
    let nextY = y;
    treeNode.level = level;
    treeNode.parentsIndex = parentsIndex;
    // treeNode.expand = true;
    treeNode.x = (level - 1) * 360 + level * 70;
    if (treeNode.expand && treeNode.children) {
      treeNode.expandSvgInfo = {
        pathNum: treeNode.children.length + 2,
        pathsInfo: [],
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
      nextY -= 120;
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
    return nextY + 120;
  };

  const dfsAllTree = (treeNode, y, level, parentsIndex = []) => {
    let nextY = y;
    treeNode.level = level;
    treeNode.parentsIndex = parentsIndex;
    // treeNode.expand = true;
    treeNode.x = (level - 1) * 360 + level * 70;
    if (treeNode.children) {
      let y0 = 0;
      for (let i = 0; i < treeNode.children.length; i++) {
        nextY = dfsAllTree(treeNode.children[i], nextY, level + 1, [
          ...parentsIndex,
          i,
        ]);
        if (i === 0) {
          //
          y0 = treeNode.children[0].y;
        }
      }
      nextY -= 120;
      treeNode.y =
        (treeNode.children[0].y +
          treeNode.children[treeNode.children.length - 1].y) /
        2;
    } else {
      treeNode.y = y;
    }
    return nextY + 120;
  };
  const handleExtend = (node) => {
    let indexArr = node.parentsIndex;
    let itemArr = originData;
    let item = null;

    // console.log(indexArr);
    for (let i = 0; i < indexArr.length; i++) {
      const index = indexArr[i];
      item = itemArr[index];
      itemArr = item.children;
    }
    let itemY = item.y;
    item.expand = !item.expand;

    let y = originY / 2;
    for (let i = 0; i < originData.length; i++) {
      y = dfsTree(originData[i], y, 1, [i]);
    }
    // originData[0].originY = itemY - item.y;
    originData[0].originY = 0;
    setBaseY(itemY - item.y);
    setOriginData([...originData]);
    // dfsTree()
  };
  const handleDrag = (e) => {
    if (startDragXY) {
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
  const handleDragStart = (e) => {
    setStartDragXY({ x: e.clientX, y: e.clientY });
  };

  return (
    <div style={{ width: `${width}px`, height: `${height}px` }}>
      {okrTreeInfo.map((x) => (
        <TreeViewNode
          nodeInfo={{ ...x }}
          key={`${x.id}-okr-node`}
          onExtend={() => {
            handleExtend(x);
          }}
        />
      ))}
    </div>
  );
};

export default TreeView;
