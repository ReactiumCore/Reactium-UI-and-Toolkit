import op from "object-path";
import PropTypes from "prop-types";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import {
  ComponentEvent,
  useHookComponent,
  useSyncState
} from "reactium-core/sdk";

const noop = () => {};

const getBreakpoint = (win, state = {}) => {
  if (!win || !window.document) return;

  const { breaks = Breakpoint.defaultProps.breaks } = state;

  const breakpoint = String(
    win
      .getComputedStyle(window.document.querySelector("body"), ":before")
      .getPropertyValue("content")
  ).replace(/\W/g, "");

  const i = breaks.indexOf(breakpoint);

  let cmp,
    active,
    idx = i + 1;

  while (!cmp) {
    idx--;
    if (idx < 0) break;
    active = op.get(breaks, idx);
    cmp = op.get(state, active);
  }

  idx = i - 1;
  while (!cmp) {
    idx++;
    if (idx >= breaks.length) break;
    active = op.get(breaks, idx);
    cmp = op.get(state, active);
  }

  return { active, breakpoint };
};

/**
 * -----------------------------------------------------------------------------
 * Hook Component: Breakpoint
 * -----------------------------------------------------------------------------
 */
let Breakpoint = ({ iWindow, ...props }, ref) => {
  const { useStateFromProps } = useHookComponent("ReactiumUI");

  // State
  //const [state, setState] = useDerivedState({ ...props });
  const state = useSyncState({
    ...props,
    value: null,
    element: null
  });

  useStateFromProps({ state, props });

  const value = () => {
    const win = iWindow || window;
    return getBreakpoint(win, state.get());
  };

  const _onResize = () => {
    state.value = value();
    const { active, breakpoint } = state.value;

    if (state.get("breakpoint") !== breakpoint) {
      const obj = { active, breakpoint };
      const onChange = state.get("onChange");
      const evt = new ComponentEvent("change", obj);
      const synth = new ComponentEvent(`change-${Date.now()}`, obj);

      state.set({ active, breakpoint });
      state.dispatchEvent(evt);

      state.addEventListener(synth.type, onChange);
      state.dispatchEvent(synth);
      state.removeEventListener(synth.type, onChange);
    }
  };

  const render = () => {
    const active = state.get("active");
    return active ? op.get(props, active) : null;
  };

  // External Interface
  state.value = value();

  useImperativeHandle(ref, () => state);

  useEffect(() => {
    _onResize();

    const win = iWindow || window;
    win.addEventListener("resize", _onResize);

    return () => {
      win.removeEventListener("resize", _onResize);
    };
  }, []);

  return render();
};

Breakpoint = forwardRef(Breakpoint);

Breakpoint.propTypes = {
  xs: PropTypes.node,
  sm: PropTypes.node,
  md: PropTypes.node,
  lg: PropTypes.node,
  xl: PropTypes.node,
  breaks: PropTypes.array,
  controlled: PropTypes.bool,
  onChange: PropTypes.func
};

Breakpoint.defaultProps = {
  xs: undefined,
  sm: undefined,
  md: undefined,
  lg: undefined,
  xl: undefined,
  breaks: ["xs", "sm", "md", "lg", "xl"],
  controlled: false,
  onChange: noop
};

// back-compatibility
const getBreakpoints = () => {};

Breakpoint.getBreakpoint = getBreakpoint;
Breakpoint.getBreakpoints = getBreakpoints;

export { Breakpoint, Breakpoint as default, getBreakpoint, getBreakpoints };
