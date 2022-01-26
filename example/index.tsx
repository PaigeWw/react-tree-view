import React from "react";
import ReactDOM from "react-dom";

import { DataSource } from "../src/types";
// import TreeView from "../build/index";
import TreeView from "../src/index";
interface MyData extends DataSource {
  name: string;
  children?: any[];
}

const LeafNodeComponent: React.FC<MyData> = ({ name }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        border: "1px solid #cccccc",
      }}
    >
      {name}
    </div>
  );
};

const App: React.FC = () => {
  const dataList: MyData[] = [
    {
      name: "jhfjkahf",
      children: [
        {
          name: "hudhuhu",
          children: [
            { name: "hugggguhu" },
            { name: "nnnnjjdfhu" },
            { name: "vvvvvccdddd" },
            { name: "rrrrrrdfgfgfg" },
          ],
        },
        {
          name: "hudhuhu",
          children: [
            { name: "hugggguhu" },
            { name: "vvvvvccdddd" },
            { name: "rrrrrrdfgfgfg" },
          ],
        },
      ],
    },
    {
      name: "jhfjkahf",
      children: [
        {
          name: "hudhuhu",
          children: [
            { name: "hugggguhu" },
            { name: "fgfgfggguhu" },
            { name: "nnnnjjdfhu" },
            { name: "rrrrrrdfgfgfg" },
          ],
        },
        {
          name: "hudhuhu",
          children: [
            { name: "hugggguhu" },
            { name: "fgfgfggguhu" },
            { name: "nnnnjjdfhu" },
            { name: "vvvvvccdddd" },
            {
              name: "rrrrrrdfgfgfg",
              children: [
                { name: "hugggguhu" },
                { name: "fgfgfggguhu" },
                { name: "nnnnjjdfhu" },
                { name: "rrrrrrdfgfgfg" },
              ],
            },
          ],
        },
      ],
    },
  ];
  return (
    <div>
      <TreeView
        dataSource={dataList as DataSource[]}
        height={800}
        width={1200}
        scaleTool={true}
        LeafNodeComponent={LeafNodeComponent}
        leafHeight={80}
        leafWidth={360}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
