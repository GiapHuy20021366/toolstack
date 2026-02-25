import "./App.css";
import { Rnd } from "react-rnd";
import Playground from "./Playground";
import NestedContainers from "./NestedContainer";
import { useEffect } from "react";
import { CTsTypeManager } from "./core/manager/type-manager";
import "./core/manager/type-register";
import z from "zod";
import { isAssignable } from "./core/utils/zod-utils";
import TestTsComponent from "./TestTsComponent";
import TsContextProvider from "./core/context/TsContextProvider";

function App() {
  useEffect(() => {
    // console.log(CTsTypeMeta.getAllTypeNames());
    const li1 = z.literal([1, "2"]);
    const li2 = z.literal([1, "2"]);
    console.log(isAssignable(li1, li2));
  });
  return (
    <div>
      {/* <Playground /> */}
      {/* <NestedContainers /> */}
      <TsContextProvider>
        <TestTsComponent cid="ABC" />
        <TestTsComponent cid="ABC" />
        {/* <TestTsComponent cid="ABC" /> */}
        {/* <TestTsComponent cid="ABC" /> */}
        {/* <TestTsComponent cid="ABC" /> */}
        {/* <TestTsComponent cid="ABC" /> */}
      </TsContextProvider>
    </div>
  );
}

export default App;
