import type { ButtonOptions } from "@pixi/ui";
import { FancyButton } from "@pixi/ui";
import type { TextStyle } from "pixi.js";
import { Text } from "pixi.js";

export interface PrimaryButtonOptions {
  text: string;
  textStyle?: Partial<TextStyle>;
  buttonOptions?: ButtonOptions;
}

const DEFAULT_SCALE = 1;

export class PrimaryButton extends FancyButton {
  constructor(options: PrimaryButtonOptions) {
    const text = new Text({
      text: options?.text ?? "",
      style: {
        fill: 0x49c8ff,
        fontFamily: "Bungee Regular",
        fontWeight: "bold",
        align: "center",
        fontSize: 40,
        ...options?.textStyle,
      },
    });

    super({
      defaultView: "load_normal.png",
      hoverView: "load_over.png",
      pressedView: "load_pressed.png",
      text,
      anchorX: 0.5,
      anchorY: 1,
      scale: DEFAULT_SCALE,
      ...options.buttonOptions,
    });

    this.onPress.connect(() => {
      console.log("test");
    });
  }
}
