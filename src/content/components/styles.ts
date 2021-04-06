import { StyleRule } from '@src/types'

// styling classes
export class Styles {
  rules: StyleRule[] = []
  private _node: HTMLElement

  constructor() {
    // create rule to hide the .wip
    this.rules.push({
      selector: '.proclivity-wip',
      properties: 'display: none !important;',
    })

    this._node = this.get_or_create_node()
  }

  addRule(styles: StyleRule): void {
    this.rules.push(styles)
  }

  get_or_create_node(): HTMLElement {
    // if exists but not defined
    if (document.querySelector('#proclivity-style')) {
      let node = document.querySelector('#proclivity-style')
      return node as HTMLElement
    }

    // otherwise, create the node
    // Following code adapted from Matt Mitchell, http://stackoverflow.com/a/3286307
    // create a style header in the document
    let head = document.getElementsByTagName('HEAD')[0]
    let node = head.appendChild(window.document.createElement('style'))
    node.setAttribute('id', 'proclivity-style')
    node.setAttribute('type', 'text/css')
    node.setAttribute('rel', 'stylesheet')

    return node
  }

  get node(): HTMLElement {
    // if already defined
    if (!this._node) {
      this._node = this.get_or_create_node()
    }
    return this._node
  }

  apply(): void {
    // build CSS using contenated selectors, brackets, and styles
    console.log('outside')
    for (let rule of this.rules) {
      console.log('iteration')
      let selector = rule.selector
      let properties = rule.properties

      // create the CSS rule with properties
      let content: Text = document.createTextNode(
        selector + ' {' + properties + '}',
      )
      this.node.appendChild(content)
    }
  }

  reset(): void {
    this.node.innerHTML = ''
  }
}
