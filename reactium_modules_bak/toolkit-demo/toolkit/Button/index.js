import { buttonColors } from "./utils";
import { events, methods, props, readme, usage } from "./readme";
import { __, useHookComponent } from "reactium-core/sdk";
import React, { useEffect, useRef, useState } from "react";

export default () => {
  const { Element, Markdown } = useHookComponent("RTK");
  return (
    <Element title={__("Button")} className="py-xs-40 px-xs-40">
      <Markdown value={readme} />
      <Example />
      <Markdown value={usage} />
      <Markdown value={props} />
      <Markdown value={methods} />
      <Markdown value={events} />
      <div className="flex">
        <EventExample />
        <EventExampleAlt />
      </div>
    </Element>
  );
};

const Example = () => {
  const colors = buttonColors();
  const { Button } = useHookComponent("ReactiumUI");
  const props = { size: Button.SIZE.SM, style: { width: 100 } };

  return (
    <div className="flex wrap flex-xs-center flex-sm-left mt-xs-40">
      {colors.map(color => (
        <div
          key={`btn-${color}`}
          className="pr-xs-8 py-4 text-center flex-no-shrink"
        >
          <Button {...props} color={color}>
            {color}
          </Button>
        </div>
      ))}
    </div>
  );
};

const EventExample = () => {
  const style = { width: 145 };
  const [active, setActive] = useState(false);
  const Button = useHookComponent("ReactiumUI/Button");

  const onClick = e => {
    e.target.set("active", !Boolean(e.target.get("active")));
    setActive(e.target.get("active"));
  };

  return (
    <div style={{ ...style, marginRight: 12 }}>
      <div className="small text-center mb-xs-8">Basic Event</div>
      <Button
        style={style}
        active={false}
        onClick={onClick}
        children="Click Me"
      />
      <div className="text-center mt-xs-8">
        <kbd>active: {String(active)}</kbd>
      </div>
    </div>
  );
};

const EventExampleAlt = () => {
  const style = { width: 145 };

  const btnRef = useRef();
  const [active, setActive] = useState(false);
  const Button = useHookComponent("ReactiumUI/Button");

  const onClick = e => {
    e.target.set("active", !Boolean(e.target.get("active")));
    setActive(e.target.get("active"));
  };

  useEffect(() => {
    if (!btnRef.current) return;
    btnRef.current.addEventListener("click", onClick);
    return () => {
      btnRef.current.removeEventListener("click", onClick);
    };
  }, [btnRef.current]);

  return (
    <div style={style}>
      <div className="small text-center mb-xs-8">Listener Event</div>
      <Button ref={btnRef} style={style} active={false} children="Click Me" />
      <div className="text-center mt-xs-8">
        <kbd>active: {String(active)}</kbd>
      </div>
    </div>
  );
};
