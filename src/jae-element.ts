import { animationFrame } from './utils';

export interface ElementOptions {
  /**
   * The HTML template to use for the shadow DOM.
   *
   * If not provided, no shadow DOM will be created.
   *
   * @defaultValue `undefined`
   */
  template?: HTMLTemplateElement | DocumentFragment;

  /**
   * Whether this element is interactive, i.e. it can have focus.
   *
   * @defaultValue `false`
   */
  interactive: boolean;

  /**
   * Whether this element can be activated by a mouse click or the keyboard.
   *
   * If enabled, this element emits `activate` events.
   * Only applies if `interactive` is also `true`.
   *
   * @defaultValue `true`
   */
  activatable: boolean;

  /**
   * @defaultValue `false`
   */
  delegatesFocus: boolean;
}

/**
 * Base class for any custom Jae element.
 */
export default class JaeElement extends HTMLElement {
  //#region Fields
  #elementOptions: ElementOptions;
  #internals: ElementInternals;
  //#endregion

  public constructor(elementOptions?: Partial<ElementOptions>) {
    super();

    this.#elementOptions = Object.assign({
      template: undefined,
      interactive: false,
      activatable: true,
      delegatesFocus: false,
    }, elementOptions);

    this.initializeShadowDom();
    this.#internals = this.attachInternals();
  }

  //#region Methods
  public async connectedCallback(): Promise<void> {
    this.initializeInteractive();
    await animationFrame();

    // the `ready()` method may be implemented in a sub class
    this.ready();
  }

  /**
   * @virtual
   */
  protected ready(): void {
    // this method may be implemented in a sub class
  }

  protected addState(state: string): void {
    // @ts-expect-error: Property `states` not in declaration of ElementInternals
    this.#internals.states.add(state);
  }

  protected deleteState(state: string): void {
    // @ts-expect-error: Property `states` not in declaration of ElementInternals
    this.#internals.states.delete(state);
  }

  protected hasState(state: string): boolean {
    // @ts-expect-error: Property `states` not in declaration of ElementInternals
    return this.#internals.states.has(state);
  }

  protected toggleState(state: string, enable?: boolean): void {
    if (enable == undefined) {
      // toggle state
      if (this.hasState(state)) {
        this.deleteState(state);
      } else {
        this.addState(state);
      }

      return;
    }

    if (enable) {
      this.addState(state);
    } else {
      this.deleteState(state);
    }
  }

  private emitActivateEvent(): void {
    const event = new Event('activate', {
      bubbles: false,
      cancelable: true,
      composed: true, // leave shadow dom
    });
    this.dispatchEvent(event);
  }

  private initializeShadowDom(): void {
    let rootNode: Node | undefined;

    if (this.#elementOptions.template instanceof HTMLTemplateElement) {
      rootNode = this.#elementOptions.template.content.cloneNode(true);
    } else if (this.#elementOptions.template instanceof DocumentFragment) {
      rootNode = this.#elementOptions.template.cloneNode(true);
    }

    if (rootNode) {
      const shadowRoot = this.attachShadow({
        mode: 'open',
        delegatesFocus: this.#elementOptions.delegatesFocus,
      });

      shadowRoot.append(rootNode);
    }
  }

  private initializeInteractive(): void {
    if (this.#elementOptions.interactive) {
      this.tabIndex = 0;

      let mouseDown = false;

      this.addEventListener('mousedown', mouseEvent => {
        if (mouseEvent.button == 0) {
          mouseDown = true;
          this.addState('--pressed');
        }

        window.addEventListener('mouseup', () => {
          mouseDown = false;
          this.deleteState('--pressed');
        }, {once: true});
      });

      this.addEventListener('mouseup', () => {
        if (mouseDown) {
          this.emitActivateEvent();
        }
      });

      if (this.#elementOptions.activatable) {
        // Space down: pressed
        // Space up: activate
        // Enter down: pressed (and repeat)
        // Enter up: stop repeat

        this.addEventListener('keydown', keyEvent => {
          if (keyEvent.code == 'Space') {
            keyEvent.preventDefault();
            this.addState('--pressed');
          } else if (keyEvent.code == 'Enter') {
            // do not prevent default so repeated keypress events can be triggered
            this.addState('--pressed');
          }
        });

        this.addEventListener('keypress', keyEvent => {
          if (keyEvent.code == 'Enter') {
            this.emitActivateEvent();
          }
        });

        this.addEventListener('keyup', keyEvent => {
          if (keyEvent.code == 'Space') {
            keyEvent.preventDefault();
            this.deleteState('--pressed');

            this.emitActivateEvent();
          }
        });
      }
    }
  }
  //#endregion
}
