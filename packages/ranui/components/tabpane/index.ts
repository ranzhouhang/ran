interface ExtendParentNode {
  updateAttribute: (
    key: string,
    attribute: string,
    value?: string | null,
  ) => void
}

function CustomElement() {
  if (typeof window !== 'undefined' && !customElements.get('r-tab')) {
    class TabPane extends HTMLElement {
      static get observedAttributes() {
        return ['label', 'key', 'disabled', 'icon', 'effect']
      }
      _div: HTMLElement
      parent: (ParentNode & ExtendParentNode) | undefined | null
      constructor() {
        super()
        this._div = document.createElement('slot')
        const shadowRoot = this.attachShadow({ mode: 'closed' })
        shadowRoot.appendChild(this._div)
      }
      get label() {
        return this.getAttribute('label') || ''
      }
      set label(value) {
        this.setAttribute('label', value)
      }
      get icon() {
        return this.getAttribute('icon')
      }
      set icon(value) {
        if (value) {
          this.setAttribute('icon', value)
        }
      }
      get key() {
        return (
          this.getAttribute('ranKey') ||
          this.getAttribute('rankey') ||
          this.getAttribute('ran-key') ||
          this.getAttribute('key')
        )
      }
      set key(value) {
        if (value) {
          this.setAttribute('key', value)
        } else {
          this.removeAttribute('key')
        }
      }
      get disabled() {
        return this.getAttribute('disabled')
      }
      set disabled(value) {
        if (!value || value === 'false') {
          this.removeAttribute('disabled')
        } else {
          this.setAttribute('disabled', value)
        }
      }
      get effect() {
        return this.getAttribute('effect')
      }
      set effect(value) {
        if (!value || value === 'false') {
          this.removeAttribute('effect')
        } else {
          this.setAttribute('effect', value)
        }
      }
      onClick(e: Event) {
        console.log('e', e)
      }
      /**
       * @description: 在页面元素都加载完毕后，设置 tab 上的图标
       */
      initAttribute = () => {
        this.parent = this.parentNode as ParentNode & ExtendParentNode
        this.key && this.parent?.updateAttribute(this.key, 'icon', this.icon)
        this.key && this.parent?.updateAttribute(this.key, 'effect', this.effect)
      }
      connectedCallback() {
        this._div.addEventListener('click', this.onClick)
        document.addEventListener('DOMContentLoaded', this.initAttribute)
      }
      disconnectCallback() {
        document.removeEventListener('DOMContentLoaded', this.initAttribute)
      }
      attributeChangedCallback(
        name: string,
        oldValue: string,
        newValue: string,
      ) {
        if (oldValue !== newValue) {
          if (this.key && name === 'icon' && this.parent?.updateAttribute) {
            this.parent?.updateAttribute(this.key, 'icon', newValue)
          }
          if (this.key && name === 'effect' && this.parent?.updateAttribute) {
            this.parent?.updateAttribute(this.key, 'effect', newValue)
          }
          if (name === 'disabled') {
            // TODO 设置disabled或者key之后，会影响父组件
            // console.log('this.parentNode-->', this.parentElement,this.parentNode);
          }
        }
      }
    }
    customElements.define('r-tab', TabPane)
    return TabPane
  }
}

export default CustomElement()
