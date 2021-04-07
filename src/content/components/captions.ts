import DOMPurify from 'dompurify'

import { CaptionRule } from '@src/types'
import { Styles } from './styles'

// caption rules
class PostComicWrapper {
  comicNode: HTMLCanvasElement
  rule: CaptionRule
  styles: Styles

  private _node: HTMLElement | undefined

  constructor(comicNode: HTMLCanvasElement, rule: CaptionRule, styles: Styles) {
    this.comicNode = comicNode
    this.rule = rule
    this.styles = styles
  }

  // create an wrapper element in which to put the copied content
  get node(): HTMLElement {
    // if the node is known, return it
    if (this._node) {
      return this._node
    }

    this._node = document.createElement('div')
    this._node.setAttribute('class', 'proclivity-wrapper')

    let targetNode
    if (this.rule.destination && this.rule.destination.selector) {
      targetNode = document.querySelector(this.rule.destination.selector)

      if (targetNode) {
        // sibling nodes
        if (this.rule.destination.insertionMethod === 'before') {
          ;(targetNode.parentNode as HTMLElement).insertBefore(
            this._node,
            targetNode,
          )
        } else if (this.rule.destination.insertionMethod === 'after') {
          ;(targetNode.parentNode as HTMLElement).insertBefore(
            this._node,
            targetNode.nextSibling,
          )

          // parent nodes
        } else if (this.rule.destination.insertionMethod === 'prependChild') {
          targetNode.prepend(this._node)
        } else if (this.rule.destination.insertionMethod === 'appendChild') {
          targetNode.appendChild(this._node)

          // failsafe if no match
        } else {
          targetNode = undefined
        }
      }
    }

    if (!targetNode) {
      // place the created element after the comic
      ;(this.comicNode.parentNode as HTMLElement).insertBefore(
        this._node,
        this.comicNode.nextSibling,
      )
    }

    // add a class to the created element to temporarily hide it until processing is done
    this._node.classList.add('proclivity-wip')

    return this._node
  }

  set altText(data: string) {
    // create a text element
    let altNode = document.createElement('p')
    altNode.setAttribute('class', 'proclivity-alt-text')
    // create the alt-text to be added
    let altTextNode = document.createTextNode(data)
    // add the alt-text to the text element
    altNode.appendChild(altTextNode)
    // add the text element to the wrapper
    this.node.appendChild(altNode)

    // if the ruleset includes styling rules
    if (this.rule.styleProperties) {
      // build CSS rules to be added later
      this.styles.apply({
        selector: '.proclivity-wrapper > p',
        properties: this.rule.styleProperties,
      })
    }
  }

  set afterComic(node: HTMLElement) {
    if (!document.querySelector('#proclivity-after-comic')) {
      node.setAttribute('id', 'proclivity-after-comic')

      // create a wrapper since we don't want it inline with the static caption
      let afterComicWrapper = document.createElement('div')
      afterComicWrapper.appendChild(node)

      // place the post-comic content within the wrapper
      this.node.insertAdjacentHTML('beforeend', afterComicWrapper.outerHTML)
    }
  }

  apply(): void {
    // add class to wrapper for styling
    this.node.classList.add('proclivity-wrapper')
    // set the wrapper width to the comic width
    if (this.rule.wrapperStyleProperties) {
      this.styles.apply({
        selector: '.proclivity-wrapper',
        properties: this.rule.wrapperStyleProperties,
      })
    }
    this.styles.apply({
      selector: '.proclivity-wrapper',
      properties: 'width:' + this.comicNode.width + 'px; margin: 0 auto',
    })
    // remove the temporary class to reveal it on the page
    this.node.classList.remove('proclivity-wip')
  }

  clear(): void {
    this.node.innerHTML = ''
  }
}
export class Caption {
  node: HTMLCanvasElement
  rule: CaptionRule
  styles: Styles

  postComicWrapper: PostComicWrapper
  afterComicNode: HTMLCanvasElement | null

  private _altText: string = ''

  constructor(node: HTMLCanvasElement, rule: CaptionRule, styles: Styles) {
    this.node = node
    this.rule = rule
    this.styles = styles

    this.postComicWrapper = new PostComicWrapper(node, rule, styles)
    this.afterComicNode = document.querySelector(
      rule.afterComicSelector as string,
    )
  }

  get altText(): string {
    // if alt-text is already defined, return it
    if (this._altText) {
      return this._altText

      // otherwise, find it
    } else {
      let data = DOMPurify.sanitize(this.node.getAttribute('title') as string)
      // if title text doesn't match the ignored regex
      if (data && !this._inIgnoreList(data)) {
        this._altText = data
      }
      return this._altText
    }
  }

  _inIgnoreList(data: string): boolean {
    // check if alt-text matches any ignored patterns (as listed in the ruleset)
    if (this.rule.ignoredPatterns) {
      for (let rawIgnoredPattern of this.rule.ignoredPatterns) {
        // use RegEx to test for the patterns
        let ignoredPattern = new RegExp(rawIgnoredPattern, 'g')
        // if a match is found, return true
        if (data.search(ignoredPattern) !== -1) {
          return true
        }
      }
    }
    return false
  }

  process(): void {
    // add the alt-text to the post-comic wrapper
    if (this.altText) {
      this.postComicWrapper.altText = this.altText
    }
    // add the after-comic to the post-comic wrapper
    if (this.afterComicNode) {
      this.postComicWrapper.afterComic = this.afterComicNode
    }

    this.postComicWrapper.apply()
  }
}
