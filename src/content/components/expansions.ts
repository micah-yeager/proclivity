import DOMPurify from 'dompurify'

import { ExpansionRule, DestinationRule } from '@src/types'
import {
  parseBaseUrl,
  querySelectorAllList,
  insertElement,
  elementFromString,
} from '@src/utils'
import { Styles } from './styles'

// constants
let IMG_TYPES = ['jpg', 'png', 'gif']

// element expansions
class Expansion {
  sourceNode: HTMLElement
  destinationNode: HTMLElement
  rule: ExpansionRule

  constructor(
    sourceNode: HTMLElement,
    destinationNode: HTMLElement,
    rule: ExpansionRule,
  ) {
    this.sourceNode = sourceNode
    this.destinationNode = destinationNode
    this.rule = rule
  }

  process(): void {
    var nodeString: string = ''

    // if the target is a link...
    if (this.rule.isLink && this.sourceNode.tagName == 'A') {
      let sourceAnchorNode = this.sourceNode as HTMLAnchorElement
      // get link
      let path = sourceAnchorNode.pathname as string
      // get file extension from link
      let ext = (path.split('.').slice(-1).pop() as string).toLowerCase()

      // check if it's in the approved image extensions
      if (IMG_TYPES.indexOf(ext) > -1) {
        // build the destination node contents as an node utilizing the link (usually as an img source)
        nodeString = [
          // contentPrefix usually contains something like <img src="
          this.rule.prefix,
          DOMPurify.sanitize(path),
          // contentSuffix usually contains something like " />
          this.rule.suffix,
        ].join('')

        // otherwise, if it's a YouTube link
      } else if (parseBaseUrl(sourceAnchorNode.host) === 'youtube.com') {
        // TODO: implement YouTube imbeds
      }

      // otherwise (usually if it's just plain text)
    } else {
      // create the node with the set prefixes and suffixes
      nodeString = [
        this.rule.prefix,
        // can't sanitize using encoding since subelements are allowed and often expected
        DOMPurify.sanitize(this.sourceNode.innerHTML),
        this.rule.suffix,
      ].join('')
    }

    let newNode = elementFromString(nodeString)
    insertElement(
      newNode,
      this.destinationNode,
      (this.rule.destination as DestinationRule).insertionMethod,
    )
  }

  apply(): void {
    this.process()

    // remove the expansion source if it still exists and hasn't already been directly replaced by the expansion rule
    if (
      document.body.contains(this.sourceNode) &&
      this.rule.sourceSelector !==
        (this.rule.destination as DestinationRule).selector
    ) {
      ;(this.sourceNode.parentNode as HTMLElement).removeChild(this.sourceNode)
    }
  }
}
export class ExpansionSet {
  private _targetUnwrappedTextNodes: boolean = false
  rule: ExpansionRule
  styles: Styles

  id: string
  sourceNodes: HTMLElement[]
  destinationNodes: Text[] | HTMLElement[]

  sources: Expansion[] = []

  constructor(rule: ExpansionRule, styles: Styles) {
    this.rule = rule
    this.styles = styles

    this.id = '_' + Math.random().toString(36).substr(2, 9)
    this.sourceNodes = querySelectorAllList(rule.sourceSelector)

    // if for child unwrapped text nodes
    if (this.rule.destination === 'unwrappedTextNodes') {
      this._targetUnwrappedTextNodes = true

      this.destinationNodes = Array.from(
        (document.querySelector(this.rule.sourceSelector) as HTMLElement)
          .childNodes,
      ).filter(
        (node) =>
          node.nodeType === 3 &&
          node.textContent &&
          node.textContent.length > 1,
      ) as Text[]

      // otherwise, do the normal rule
    } else {
      this.destinationNodes = querySelectorAllList(
        (rule.destination as DestinationRule).selector,
      )
    }
  }

  process(): void {
    this.sources = []
    if (
      !this._targetUnwrappedTextNodes &&
      this.sourceNodes &&
      this.destinationNodes &&
      this.sourceNodes.length === this.destinationNodes.length
    ) {
      this.processRules()
    } else if (
      this._targetUnwrappedTextNodes &&
      this.sourceNodes &&
      this.destinationNodes
    ) {
      this.wrapTextNodes()
    }

    if (this.rule.styleProperties) {
      this.styles.apply({
        selector: '.proclivity-expansion' + this.id,
        properties: this.rule.styleProperties,
      })
    }
  }

  processRules(): void {
    let iteration = 0
    for (let sourceNode of this.sourceNodes) {
      let destinationNode = this.destinationNodes[iteration] as HTMLElement
      destinationNode.classList.add('proclivity-expansion' + this.id)

      let source = new Expansion(
        sourceNode,
        destinationNode as HTMLElement,
        this.rule,
      )
      this.sources.push(source)
      source.apply()

      iteration += 1
    }
  }

  wrapTextNodes(): void {
    for (let node of this.destinationNodes) {
      const span = document.createElement('span')
      node.after(span)
      span.appendChild(node)
      span.classList.add('proclivity-expansion' + this.id)
    }
  }
}
