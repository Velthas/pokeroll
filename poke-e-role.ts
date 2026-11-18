console.log('☁️ Pokeroll says hello!')

type PokeERoleWidgetEntry = { title: string; subtitle: string; result: string }

const pokeERoleBody = document.querySelector('body')
const pokeERoleObserverConfig = { childList: true, subtree: true }

let hasAuditedWidget = false
let rollWidgetEntriesNumber = 0

function parseWidgetRolls() {
  const rollWidgetEntries = Array.from(document.querySelectorAll('.roll-log-widget__entry'))
  if (!rollWidgetEntries.length) return

  if (rollWidgetEntries.length === rollWidgetEntriesNumber) return

  const formattedRolls = rollWidgetEntries.map((rollNode) => {
    const widgetlabel = rollNode.querySelector('.text-label.roll-log-widget__label')
    const [rollLabel, rollTags] = widgetlabel?.children || []
    if (!rollLabel || !rollTags) console.error('Something went wrong when extracting the roll label and tags')

    const rollLabelTextContent = rollLabel?.textContent
    const rollTagsTextContent = rollTags?.textContent

    const rollResult = rollNode.querySelector('.roll-log-widget__result.text-subtext')
    const rollResultTextContent = rollResult?.textContent

    return { title: rollLabelTextContent, subtitle: rollTagsTextContent, result: rollResultTextContent }
  })

  const [lastSubmittedEntry] = formattedRolls

  chrome.runtime.sendMessage({
    type: 'POKE-E-ROLE-WIDGET-ENTRY',
    payload: lastSubmittedEntry,
  })

  rollWidgetEntriesNumber = formattedRolls.length
}

function auditRollWidget() {
  const rollWidget = document.querySelector('.roll-log-widget')

  if (!rollWidget) return

  const existingEntries = rollWidget.querySelectorAll('.roll-log-widget__entry')

  rollWidgetEntriesNumber = existingEntries.length
  hasAuditedWidget = true

  console.log('🎲 Roll widget audited', {
    existingEntries: rollWidgetEntriesNumber,
  })
}

const pokeERoleMutationCallback: MutationCallback = (mutationList, observer) => {
  for (const mutation of mutationList) {
    if (mutation.type === 'childList') {
      const rollWidget = document.querySelector('.roll-log-widget')
      if (!hasAuditedWidget) auditRollWidget()
      if (rollWidget) {
        parseWidgetRolls()
      }
    }
  }
}

// Create an observer instance linked to the callback function
const pokeERoleObserver = new MutationObserver(pokeERoleMutationCallback)

// Start observing the target node for configured mutations
if (pokeERoleBody) pokeERoleObserver.observe(pokeERoleBody, pokeERoleObserverConfig)
else pokeERoleObserver.disconnect()
