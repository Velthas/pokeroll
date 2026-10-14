chrome.runtime.onMessage.addListener((message) => {
  if (message.type !== 'POKEMON_MOVE') return

  const move = message.payload as PokemonMove
  const command = formatMoveForRoll20(move)

  const chatInput = document.querySelector<HTMLTextAreaElement>('#textchat-input textarea')

  if (!chatInput) {
    console.error('Roll20 chat input not found')
    return
  }

  chatInput.value = command
  chatInput.dispatchEvent(new Event('input', { bubbles: true }))

  const sendButton = document.getElementById('chatSendBtn')
  if (sendButton) sendButton.click()
})

function formatMoveForRoll20(move: PokemonMove): string {
  return [
    '&{template:default}',
    `{{name=${move.name}}}`,
    `{{Accuracy=[[${move.accuracy}d6>4]]}}`,
    `{{Damage=[[${move.damage}d6>4]]}}`,
    move.effects ? `{{Effect=${move.effects}}}` : '',
  ]
    .filter(Boolean)
    .join(' ')
}
