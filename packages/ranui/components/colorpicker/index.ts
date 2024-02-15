import { addClassToElement, removeClassToElement } from 'ranuts';
import { HTMLElementSSR, createCustomError } from '@/utils/index';
import '@/components/popover'
import '@/components/content'
import './index.less'

// RGBA： red、green、blue, 透明度 
// HSL： 色相、饱和度、亮度，透明度
// HSB： 色相、饱和度、明度，透明度
// HSV： 色相、饱和度、明度，透明度

interface Context {
    disabled: boolean;
    value: string
}

export class ColorPicker extends (HTMLElementSSR()!) {
    [x: string]: any;
    colorpicker: HTMLDivElement;
    colorpickerInner: HTMLDivElement;
    context: Context;
    popoverBlock: HTMLElement;
    popoverContent: HTMLElement;
    colorPickerInner?: HTMLDivElement;
    colorPickerInnerContent?: HTMLDivElement;
    colorPickerPanel?: HTMLDivElement;
    colorPickerInputContainer?: HTMLDivElement;
    colorPickerInnerContentSelect?: HTMLDivElement;
    colorPickerPanelPalette?: HTMLDivElement;
    static get observedAttributes(): string[] {
        return ['disabled', 'value'];
    }
    constructor() {
        super();
        this.setAttribute('class', 'ran-colorpicker')
        this.popoverBlock = document.createElement('r-popover')
        this.popoverBlock.setAttribute('class', 'ran-popover')
        this.popoverContent = document.createElement('r-content')
        this.popoverContent.setAttribute('class', 'ran-content')
        this.colorpicker = document.createElement('div')
        this.colorpicker.setAttribute('class', 'ran-colorpicker-block')
        this.colorpickerInner = document.createElement('div')
        this.colorpickerInner.setAttribute('class', 'ran-colorpicker-inner')
        this.popoverBlock.appendChild(this.colorpicker)
        this.popoverBlock.appendChild(this.popoverContent)
        this.colorpicker.appendChild(this.colorpickerInner)
        this.appendChild(this.popoverBlock)
        this.context = {
            value: '',
            disabled: false
        }
    }
    get value(): string {
        return this.context.value
    }
    set value(value: string) {
        this.setAttribute('value', value);
        this.updateColorValue(value)
    }
    updateColorValue = (value: string): void => {
        if (value !== this.context.value) {
            this.colorpickerInner.style.setProperty('background', value)
            this.context.value = value
        }
    }
    openColorPicker = (): void => {
        // this.popoverContent.innerHTML = '1111'
        if (this.colorPickerInner) return
        this.colorPickerInner = document.createElement('div')
        this.colorPickerInner.setAttribute('class', 'ran-color-picker-inner')
        this.colorPickerInnerContent = document.createElement('div')
        this.colorPickerInnerContent.setAttribute('class', 'ran-color-picker-inner-content')
        this.colorPickerPanel = document.createElement('div')
        this.colorPickerPanel.setAttribute('class', 'ran-color-picker-panel')

        this.colorPickerInputContainer = document.createElement('div')
        this.colorPickerInputContainer.setAttribute('class', 'ran-color-picker-input-container')
        this.colorPickerInner.appendChild(this.colorPickerInnerContent)
        this.colorPickerInnerContent.appendChild(this.colorPickerPanel)
        this.colorPickerInnerContent.appendChild(this.colorPickerInputContainer)
        this.colorPickerInnerContentSelect = document.createElement('div')
        this.colorPickerInnerContentSelect.setAttribute('class', 'ran-color-picker-select')
        this.colorPickerPanel.appendChild(this.colorPickerInnerContentSelect)
        this.colorPickerPanelPalette = document.createElement('div')
        this.colorPickerPanelPalette.setAttribute('class', 'ran-color-picker-palette')
        this.colorPickerInnerContentSelect.appendChild(this.colorPickerPanelPalette)
        this.colorPickerPanelSaturation = document.createElement('div')
        this.colorPickerPanelSaturation.setAttribute('class', 'ran-color-picker-saturation')
        this.colorPickerPanelDot = document.createElement('div')
        this.colorPickerPanelDot.setAttribute('class', 'ran-color-picker-palette-dot')
        this.colorPickerPanelPalette.appendChild(this.colorPickerPanelDot)
        this.colorPickerPanelPalette.appendChild(this.colorPickerPanelSaturation)

        this.colorPickerPanelSliderContainer = document.createElement('div')
        this.colorPickerPanelSliderContainer.setAttribute('class', 'ran-color-picker-slider-container')

        this.colorPickerInner.appendChild(this.colorPickerInnerContent)
        this.popoverContent.appendChild(this.colorPickerInner)
    }
    changePopoverContent = (e: Event): void => {
        const { type, value } = (<CustomEvent>e).detail
        if (type === "childList") {
            // this.createContent(value.content)
        }
    }
    connectedCallback(): void {
        this.addEventListener('click', this.openColorPicker)
    }
    disconnectCallback(): void {
        this.removeEventListener('click', this.openColorPicker)
    }
    attributeChangedCallback(n: string, o: string, v: string): void {
        if (o !== v) {
            if (n === 'value') {
                this.updateColorValue(v)
            }
        }
    }
}

function Custom() {
    if (typeof document !== 'undefined' && !customElements.get('r-colorpicker')) {
        customElements.define('r-colorpicker', ColorPicker);
        return ColorPicker;
    } else {
        return createCustomError('document is undefined or r-colorpicker is exist');
    }
}

export default Custom();