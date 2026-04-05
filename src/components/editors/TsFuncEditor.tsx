/* eslint-disable @typescript-eslint/no-explicit-any */
import { Stack } from "@mui/material";
import { useGraphicStateValue, useFuncList } from "@hooks/editor";
import {
  INativeStateProps,
  CTsFuncManager,
  EFuncStateParamType,
  IFuncState,
  IIFuncDefParam,
  IFuncDef,
  getDefaultFuncStateValue,
  EFuncDefParamEditorType,
} from "@contexts/editor";
import { useMemo, useRef, useState } from "react";
import { noneFunc } from "@functions/none";

interface ITsFunctionEditorFunctionProps {
  seriesIdx: number;

  state: IFuncState;
  onStateChange: (newState: IFuncState) => void;

  funcDef: IFuncDef;
  funcDefParams: IIFuncDefParam[];

  onFuncChange: (functionId: string) => void;
  onAddDefFuncParam: (idx: number) => void;
  onDeleteDefFuncParam: (idx: number) => void;
}

function TsFunctionEditorFunction({
  seriesIdx,

  state,
  onStateChange,

  funcDef,
  funcDefParams,
  onFuncChange,
  onAddDefFuncParam,
  onDeleteDefFuncParam,
}: ITsFunctionEditorFunctionProps) {
  const funcList = useFuncList();

  return (
    <Stack direction={"column"} sx={{ flex: 1 }} gap={0.1}>
      <select
        value={state.funcId}
        onChange={(e) => onFuncChange(e.target.value)}
      >
        {funcList.map((func) => (
          <option value={func.id} key={func.id}>
            {func.name}
          </option>
        ))}
      </select>
      {funcDefParams.map((param, idx) => (
        <Stack
          key={`${funcDef.id}.${param.name}.${idx}`}
          direction={"row"}
          gap={0.1}
        >
          <label htmlFor="">
            {param.name}
            {param.series ? `[${idx - seriesIdx}]` : ""}
          </label>
          {param.elementType == null && (
            <select
              value={state.params[idx]?.type}
              onChange={(e) => {
                const params = [...state.params];
                params[idx] = {
                  ...state.params[idx],
                  type: e.target.value as EFuncStateParamType,
                };
                onStateChange({
                  ...state,
                  params: params,
                });
              }}
            >
              {Object.values(EFuncStateParamType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          )}

          {/* Handle input default*/}
          {(param.elementType == null ||
            param.elementType === EFuncDefParamEditorType.INPUT) && (
            <input
              defaultValue={state.params[idx]?.value}
              onBlur={(e) => {
                if (state.params[idx].type === "json") {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    const params = [...state.params];
                    params[idx] = {
                      ...state.params[idx],
                      value: JSON.stringify(parsed, null, 2),
                    };
                    onStateChange({
                      ...state,
                      params: params,
                    });
                  } catch (error) {
                    //
                  }
                } else {
                  const params = [...state.params];
                  params[idx] = { ...state.params[idx], value: e.target.value };
                  onStateChange({
                    ...state,
                    params: params,
                  });
                }
              }}
            />
          )}
          {/* Select */}
          {param.elementType === EFuncDefParamEditorType.SELECT && (
            <select
              value={state.params[idx]?.value}
              onChange={(e) => {
                const params = [...state.params];
                params[idx] = { ...state.params[idx], value: e.target.value };
                onStateChange({
                  ...state,
                  params: params,
                });
              }}
            >
              {param.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          {/* Checkbox */}
          {param.elementType === EFuncDefParamEditorType.CHECKBOX && (
            <input
              type="checkbox"
              checked={state.params[idx]?.value === "true"}
              onChange={(e) => {
                const params = [...state.params];
                params[idx] = {
                  ...state.params[idx],
                  value: e.target.checked ? "true" : "false",
                };
                onStateChange({
                  ...state,
                  params: params,
                });
              }}
            />
          )}
          {/* Function */}
          {param.elementType === EFuncDefParamEditorType.FUNCTION && (
            <select
              value={state.params[idx]?.value}
              onChange={(e) => {
                const params = [...state.params];
                params[idx] = { ...state.params[idx], value: e.target.value };
                onStateChange({
                  ...state,
                  params: params,
                });
              }}
            >
              {funcList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          )}

          {param.series && idx > seriesIdx && (
            <button
              style={{ width: "30px", margin: 0, padding: "0 5px" }}
              onClick={() => onDeleteDefFuncParam(idx)}
            >
              -
            </button>
          )}
          {param.series && idx >= seriesIdx && (
            <button
              style={{ width: "30px", margin: 0, padding: "0 5px" }}
              onClick={() => onAddDefFuncParam(idx)}
            >
              +
            </button>
          )}
        </Stack>
      ))}
    </Stack>
  );
}

export interface ITsFuncEditorProps extends INativeStateProps<unknown> {}
export default function TsFuncEditor({ cid, state }: ITsFuncEditorProps) {
  const [updateCount, setUpdateCount] = useState<number>(0); //Refresh the entire component
  const [funcState, setFuncState] = useGraphicStateValue<IFuncState>(
    cid,
    state.name,
    state.defaultValue ?? getDefaultFuncStateValue(),
  );

  const funcSeriesIdxRef = useRef<number>(0);
  const funcDef = useMemo(() => {
    return CTsFuncManager.instance.getFunc(funcState.funcId) ?? noneFunc;
  }, [funcState.funcId]);
  const [funcDefParams, setFuncDefParams] = useState<IIFuncDefParam[]>(
    (): IIFuncDefParam[] => {
      const funcDef = CTsFuncManager.instance.getFunc(funcState.funcId);
      if (funcDef != null) {
        const defParams = funcDef.params;
        const rs = JSON.parse(JSON.stringify(defParams)) as IIFuncDefParam[];

        const lstParam = rs[rs.length - 1];
        funcSeriesIdxRef.current = lstParam?.series ? rs.length - 1 : -1;

        // Recover previous series editor
        if (lstParam?.series) {
          for (let i = rs.length; i < funcState.params.length; ++i) {
            rs.push({ ...lstParam });
          }
        }

        return rs;
      }
      return [];
    },
  );

  const onFuncChange = (funcId: string) => {
    const funcDef = CTsFuncManager.instance.getFunc(funcId);
    if (funcDef != null) {
      const params = funcDef.params;
      const newFuncState = getDefaultFuncStateValue();
      newFuncState.funcId = funcId;
      newFuncState.params = params.map((param) => ({
        type: param.defaultType ?? EFuncStateParamType.DEFAULT,
        value: param.defaultValue ?? "",
      }));
      setFuncState(newFuncState);
      setFuncDefParams(JSON.parse(JSON.stringify(params)));
      funcSeriesIdxRef.current = params[params.length - 1]?.series
        ? params.length - 1
        : -1;
    }
    setUpdateCount(updateCount + 1);
  };
  const onAddDefFuncParam = (idx: number) => {
    const param = funcDefParams[idx];
    const newDefParams = [...funcDefParams];
    const newStateParams = [...funcState.params];
    newDefParams.splice(idx + 1, 0, { ...param });
    newStateParams.splice(idx + 1, 0, {
      type: param.defaultType ?? EFuncStateParamType.SCOPE,
      value: param.defaultValue ?? "",
    });
    setFuncState({ ...funcState, params: newStateParams });
    setFuncDefParams(newDefParams);
    setUpdateCount(updateCount + 1);
  };
  const onDeleteDefFuncParam = (idx: number) => {
    const newDefParams = [...funcDefParams];
    const newStateParams = [...funcState.params];
    newDefParams.splice(idx, 1);
    newStateParams.splice(idx, 1);
    setFuncState({ ...funcState, params: newStateParams });
    setFuncDefParams(newDefParams);
    setUpdateCount(updateCount + 1);
  };

  const outputSeriesIdxRef = useRef<number>(0);
  const outputDef = useMemo(() => {
    return CTsFuncManager.instance.getFunc(funcState.output.funcId) ?? noneFunc;
  }, [funcState.output.funcId]);
  const [outputDefParams, setOutputDefParams] = useState<IIFuncDefParam[]>(
    (): IIFuncDefParam[] => {
      const funcDef = CTsFuncManager.instance.getFunc(funcState.output.funcId);
      if (funcDef != null) {
        const defParams = funcDef.params;
        const rs = JSON.parse(JSON.stringify(defParams)) as IIFuncDefParam[];

        const lstParam = rs[rs.length - 1];
        outputSeriesIdxRef.current = lstParam?.series ? rs.length - 1 : -1;

        // Recover previous series editor
        if (lstParam?.series) {
          for (let i = rs.length; i < funcState.output.params.length; ++i) {
            rs.push({ ...lstParam });
          }
        }

        return rs;
      }
      return [];
    },
  );
  const onOutputChange = (funcId: string) => {
    const funcDef = CTsFuncManager.instance.getFunc(funcId);
    if (funcDef != null) {
      const params = funcDef.params;
      setFuncState({
        ...funcState,
        output: {
          funcId: funcId,
          params: params.map((param) => ({
            type: param.defaultType ?? EFuncStateParamType.DEFAULT,
            value: param.defaultValue ?? "",
          })),
        },
      });
      setOutputDefParams(JSON.parse(JSON.stringify(params)));
      outputSeriesIdxRef.current = params[params.length - 1]?.series
        ? params.length - 1
        : -1;
    }
    setUpdateCount(updateCount + 1);
  };
  const onAddDefOutputParam = (idx: number) => {
    const param = outputDefParams[idx];
    const newDefParams = [...outputDefParams];
    const newStateParams = [...funcState.output.params];
    newDefParams.splice(idx + 1, 0, { ...param });
    newStateParams.splice(idx + 1, 0, {
      type: param.defaultType ?? EFuncStateParamType.SCOPE,
      value: "",
    });
    setFuncState({
      ...funcState,
      output: { ...funcState.output, params: newStateParams },
    });
    setOutputDefParams(newDefParams);
    setUpdateCount(updateCount + 1);
  };

  const onDeleteDefOutputParam = (idx: number) => {
    const newDefParams = [...outputDefParams];
    const newStateParams = [...funcState.output.params];
    newDefParams.splice(idx, 1);
    newStateParams.splice(idx, 1);
    setFuncState({
      ...funcState,
      output: { ...funcState.output, params: newStateParams },
    });
    setOutputDefParams(newDefParams);
    setUpdateCount(updateCount + 1);
  };

  const errorSeriesIdxRef = useRef<number>(0);
  const errorDef = useMemo(() => {
    return CTsFuncManager.instance.getFunc(funcState.error.funcId) ?? noneFunc;
  }, [funcState.error.funcId]);
  const [errorDefParams, setErrorDefParams] = useState<IIFuncDefParam[]>(
    (): IIFuncDefParam[] => {
      const funcDef = CTsFuncManager.instance.getFunc(funcState.error.funcId);
      if (funcDef != null) {
        const defParams = funcDef.params;
        const rs = JSON.parse(JSON.stringify(defParams)) as IIFuncDefParam[];

        const lstParam = rs[rs.length - 1];
        errorSeriesIdxRef.current = lstParam?.series ? rs.length - 1 : -1;

        // Recover previous series editor
        if (lstParam?.series) {
          for (let i = rs.length; i < funcState.error.params.length; ++i) {
            rs.push({ ...lstParam });
          }
        }

        return rs;
      }
      return [];
    },
  );

  const onErrorChange = (funcId: string) => {
    const funcDef = CTsFuncManager.instance.getFunc(funcId);
    if (funcDef != null) {
      const params = funcDef.params;
      setFuncState({
        ...funcState,
        error: {
          funcId: funcId,
          params: params.map((param) => ({
            type: param.defaultType ?? EFuncStateParamType.DEFAULT,
            value: param.defaultValue ?? "",
          })),
        },
      });
      setErrorDefParams(JSON.parse(JSON.stringify(params)));
      errorSeriesIdxRef.current = params[params.length - 1]?.series
        ? params.length - 1
        : -1;
    }
    setUpdateCount(updateCount + 1);
  };

  const onAddDefErrorParam = (idx: number) => {
    const param = errorDefParams[idx];
    const newDefParams = [...errorDefParams];
    const newStateParams = [...funcState.error.params];
    newDefParams.splice(idx + 1, 0, { ...param });
    newStateParams.splice(idx + 1, 0, {
      type: param.defaultType ?? EFuncStateParamType.SCOPE,
      value: "",
    });
    setFuncState({
      ...funcState,
      error: { ...funcState.error, params: newStateParams },
    });
    setErrorDefParams(newDefParams);
    setUpdateCount(updateCount + 1);
  };

  const onDeleteDefErrorParam = (idx: number) => {
    const newDefParams = [...errorDefParams];
    const newStateParams = [...funcState.error.params];
    newDefParams.splice(idx, 1);
    newStateParams.splice(idx, 1);
    setFuncState({
      ...funcState,
      error: { ...funcState.error, params: newStateParams },
    });
    setErrorDefParams(newDefParams);
    setUpdateCount(updateCount + 1);
  };

  return (
    <Stack direction={"column"} gap={0.5}>
      <TsFunctionEditorFunction
        key={updateCount}
        seriesIdx={funcSeriesIdxRef.current}
        state={funcState}
        onStateChange={(state) => setFuncState(state)}
        funcDef={funcDef}
        funcDefParams={funcDefParams}
        onFuncChange={onFuncChange}
        onAddDefFuncParam={onAddDefFuncParam}
        onDeleteDefFuncParam={onDeleteDefFuncParam}
      />
      {funcDef.hasError !== false && (
        <Stack direction={"row"} gap={0.5} mt={0.5}>
          <label htmlFor="">error</label>
          <TsFunctionEditorFunction
            key={updateCount}
            seriesIdx={errorSeriesIdxRef.current}
            state={funcState.error as any}
            onStateChange={(state) => {
              setFuncState({
                ...funcState,
                error: state,
              });
            }}
            funcDef={errorDef}
            funcDefParams={errorDefParams}
            onFuncChange={onErrorChange}
            onAddDefFuncParam={onAddDefErrorParam}
            onDeleteDefFuncParam={onDeleteDefErrorParam}
          />
        </Stack>
      )}
      {funcDef.hasOutput !== false && (
        <Stack direction={"row"} gap={0.5} mt={0.5}>
          <label htmlFor="">done</label>
          <TsFunctionEditorFunction
            key={updateCount}
            seriesIdx={outputSeriesIdxRef.current}
            state={funcState.output as any}
            onStateChange={(state) => {
              setFuncState({
                ...funcState,
                output: state,
              });
            }}
            funcDef={outputDef}
            funcDefParams={outputDefParams}
            onFuncChange={onOutputChange}
            onAddDefFuncParam={onAddDefOutputParam}
            onDeleteDefFuncParam={onDeleteDefOutputParam}
          />
        </Stack>
      )}
    </Stack>
  );
}
