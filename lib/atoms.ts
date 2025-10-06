"use client";

import { atom } from "jotai";
import { ScriptItem, mockScripts } from "@/lib/data";

export const scriptsAtom = atom<ScriptItem[]>(mockScripts);
export const selectedScriptAtom = atom<ScriptItem | null>(null);

export const acceptedScriptsAtom = atom((get) => {
  const scripts = get(scriptsAtom);
  return scripts.filter((script) => script.isAccepted);
});

export const unitTestsAtom = atom((get) => {
  const scripts = get(scriptsAtom);
  return scripts.filter((script) => script.script_type === "unit_test");
});

export const simulationTestsAtom = atom((get) => {
  const scripts = get(scriptsAtom);
  return scripts.filter((script) => script.script_type === "simulation_test");
});

export const filteredUnitTestsAtom = atom(
  (get) => (filterAccepted: boolean) => {
    const unitTests = get(unitTestsAtom);
    return filterAccepted
      ? unitTests.filter((script) => script.isAccepted)
      : unitTests;
  }
);

export const filteredSimulationTestsAtom = atom(
  (get) => (filterAccepted: boolean) => {
    const simulationTests = get(simulationTestsAtom);
    return filterAccepted
      ? simulationTests.filter((script) => script.isAccepted)
      : simulationTests;
  }
);

export const updateScriptAtom = atom(
  null,
  (
    get,
    set,
    { scriptId, updates }: { scriptId: string; updates: Partial<ScriptItem> }
  ) => {
    const scripts = get(scriptsAtom);
    const updatedScripts = scripts.map((script) =>
      script.scriptId === scriptId ? { ...script, ...updates } : script
    );
    set(scriptsAtom, updatedScripts);

    const selectedScript = get(selectedScriptAtom);
    if (selectedScript?.scriptId === scriptId) {
      set(selectedScriptAtom, { ...selectedScript, ...updates });
    }
  }
);

export const deleteScriptAtom = atom(null, (get, set, scriptId: string) => {
  const scripts = get(scriptsAtom);
  const updatedScripts = scripts.filter(
    (script) => script.scriptId !== scriptId
  );
  set(scriptsAtom, updatedScripts);

  const selectedScript = get(selectedScriptAtom);
  if (selectedScript?.scriptId === scriptId) {
    set(selectedScriptAtom, null);
  }
});

export const selectScriptAtom = atom(null, (get, set, script: ScriptItem) => {
  set(selectedScriptAtom, script);
});
