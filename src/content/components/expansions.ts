import DOMPurify from 'dompurify'

import { ExpansionRule } from '@src/types'
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
  sourceNode: HTMLCanvasElement
  destinationNode: HTMLCanvasElement
  rule: ExpansionRule

  constructor(
    sourceNode: HTMLCanvasElement,
    destinationNode: HTMLCanvasElement,
    rule: ExpansionRule,
  ) {
    this.sourceNode = sourceNode
    this.destinationNode = destinationNode
    this.rule = rule
  }

  process(): void {
    let sourceNode = this.sourceNode
    var nodeString: string = ''

    // if the target is a link...
    if (this.rule.isLink && this.sourceNode.tagName == 'A') {
      let sourceAnchorNode = sourceNode as HTMLAnchorElement
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
      sourceNode = sourceAnchorNode

      // otherwise (usually if it's just plain text)
    } else {
      // create the node with the set prefixes and suffixes
      nodeString = [
        this.rule.prefix,
        // can't sanitize using encoding since subelements are allowed and often expected
        DOMPurify.sanitize(sourceNode.innerHTML),
        this.rule.suffix,
      ].join('')
    }

    let newNode = elementFromString(nodeString)
    insertElement(
      newNode,
      this.destinationNode,
      this.rule.destination.insertionMethod,
    )
  }

  apply(): void {
    this.process()

    // remove the expansion source if it still exists and hasn't already been directly replaced by the expansion rule
    if (
      document.body.contains(this.sourceNode) &&
      this.rule.sourceSelector !== this.rule.destination.selector
    ) {
      ;(this.sourceNode.parentNode as HTMLElement).removeChild(this.sourceNode)
    }
  }
}
export class ExpansionSet {
  rule: ExpansionRule
  styles: Styles

  id: string
  sourceNodes: HTMLCanvasElement[]
  destinationNodes: HTMLCanvasElement[]

  sources: Expansion[] = []

  constructor(rule: ExpansionRule, styles: Styles) {
    this.rule = rule
    this.styles = styles

    this.id = '_' + Math.random().toString(36).substr(2, 9)
    this.sourceNodes = querySelectorAllList(rule.sourceSelector)
    this.destinationNodes = querySelectorAllList(rule.destination.selector)
  }

  process(): void {
    this.sources = []
    if (
      this.sourceNodes &&
      this.destinationNodes &&
      this.sourceNodes.length === this.destinationNodes.length
    ) {
      let iteration = 0
      for (let sourceNode of this.sourceNodes) {
        let destinationNode = this.destinationNodes[iteration]
        destinationNode.classList.add('proclivity-expansion' + this.id)

        let source = new Expansion(sourceNode, destinationNode, this.rule)
        this.sources.push(source)
        source.apply()

        iteration += 1
      }
      if (this.rule.styleProperties) {
        this.styles.apply({
          selector: '.proclivity-expansion' + this.id,
          properties: this.rule.styleProperties,
        })
      }
    }
  }
}
