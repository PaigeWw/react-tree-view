import React, { useRef } from "react";
import ReactDOM from "react-dom";

import { DataSource, TreeViewRef } from "../src/types";
import EnlargeImg from "./img/icon_enlarge.png";
import NarrowImg from "./img/icon_narrow.png";
import ReductionImg from "./img/icon_reduction.png";
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
        background: "#ffffff",
      }}
    >
      {name}
    </div>
  );
};

const App: React.FC = () => {
  const treeViewRef = useRef<TreeViewRef>();
  const dataList: MyData[] = [
    {
      name: "Tom",
      children: [
        {
          name: "Lily",
        },
        {
          name: "Bob",
        },
        {
          name: "Kiki",
        },
      ],
      parents: [
        {
          name: "John",
        },
        {
          name: "Mary",
          parent: [
            {
              name: "Jake",
            },
          ],
        },
      ],
    },
    {
      name: "Jerry",
      children: [
        {
          name: "Lily",
        },
        {
          name: "Bob",
        },
        {
          name: "Hubert",
          children: [
            {
              name: "Janet",
            },
            {
              name: "Mosley",
            },
            {
              name: "Cindy",
            },
            {
              name: "Bates",
            },
          ],
        },
      ],
      parents: [
        {
          name: "Peter",
        },
        {
          name: "Aarn",
          parents: [
            {
              name: "Lana",
            },
            {
              name: "Lync",
            },
          ],
        },
      ],
    },
  ];
  return (
    <div
      style={{
        padding: "50px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: "40px",
          width: "120px",
          justifyContent: "space-around",
          alignItems: "center",
          paddingBottom: "14px",
        }}
      >
        <img
          style={{ width: "30px", height: "30px", cursor: "pointer" }}
          src={NarrowImg}
          onClick={() => {
            console.log(treeViewRef);
            treeViewRef?.current?.setScale(treeViewRef.current.scale - 10);
          }}
        />
        <img
          style={{ width: "30px", height: "30px", cursor: "pointer" }}
          src={EnlargeImg}
          onClick={() => {
            console.log(treeViewRef);
            treeViewRef?.current?.setScale(treeViewRef.current.scale + 10);
          }}
        />
        <img
          style={{ width: "26px", height: "26px", cursor: "pointer" }}
          src={ReductionImg}
          onClick={() => {
            console.log(treeViewRef);
            treeViewRef?.current?.setScale(100);
          }}
        />
      </div>
      <div style={{ background: "#f0f8ff9e" }}>
        <TreeView
          dataSource={dataList as DataSource[]}
          height={800}
          width={1200}
          LeafNodeComponent={LeafNodeComponent}
          leafHeight={80}
          leafWidth={360}
          ref={treeViewRef}
        />
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
