import icons from ".";
import Reactium from "reactium-core/sdk";

Reactium.Hook.register("plugin-init", () => {
  const RUIcons = Reactium.Component.get("ReactiumUI/Icon");
  if (!RUIcons) return;
  RUIcons.Library.register("Linear", { icons });
  RUIcons.Linear = RUIcons.Linear || icons;
});
