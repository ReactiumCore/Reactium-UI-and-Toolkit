import icons from ".";
import Reactium from "reactium-core/sdk";

Reactium.Hook.register("plugin-ready", () => {
  const RUIcons = Reactium.Component.get("ReactiumUI/Icon");
  if (!RUIcons) return;
  RUIcons.Library.register("Feather", { icons });
  RUIcons.Feather = RUIcons.Feather || icons;
});
