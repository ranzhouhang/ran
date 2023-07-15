import * as pdfjs from 'pdfjs-dist/build/pdf'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'

interface Viewport {
  width: number
  height: number
  viewBox: Array<number>
}

interface RenderContext {
  canvasContext: CanvasRenderingContext2D | null
  transform: Array<number>
  viewport: Viewport
}

interface PDFPageProxy {
  pageNumber: number
  getViewport: () => Viewport
  render: (options: RenderContext) => never
}

interface PDFDocumentProxy {
  numPages: number
  getPage: (x: number) => Promise<PDFPageProxy>
}

class PdfPreview {
  private pdfDoc: PDFDocumentProxy | undefined
  pageNumber: number
  total: number
  dom: HTMLElement
  pdf: string | ArrayBuffer
  constructor(pdf: string | ArrayBuffer, dom: HTMLElement | undefined) {
    this.pageNumber = 1
    this.total = 0
    this.pdfDoc = undefined
    this.pdf = pdf
    this.dom = dom ? dom : document.body
  }
  private getPdfPage = (number: number) => {
    return new Promise((resolve, reject) => {
      if (this.pdfDoc) {
        this.pdfDoc.getPage(number).then((page: PDFPageProxy) => {
          const viewport = page.getViewport()
          const canvas = document.createElement('canvas')
          this.dom.appendChild(canvas)
          const context = canvas.getContext('2d')
          const [_, __, width, height] = viewport.viewBox
          canvas.width = width
          canvas.height = height
          viewport.width = width
          viewport.height = height
          canvas.style.width = Math.floor(viewport.width) + 'px'
          canvas.style.height = Math.floor(viewport.height) + 'px'
          const renderContext = {
            canvasContext: context,
            viewport: viewport,
            transform: [1, 0, 0, -1, 0, viewport.height],
          }
          page.render(renderContext)
          resolve({ success: true, data: page })
        })
      } else {
        reject({ success: false, data: null, message: 'pdfDoc is undefined' })
      }
    })
  }
  pdfPreview = () => {
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker
    pdfjs.getDocument(this.pdf).promise.then(async (doc: PDFDocumentProxy) => {
      this.pdfDoc = doc
      this.total = doc.numPages
      for (let i = 1; i <= this.total; i++) {
        await this.getPdfPage(i)
      }
    })
  }
  prevPage = () => {
    if (this.pageNumber > 1) {
      this.pageNumber -= 1
    } else {
      this.pageNumber = 1
    }
    this.getPdfPage(this.pageNumber)
  }
  nextPage = () => {
    if (this.pageNumber < this.total) {
      this.pageNumber += 1
    } else {
      this.pageNumber = this.total
    }
    this.getPdfPage(this.pageNumber)
  }
}

const createReader = (file: File): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.onerror = (error) => {
      reject(error)
    }
    reader.onabort = (abort) => {
      reject(abort)
    }
  })
}

export const renderPdf = async (
  file: File,
  dom?: HTMLElement,
): Promise<void> => {
  try {
    if (typeof window !== 'undefined') {
      const pdf = await createReader(file)
      if (pdf) {
        const PDF = new PdfPreview(pdf, dom)
        PDF.pdfPreview()
      }
    }
  } catch (error) {
    console.log('renderPdf', error)
  }
}