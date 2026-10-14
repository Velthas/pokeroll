console.log('☁️ Pokeroll says hello!')

type PokemonAttributeName = 'strength' | 'dexterity' | 'vitality' | 'special' | 'insight'
type PokemonAttributes = Record<PokemonAttributeName, number>

type PokemonSkillNames =
  | 'brawl'
  | 'channel'
  | 'clash'
  | 'evasion'
  | 'alert'
  | 'athletic'
  | 'nature'
  | 'stealth'
  | 'charm'
  | 'etiquette'
  | 'intimidate'
  | 'perform'
type PokemonSkills = Record<PokemonSkillNames, number>

type PokemonSocialAttributeName = 'tough' | 'cool' | 'beauty' | 'cute' | 'clever'
type PokemonSocialAttributes = Record<PokemonSocialAttributeName, number>

type PokemonRollStat = PokemonSkillNames | PokemonAttributeName | PokemonSocialAttributeName

type PokemonType =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy'

type PokemonMove = { name: string; type: string; accuracy: number; damage: number; effects: string }

function getPokemonAttributes(): PokemonAttributes | void {
  const attributeListContainer = getParentElementFromChildLabel('Attributes')

  if (!attributeListContainer) return console.error('No attribute box found')

  const pokemonAttributes = {
    strength: 0,
    dexterity: 0,
    vitality: 0,
    special: 0,
    insight: 0,
  }
  const attributeContainers = Array.from(attributeListContainer.querySelectorAll(':scope > div'))
  attributeContainers.forEach((node) => {
    const attributeNameNode = node.children[0]
    const attributeDotsNode = node.children[1]

    if (!attributeNameNode || !attributeDotsNode) return

    // Structure of attribute circles is div > div > div with bg-pokerole-black token class
    // So we need to drill to get it
    const attributeAmount = Array.from(attributeDotsNode.children).reduce((accumulator, attributeNode) => {
      const attributeCircle = attributeNode.children[0]
      if (!attributeCircle) return accumulator

      const isAttributeChecked = attributeCircle?.classList.contains('bg-pokerole-black')
      if (isAttributeChecked) return accumulator + 1

      return accumulator
    }, 0)

    const attributeName = attributeNameNode.textContent.toLowerCase()
    if (['strength', 'dexterity', 'vitality', 'special', 'insight'].includes(attributeName)) {
      pokemonAttributes[attributeName as PokemonAttributeName] = attributeAmount
    }
  })

  return pokemonAttributes
}

function getPokemonSkills(): PokemonSkills | void {
  const skillsListContainer = getParentElementFromChildLabel('Skills')

  if (!skillsListContainer) return console.error('No attribute box found')

  const pokemonSkills = {
    brawl: 0,
    channel: 0,
    clash: 0,
    evasion: 0,
    alert: 0,
    athletic: 0,
    nature: 0,
    stealth: 0,
    charm: 0,
    etiquette: 0,
    intimidate: 0,
    perform: 0,
  }

  const skillContainers = Array.from(skillsListContainer.querySelectorAll(':scope > div > div'))
  skillContainers.forEach((node) => {
    const skillNameNode = node.children[0]
    const skillDotsNode = node.children[1]

    if (!skillNameNode || !skillDotsNode) return

    // Structure of attribute circles is div > div > div with bg-pokerole-black token class
    // So we need to drill to get it
    const skillAmount = Array.from(skillDotsNode.children).reduce((accumulator, attributeNode) => {
      const skillCircle = attributeNode.children[0]
      if (!skillCircle) return accumulator

      const isSkillChecked = skillCircle?.classList.contains('bg-pokerole-black')
      if (isSkillChecked) return accumulator + 1

      return accumulator
    }, 0)

    let skillName = skillNameNode.textContent.toLowerCase()
    if (skillName === 'allure') skillName = 'charm'

    if (
      [
        'brawl',
        'channel',
        'clash',
        'evasion',
        'alert',
        'athletic',
        'nature',
        'stealth',
        'charm',
        'etiquette',
        'intimidate',
        'perform',
      ].includes(skillName)
    ) {
      pokemonSkills[skillName as PokemonSkillNames] = skillAmount
    }
  })

  return pokemonSkills
}

function getPokemonSocialAttributes(): PokemonSocialAttributes | void {
  const socialListContainer = getParentElementFromChildLabel('Socials')

  if (!socialListContainer) return console.error('No social attribute box found')

  const pokemonSocialAttributes = {
    tough: 0,
    cool: 0,
    beauty: 0,
    cute: 0,
    clever: 0,
  }

  const socialAttributeContainers = Array.from(socialListContainer.querySelectorAll(':scope > div'))

  socialAttributeContainers.forEach((node) => {
    const socialAttributeNameNode = node.children[0]
    const socialAttributeDotsNode = node.children[1]

    if (!socialAttributeNameNode || !socialAttributeDotsNode) return

    const socialAttributeAmount = Array.from(socialAttributeDotsNode.children).reduce((accumulator, attributeNode) => {
      const socialAttributeCircle = attributeNode.children[0]

      if (!socialAttributeCircle) return accumulator

      const isChecked = socialAttributeCircle.classList.contains('bg-pokerole-black')

      return isChecked ? accumulator + 1 : accumulator
    }, 0)

    const socialAttributeName = socialAttributeNameNode.textContent.toLowerCase()

    if (['tough', 'cool', 'beauty', 'cute', 'clever'].includes(socialAttributeName)) {
      pokemonSocialAttributes[socialAttributeName as PokemonSocialAttributeName] = socialAttributeAmount
    }
  })

  return pokemonSocialAttributes
}

function addInterfaceButtons(): void {
  const movesDivs = document.querySelectorAll('div.flex.flex-col.flex-grow.rounded-3xl.overflow-hidden.justify-center')

  Array.from(movesDivs).map((move) => {
    // Be defensive about generating buttons
    if (move.querySelector('.pokeroll-button')) return
    const rollButtonContainer = generateMoveRollButton()
    move.appendChild(rollButtonContainer)
  })
}

function getPokemonMoveset(): PokemonMove[] | void {
  // Pokeroledex doesn't have a container with id for moves
  // A distinguisher I could see is that the extended moves have a lighter version of the type
  // that seems to be exclusive to them. Here's hoping.
  const pokemonTypeSelector = [
    '.bg-type-normal-light',
    '.bg-type-fire-light',
    '.bg-type-water-light',
    '.bg-type-electric-light',
    '.bg-type-grass-light',
    '.bg-type-ice-light',
    '.bg-type-fighting-light',
    '.bg-type-poison-light',
    '.bg-type-ground-light',
    '.bg-type-flying-light',
    '.bg-type-psychic-light',
    '.bg-type-bug-light',
    '.bg-type-rock-light',
    '.bg-type-ghost-light',
    '.bg-type-dragon-light',
    '.bg-type-dark-light',
    '.bg-type-steel-light',
    '.bg-type-fairy-light',
  ].join(', ')

  const socialAttributes = getPokemonSocialAttributes()
  const attributes = getPokemonAttributes()
  const skills = getPokemonSkills()

  if (!skills || !attributes || !socialAttributes) {
    console.error('Could not find Pokemon stats correctly when checking for moveset')
    return
  }

  const allAttributes = { ...socialAttributes, ...attributes, ...skills }

  const formattedMoves: PokemonMove[] = []
  const moves = Array.from(document.querySelectorAll(pokemonTypeSelector))
  moves.forEach((moveContainer) => {
    const moveHeaderContainer = moveContainer.parentElement?.children[0]
    const nameContainer = moveHeaderContainer?.children[0]?.children[0]
    const moveNameContent = nameContainer?.textContent || 'Buzzinga'

    // Need to extract damage potential, accuracy, and type
    const movesInfoContainer = moveContainer.children[0]?.children[0]
    if (!movesInfoContainer || movesInfoContainer.children?.length < 4) return
    const [type, accuracy, damage, effects] = movesInfoContainer?.children || []

    // Extract the strings living inside each container
    const typeContent = type?.children?.[0]?.textContent
    const accuracyContent = accuracy?.children?.[0]?.textContent
    const damageContent = damage?.children?.[0]?.textContent
    const effectsContent = effects?.children?.[0]?.textContent

    if (!typeContent || !accuracyContent || !effectsContent) return

    const pokemonType = getPokemonTypes()
    const lowercaseTypeContent = typeContent.toLowerCase()
    const hasStabBonus = isPokemonType(lowercaseTypeContent) && pokemonType.includes(lowercaseTypeContent)

    const auditedMove = { name: '', type: '', accuracy: 0, damage: 0, effects: '' }
    auditedMove.name = moveNameContent
    auditedMove.type = typeContent
    auditedMove.accuracy = calculateMoveAccuracyDie(accuracyContent, allAttributes)
    auditedMove.damage = damageContent ? calculateMoveDamageDie(damageContent, hasStabBonus, allAttributes) : 0
    auditedMove.effects = effectsContent.split('Effects: ')?.[1] || ''

    formattedMoves.push(auditedMove)
  })

  return formattedMoves
}

// Utility to get a specific container based on some text it may contain
// Should work for attributes, social and skills
function getParentElementFromChildLabel(textToFind: string) {
  const allParagraphs = Array.from(document.querySelectorAll('p'))
  const attributeParagraph = allParagraphs.find((node) => node.textContent === textToFind)
  const attributeListContainer = attributeParagraph?.parentElement
  return attributeListContainer
}

function calculateMoveAccuracyDie(
  accuracy: string,
  attributes: Record<PokemonSkillNames | PokemonAttributeName | PokemonSocialAttributeName, number>
): number {
  const [firstAttribute, secondAttribute] = accuracy.split('+')

  if (!firstAttribute || !secondAttribute) {
    console.error('Attributes of move could not be found')
    return 0
  }

  const formattedFirstAttribute = firstAttribute.trim().toLowerCase()
  const formattedSecondAttribute = secondAttribute.trim().toLowerCase()

  if (!isPokemonRollStat(formattedFirstAttribute) || !isPokemonRollStat(formattedSecondAttribute)) {
    console.error('Attribute does not match known attributes')
    return 0
  }

  // If there's multiple, always get the highest
  const idealFirstAttribute = getIdealAttribute(formattedFirstAttribute, attributes)
  const idealSecondAttribute = getIdealAttribute(formattedSecondAttribute, attributes)

  return idealFirstAttribute + idealSecondAttribute
}

function getIdealAttribute(
  attribute: PokemonSkillNames | PokemonAttributeName | PokemonSocialAttributeName,
  attributes: Record<PokemonSkillNames | PokemonAttributeName | PokemonSocialAttributeName, number>
): number {
  if (attribute?.includes('/')) {
    const [optionOne, optionTwo] = attribute.trim().split('/')

    if (!optionOne || !optionTwo) {
      console.error('Something went wrong splitting the accuracy')
      return 0
    }

    const optionOneValue = attributes[optionOne.trim().toLowerCase() as PokemonRollStat]
    const optionTwoValue = attributes[optionTwo.trim().toLowerCase() as PokemonRollStat]

    return Math.max(optionOneValue, optionTwoValue)
  }

  return attributes[attribute]
}

function calculateMoveDamageDie(
  damage: string,
  hasStabBonus: boolean,
  attributes: Record<PokemonSkillNames | PokemonAttributeName | PokemonSocialAttributeName, number>
) {
  const [firstAttribute, secondAttribute] = damage.split('+')

  if (!firstAttribute || !secondAttribute) {
    console.error('Attributes of move could not be found')
    return 0
  }

  const formattedFirstAttribute = firstAttribute.trim().toLowerCase()

  if (!isPokemonRollStat(formattedFirstAttribute)) {
    console.error('Attribute does not match known attributes')
    return 0
  }

  // Damage should be a flat number
  if (Number(secondAttribute).toString() === 'NaN') {
    console.error('Damage number could not be converted')
  }

  // If there's multiple, always get the highest
  const idealFirstAttribute = getIdealAttribute(formattedFirstAttribute, attributes)
  return idealFirstAttribute + Number(secondAttribute) + (hasStabBonus ? 1 : 0)
}

function getPokemonTypes(): PokemonType[] {
  const typeContainer = getParentElementFromChildLabel('Type:')

  if (!typeContainer) {
    console.error('No Pokémon type container found')
    return []
  }

  return Array.from(typeContainer.querySelectorAll('img[alt]'))
    .map((img) => img.getAttribute('alt')?.toLowerCase())
    .filter((type): type is PokemonType => !!type && isPokemonType(type))
}

function generateMoveRollButton() {
  const containerDiv = document.createElement('div')
  containerDiv.classList = 'flex justify-center items-center py-2'

  const rollButton = document.createElement('button')
  rollButton.textContent = 'Display in VTT'
  rollButton.classList =
    'inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-square text-md bg-attributes-blue text-primary-foreground hover:bg-attributes-blue-dark px-3 py-2 rounded-3xl pokeroll-button'
  rollButton.addEventListener('click', (e: PointerEvent) => {
    const clickedButton = e.target as HTMLButtonElement
    const moveContainer = clickedButton.parentElement?.parentElement?.children[0]
    if (!moveContainer) return

    const moveHeaderContainer = moveContainer.parentElement?.children[0]
    const nameContainer = moveHeaderContainer?.children[0]?.children[0]
    const moveNameContent = nameContainer?.textContent

    const moves = getPokemonMoveset()
    if (!moves) {
      console.error('Moves could not be found when clicking button')
      return
    }
    const clickedMove = moves.find((move) => move.name === moveNameContent)
    if (clickedMove)
      chrome.runtime.sendMessage({
        type: 'POKEMON_MOVE',
        payload: {
          name: clickedMove.name || 'Unnamed move',
          accuracy: clickedMove?.accuracy || 0,
          damage: clickedMove?.damage || 0,
          effects: clickedMove.effects || 'None',
        },
      })
  })

  containerDiv.appendChild(rollButton)

  return containerDiv
}

function isPokemonRollStat(value: string): value is PokemonRollStat {
  const pokemonRollStats: PokemonRollStat[] = [
    'strength',
    'dexterity',
    'vitality',
    'special',
    'insight',
    'tough',
    'clever',
    'cute',
    'beauty',
    'cool',
    'brawl',
    'channel',
    'clash',
    'evasion',
    'alert',
    'athletic',
    'nature',
    'stealth',
    'charm',
    'etiquette',
    'intimidate',
    'perform',
  ]

  if (value.includes('/')) {
    return value.split('/').some((attribute) => pokemonRollStats.includes(attribute as PokemonRollStat))
  }

  return pokemonRollStats.includes(value as PokemonRollStat)
}

function isPokemonType(value: string): value is PokemonType {
  const pokemonTypes = new Set<string>([
    'normal',
    'fire',
    'water',
    'electric',
    'grass',
    'ice',
    'fighting',
    'poison',
    'ground',
    'flying',
    'psychic',
    'bug',
    'rock',
    'ghost',
    'dragon',
    'dark',
    'steel',
    'fairy',
  ])

  return pokemonTypes.has(value)
}

const websiteBody = document.querySelector('body')
const observerConfig = { childList: true, subtree: true }

const mutationCallback: MutationCallback = (mutationList, observer) => {
  for (const mutation of mutationList) {
    if (mutation.type === 'childList' || mutation.type === 'attributes') {
      const myPokemonNode = document.getElementById('my-pokemon-list')
      if (myPokemonNode) {
        const alreadyHasButtons = document.querySelector('.pokeroll-button')
        if (!alreadyHasButtons) addInterfaceButtons()
      }
    }
  }
}

// Create an observer instance linked to the callback function
const observer = new MutationObserver(mutationCallback)

// Start observing the target node for configured mutations
if (websiteBody) observer.observe(websiteBody, observerConfig)
else observer.disconnect()
