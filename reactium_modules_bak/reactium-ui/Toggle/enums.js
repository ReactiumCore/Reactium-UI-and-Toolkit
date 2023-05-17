import ENUMS from "../Button/enums";

export default {
  ALIGN: {
    LEFT: "left",
    RIGHT: "right"
  },
  COLOR: { ...ENUMS.COLOR },
  EVENTS: ["keyboard", "focus", "mouse", "pointer", "touch", "form"],
  TYPE: {
    CHECKBOX: "checkbox",
    RADIO: "radio"
  }
};
