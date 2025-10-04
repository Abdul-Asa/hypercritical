"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { ScriptItem } from "@/lib/data";
import {
  scriptsAtom,
  selectedScriptAtom,
  acceptedScriptsAtom,
  unitTestsAtom,
  simulationTestsAtom,
  filteredUnitTestsAtom,
  filteredSimulationTestsAtom,
  updateScriptAtom,
  deleteScriptAtom,
  selectScriptAtom,
} from "@/lib/atoms";

export interface UseDataReturn {
  scripts: ScriptItem[];
  selectedScript: ScriptItem | null;
  selectScript: (script: ScriptItem) => void;
  updateScript: (scriptId: string, updates: Partial<ScriptItem>) => void;
  deleteScript: (scriptId: string) => void;
  getScriptsByType: (type: "unit_test" | "simulation_test") => ScriptItem[];
  getAcceptedScripts: () => ScriptItem[];
  getFilteredScripts: (filterAccepted: boolean) => ScriptItem[];
  getUnitTests: (filterAccepted?: boolean) => ScriptItem[];
  getSimTests: (filterAccepted?: boolean) => ScriptItem[];
}

export function useData(): UseDataReturn {
  const scripts = useAtomValue(scriptsAtom);
  const selectedScript = useAtomValue(selectedScriptAtom);
  const acceptedScripts = useAtomValue(acceptedScriptsAtom);
  const unitTests = useAtomValue(unitTestsAtom);
  const simulationTests = useAtomValue(simulationTestsAtom);
  const filteredUnitTests = useAtomValue(filteredUnitTestsAtom);
  const filteredSimTests = useAtomValue(filteredSimulationTestsAtom);

  const updateScript = useSetAtom(updateScriptAtom);
  const deleteScript = useSetAtom(deleteScriptAtom);
  const selectScript = useSetAtom(selectScriptAtom);

  const getScriptsByType = (type: "unit_test" | "simulation_test") => {
    return scripts.filter((script) => script.script_type === type);
  };

  const getAcceptedScripts = () => {
    return acceptedScripts;
  };

  const getFilteredScripts = (filterAccepted: boolean) => {
    return filterAccepted
      ? scripts.filter((script) => script.isAccepted)
      : scripts;
  };

  const getUnitTests = (filterAccepted?: boolean) => {
    return filterAccepted ? filteredUnitTests(true) : unitTests;
  };

  const getSimTests = (filterAccepted?: boolean) => {
    return filterAccepted ? filteredSimTests(true) : simulationTests;
  };

  return {
    scripts,
    selectedScript,
    selectScript,
    updateScript: (scriptId: string, updates: Partial<ScriptItem>) =>
      updateScript({ scriptId, updates }),
    deleteScript,
    getScriptsByType,
    getAcceptedScripts,
    getFilteredScripts,
    getUnitTests,
    getSimTests,
  };
}
