import React from "react";
import { TreeViewNodeProps } from "./types";
const TreeViewNode: React.FunctionComponent = ({
  onToggleExtend,
  nodeInfo,
}: TreeViewNodeProps) => {
  const { key, children, name, status, expand, show, x, y, expandSvgInfo } =
    nodeInfo;
  return (
    <div
      style={{
        width: "360px",
        border: "1px solid #cccccc",
        padding: "6px",
        position: "absolute",
        top: ` ${y}px`,
        left: `${x}px`,
        height: "80px",
        boxSizing: "border-box",
        display: show ? "flex" : "none",
      }}
    >
      <img
        src={`https://ik.imagekit.io/mrmiss/1625821015837_lMqPfTNXP.png`}
        width="54"
        height="27"
      />
      <div
        style={{
          width: "340px",
          height: "60px",
          boxSizing: "border-box",
          overflow: "hidden",
          textOverflow: "ellipsis",
          wordBreak: "break-all",
        }}
      >
        {name}
      </div>
      {children?.length > 0 ? (
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
          {expand ? "-" : children?.length}
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
            left: `${366}px`,
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
