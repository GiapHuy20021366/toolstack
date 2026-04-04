import { useEffect, useState } from "react";
import { CTsFuncManager, IFuncDef } from "@contexts/editor";

export default function useFuncList() {
    const [list, setList] = useState<IFuncDef[]>(() => CTsFuncManager.instance.getListFunc());

    useEffect(() => {
        const changeListener = () => {
            setList(CTsFuncManager.instance.getListFunc());
        }

        CTsFuncManager.instance.addListener("change", changeListener);
        return () => {
            CTsFuncManager.instance.removeListener("change", changeListener);
        }
    }, []);
    return list;
}