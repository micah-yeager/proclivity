import Mousetrap from 'tn-mousetrap'

import { NavigationRule } from '@src/types'

export class Navigation {
  nextCombo: string
  prevCombo: string
  rule: NavigationRule

  levelsRange: number[] = []
  nextBound: boolean = false
  prevBound: boolean = false

  constructor(rule: NavigationRule, nextCombo: string, prevCombo: string) {
    this.rule = rule
    this.nextCombo = nextCombo
    this.prevCombo = prevCombo
  }

  initialize(): void {
    // get next and previous button elements
    let prev: HTMLElement | null = document.querySelector(
      this.rule.previousSelector,
    )
    let next: HTMLElement | null = document.querySelector(
      this.rule.nextSelector,
    )

    // if defined, get the parents from selector (since queries can't select parent nodes)
    // need to use if {} because range generation will still generate a single-element array if undefined
    // this is the equivalent of Python's range()
    if (!this.levelsRange && this.rule.levelsAboveSelector) {
      this.levelsRange = [...Array(this.rule.levelsAboveSelector).keys()]
    }

    // bind the key combos
    if (prev && !this.prevBound) {
      // add for idempotency
      this.prevBound = true

      // get parents as defined above
      for (let {} of this.levelsRange) {
        prev = (prev as HTMLElement).parentElement
      }

      Mousetrap.bind(this.prevCombo, (event: any) => {
        // if the prev element exists, click it
        ;(prev as HTMLElement).click()
      })
    }

    if (next && !this.nextBound) {
      // add for idempotency
      this.nextBound = true

      // get parents as defined above
      for (let {} of this.levelsRange) {
        next = (next as HTMLElement).parentElement
      }

      Mousetrap.bind(this.nextCombo, (event: any) => {
        // if the next element exists, click it
        ;(next as HTMLElement).click()
      })
    }
  }

  reset(): void {
    Mousetrap.unbind(this.nextCombo)
    Mousetrap.unbind(this.prevCombo)
  }
}
