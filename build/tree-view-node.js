"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const TreeViewNode = ({ onToggleExtend, nodeInfo, leafHeight, leafWidth, children, }) => {
    const { key, expand, show, x, y, expandSvgInfo } = nodeInfo;
    const childrenData = nodeInfo.children;
    return (react_1.default.createElement("div", { style: {
            width: `${leafWidth}px`,
            // padding: "6px",
            position: "absolute",
            top: ` ${y}px`,
            left: `${x}px`,
            height: `${leafHeight}px`,
            boxSizing: "border-box",
            display: show ? "flex" : "none",
        } },
        children,
        (childrenData === null || childrenData === void 0 ? void 0 : childrenData.length) > 0 ? (react_1.default.createElement("div", { onClick: () => {
                // console.log("onClick");
                onToggleExtend();
            }, style: {
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
            } }, expand ? "-" : childrenData === null || childrenData === void 0 ? void 0 : childrenData.length)) : null,
        expandSvgInfo ? (react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", version: "1.1", height: expandSvgInfo.height + 6, width: "60", style: {
                position: "absolute",
                top: ` ${-expandSvgInfo.height / 2 + 40}px`,
                left: `${leafWidth + 10}px`,
                opacity: expand ? 1 : 0,
            } }, expandSvgInfo.pathsInfo.map((info, i) => (react_1.default.createElement("path", { key: `${key}-${i}`, d: `M ${info.x0} ${info.y0} L ${info.x1} ${info.y1}`, stroke: "#b3b3b3", strokeWidth: "1", fill: "none" }))))) : null));
};
exports.default = TreeViewNode;
