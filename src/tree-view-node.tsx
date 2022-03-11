import React from "react";
import { TreeViewNodeProps } from "./types";
const TreeViewNode: React.FunctionComponent<TreeViewNodeProps> = ({
  onToggleExtend,
  onToggleExtendParent,
  nodeInfo,
  leafHeight,
  leafWidth,
  children,
}) => {
  const {
    key,
    expand,
    show,
    x,
    y,
    expandSvgInfo,
    parentExpandSvgInfo,
    parentExpand,
  } = nodeInfo;
  const childrenData = nodeInfo.children;
  const parentsData = nodeInfo.parents;
  // console.log("parentsData", parentsData);
  return (
    <div
      style={{
        width: `${leafWidth}px`,
        // padding: "6px",
        position: "absolute",
        top: ` ${y}px`,
        left: `${x}px`,
        height: `${leafHeight}px`,
        boxSizing: "border-box",
        display: show ? "flex" : "none",
      }}
    >
      {parentsData?.length > 0 ? (
        <div
          onClick={() => {
            // console.log("onClick");
            onToggleExtendParent();
          }}
          style={{
            position: "absolute",
            left: "0",
            top: "50%",
            transform: "translate(-50%,-50%)",
            border: "1px solid #cccccc",
            borderRadius: "50%",
            width: "20px",
            height: "20px",
            lineHeight: parentExpand ? "18px" : "20px",
            textAlign: "center",
            background: "cornflowerblue",
            cursor: "pointer",
          }}
        >
          {parentExpand ? "-" : parentsData?.length}
        </div>
      ) : null}
      {parentExpandSvgInfo ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          height={parentExpandSvgInfo.height + 6}
          width="60"
          style={{
            position: "absolute",
            top: ` ${-parentExpandSvgInfo.height / 2 + 40}px`,
            left: `-70px`,
            opacity: parentExpand ? 1 : 0,
          }}
        >
          {parentExpandSvgInfo.pathsInfo.map((info, i) => (
            <path
              key={`${key}-${i}`}
              d={`M ${info.x0} ${info.y0} L ${info.x1} ${info.y1}`}
              stroke="#b3b3b3"
              strokeWidth="1"
              fill="none"
            />
          ))}
        </svg>
      ) : null}
      {children}
      {childrenData?.length > 0 ? (
        <div
          onClick={() => {
            // console.log("onClick");
            onToggleExtend();
          }}
          style={{
            position: "absolute",
            right: "0",
            top: "50%",
            transform: "translate(50%,-50%)",
            border: "1px solid #cccccc",
            borderRadius: "50%",
            width: "20px",
            height: "20px",
            lineHeight: expand ? "18px" : "20px",
            textAlign: "center",
            background: "cornflowerblue",
            cursor: "pointer",
          }}
        >
          {expand ? "-" : childrenData?.length}
        </div>
      ) : null}
      {expandSvgInfo ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          height={expandSvgInfo.height + 6}
          width="60"
          style={{
            position: "absolute",
            top: ` ${-expandSvgInfo.height / 2 + 40}px`,
            left: `${leafWidth + 10}px`,
            opacity: expand ? 1 : 0,
          }}
        >
          {expandSvgInfo.pathsInfo.map((info, i) => (
            <path
              key={`${key}-${i}`}
              d={`M ${info.x0} ${info.y0} L ${info.x1} ${info.y1}`}
              stroke="#b3b3b3"
              strokeWidth="1"
              fill="none"
            />
          ))}
        </svg>
      ) : null}
    </div>
  );
};

export default TreeViewNode;
