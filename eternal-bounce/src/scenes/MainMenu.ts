import { Container } from "pixi.js";
import { Keyboard } from "../systems/Keyboard";
import { Scene } from "../utils/types";
import { ButtonContainer } from "@pixi/ui";
import { PrimaryButton } from "../ui/buttons/PrimaryButton,";
import { sceneManager } from "../systems/SceneManager";
import { GameScene } from "./GameScene";

export class MainMenu extends Container implements Scene {
  public static SCREEN_ID = "mainMenu";
  private menuItems: ButtonContainer[] = [];

  constructor() {
    super();
    Keyboard.initialize();
    this.createMenu();
  }

  private createMenu() {
    const options = ["New Game", "Options"];

    options.forEach((label) => {
      const button = new PrimaryButton({ text: label });

      button.onPress.connect(() => this.handleOption(label));

      this.menuItems.push(button);
      this.addChild(button);
    });
  }

  private handleOption(label: string) {
    switch (label) {
      case "New Game":
        console.log("Start game!");
        sceneManager.launch(GameScene);
        break;
      case "Options":
        console.log("Open options!");
        break;
    }
  }

  public resize(w: number, h: number) {
    const spacing = 70;
    const totalHeight = spacing * (this.menuItems.length - 1);
    const startY = (h - totalHeight) / 2;

    this.menuItems.forEach((btn, index) => {
      btn.position.set(w / 2, startY + index * spacing);
      console.log(btn);
    });
  }

  public update() {
    // Placeholder for future animations
  }
}
