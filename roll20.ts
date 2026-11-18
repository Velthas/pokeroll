chrome.runtime.onMessage.addListener((message) => {
  if (message.type !== 'POKEROLEDEX-MOVE' && message.type !== 'POKE-E-ROLE-WIDGET-ENTRY') return

  switch (message.type) {
    case 'POKEROLEDEX-MOVE': {
      const roll = message.payload as PokeroledexRoll
      const isRollForGm = Boolean(message.isRollForGm)
      const command = roll.kind === 'maneuver'
        ? `&{template:default} {{name=${rollTitle(roll)}}} {{Successes=[[${roll.pool}d6>4]]}}`
        : formatPokeroledexMoveForRoll20(roll)

      sendCommandInRoll20Chat(isRollForGm ? `/w gm ${command}` : command)
      break
    }
    case 'POKE-E-ROLE-WIDGET-ENTRY': {
      const widgetEntry = message.payload as PokeERoleWidgetEntry
      const command = formatPokeERoleWidgetEntryForRoll20(widgetEntry)

      sendCommandInRoll20Chat(command)
    }
  }
})

type NamedRoll = { name: string; pokemonName?: string }
type MoveRoll = NamedRoll & PokemonMove & { kind?: 'move' }
type PokeroledexRoll = MoveRoll | (NamedRoll & { kind: 'maneuver'; pool: number })

function rollTitle({ name, pokemonName }: NamedRoll): string {
  const title = pokemonName ? `${pokemonName} — ${name}` : name
  return title.replace(/[\r\n]+/g, ' ').replace(/[&{}\[\]@%?#<>|]/g, char => `&#${char.charCodeAt(0)};`)
}

function formatPokeroledexMoveForRoll20(move: MoveRoll): string {
  return [
    '&{template:default}',
    `{{name=${rollTitle(move)}}}`,
    `{{Accuracy=[[${move.accuracy}d6>4]]}}`,
    `{{Damage=[[${move.damage}d6>4]]}}`,
    move.effects ? `{{Effect=${move.effects}}}` : '',
  ]
    .filter(Boolean)
    .join(' ')
}

function formatPokeERoleWidgetEntryForRoll20({ title, subtitle, result }: PokeERoleWidgetEntry): string {
  return ['&{template:default}', `{{name=${title}}}`, `{{breakdown=${subtitle}}}`, `{{outcome=${result}}}`]
    .filter(Boolean)
    .join(' ')
}

function sendCommandInRoll20Chat(command: string) {
  const chatInput = document.querySelector<HTMLTextAreaElement>('#textchat-input textarea')

  if (!chatInput) {
    console.error('Roll20 chat input not found')
    return
  }

  chatInput.value = command
  chatInput.dispatchEvent(new Event('input', { bubbles: true }))

  const sendButton = document.getElementById('chatSendBtn')
  if (sendButton) sendButton.click()
}
