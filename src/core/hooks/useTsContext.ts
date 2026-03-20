import { useContext } from "react";
import { TsContext } from "../context/TsContext";

export default function useTsContext() {
  const context = useContext(TsContext);
  return context;
}
