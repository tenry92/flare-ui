import FlareElement from '../flare-element';

export default class Option extends FlareElement {
  //#region Fields
  /**
   * @reflectsHtmlAttribute selected
   */
  public get selected(): boolean {
    return this.hasAttribute('selected');
  }

  public set selected(value: boolean) {
    if (value) {
      this.setAttribute('selected', 'selected');
    } else {
      this.removeAttribute('selected');
    }
  }

  /**
   * @reflectsHtmlAttribute value
   */
  public get value(): string {
    return this.getAttribute('value') || '';
  }

  public set value(value: string) {
    this.setAttribute('value', value);
  }
  //#endregion

  public constructor() {
    super({
      interactive: true,
    });

    this.addEventListener('mousemove', () => {
      this.focus();
    });
  }
}
