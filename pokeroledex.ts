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

type PokemonResourceName = 'will'

type PokemonResources = Record<PokemonResourceName, number>

type PokemonRollStat = PokemonSkillNames | PokemonAttributeName | PokemonSocialAttributeName | PokemonResourceName

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

function getPokemonAttributes(sheet: Element): PokemonAttributes | void {
  const attributeListContainer = getParentElementFromChildLabel(sheet, 'Attributes')

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

function getPokemonSkills(sheet: Element): PokemonSkills | void {
  const skillsListContainer = getParentElementFromChildLabel(sheet, 'Skills')

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

function getPokemonSocialAttributes(sheet: Element): PokemonSocialAttributes | void {
  const socialListContainer = getParentElementFromChildLabel(sheet, 'Socials')

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

function getPokemonResources(sheet: Element): PokemonResources | void {
  const willLabelContainer = getParentElementFromChildLabel(sheet, 'Will')

  if (!willLabelContainer) {
    console.error('No Will container found')
    return
  }

  const resourceContainer = willLabelContainer.parentElement
  const maxNode = resourceContainer?.children[1]?.children[0]

  if (!maxNode?.textContent) {
    console.error('Could not find Will maximum')
    return
  }

  const maxWill = Number(maxNode.textContent.split('Max:')?.[1]?.trim())

  if (Number.isNaN(maxWill)) {
    console.error('Could not parse Will maximum')
    return
  }

  return {
    will: maxWill,
  }
}

function getPokemonMoveset(sheet: Element): PokemonMove[] | void {
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

  const socialAttributes = getPokemonSocialAttributes(sheet)
  const attributes = getPokemonAttributes(sheet)
  const skills = getPokemonSkills(sheet)
  const resources = getPokemonResources(sheet)

  if (!skills || !attributes || !socialAttributes || !resources) {
    console.error('Could not find Pokemon stats correctly when checking for moveset')
    return
  }

  const allAttributes = { ...socialAttributes, ...attributes, ...skills, ...resources }

  const formattedMoves: PokemonMove[] = []
  const moves = Array.from(sheet.querySelectorAll(pokemonTypeSelector))
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

    const pokemonType = getPokemonTypes(sheet)
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
function getParentElementFromChildLabel(sheet: Element, textToFind: string) {
  const allParagraphs = Array.from(sheet.querySelectorAll('p'))
  const attributeParagraph = allParagraphs.find((node) => node.textContent === textToFind)
  const attributeListContainer = attributeParagraph?.parentElement
  return attributeListContainer
}

function calculateMoveAccuracyDie(
  accuracy: string,
  attributes: Record<
    PokemonSkillNames | PokemonAttributeName | PokemonSocialAttributeName | PokemonResourceName,
    number
  >
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
  attribute: PokemonSkillNames | PokemonAttributeName | PokemonSocialAttributeName | PokemonResourceName | 'allure',
  attributes: Record<
    PokemonSkillNames | PokemonAttributeName | PokemonSocialAttributeName | PokemonResourceName,
    number
  >
): number {
  if (attribute?.includes('/')) {
    let [optionOne, optionTwo] = attribute.trim().split('/')

    if (!optionOne || !optionTwo) {
      console.error('Something went wrong splitting the accuracy')
      return 0
    }

    // Issue with Pokeroledex where charm is wrongly reported as allure
    if (optionOne === 'allure') optionOne = 'charm'
    if (optionTwo === 'allure') optionOne = 'charm'

    const optionOneValue = attributes[optionOne.trim().toLowerCase() as PokemonRollStat]
    const optionTwoValue = attributes[optionTwo.trim().toLowerCase() as PokemonRollStat]

    return Math.max(optionOneValue, optionTwoValue)
  }

  if (attribute === 'allure') return attributes['charm']
  return attributes[attribute]
}

function calculateMoveDamageDie(
  damage: string,
  hasStabBonus: boolean,
  attributes: Record<
    PokemonSkillNames | PokemonAttributeName | PokemonSocialAttributeName | PokemonResourceName,
    number
  >
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

function getPokemonTypes(sheet: Element): PokemonType[] {
  const typeContainer = getParentElementFromChildLabel(sheet, 'Type:')

  if (!typeContainer) {
    console.error('No Pokémon type container found')
    return []
  }

  return Array.from(typeContainer.querySelectorAll('img[alt]'))
    .map((img) => img.getAttribute('alt')?.toLowerCase())
    .filter((type): type is PokemonType => !!type && isPokemonType(type))
}

function getNameLabel(sheet: Element) {
  return Array.from(sheet.querySelectorAll('p')).find((label) => /^Name:\s*\S/i.test(label.textContent.trim()))
}

function getRollerName(sheet: Element) {
  return getNameLabel(sheet)
    ?.textContent.trim()
    .replace(/^Name:\s*/i, '')
}

function createRollButton(label: string) {
  const button = document.createElement('button')
  button.type = 'button'
  button.textContent = label
  button.className =
    'inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-square text-md bg-attributes-blue text-primary-foreground hover:bg-attributes-blue-dark px-3 py-2 rounded-3xl pokeroll-button'
  return button
}

const audienceStorageKey = 'pokeroll.gmOnly'
let isRollForGm = sessionStorage.getItem(audienceStorageKey) === 'true'

function renderAudienceToggle(button: HTMLButtonElement) {
  button.textContent = isRollForGm ? 'Rolls: GM only' : 'Rolls: Public'
  button.classList.toggle('bg-pokerole-green', !isRollForGm)
  button.classList.toggle('bg-pokerole-yellow', isRollForGm)
  button.setAttribute('aria-pressed', String(isRollForGm))
}

function createAudienceToggle() {
  const button = createRollButton('')
  button.classList.remove('bg-attributes-blue', 'hover:bg-attributes-blue-dark', 'text-primary-foreground')
  button.classList.add('pokeroll-audience', 'text-pokerole-black')
  button.setAttribute('aria-label', 'Send rolls to GM only')
  renderAudienceToggle(button)
  button.addEventListener('click', () => {
    isRollForGm = !isRollForGm
    sessionStorage.setItem(audienceStorageKey, String(isRollForGm))
    document.querySelectorAll<HTMLButtonElement>('.pokeroll-audience').forEach(renderAudienceToggle)
  })
  return button
}

function generateMoveRollButton(sheet: Element) {
  const clickedButton = createRollButton('Display in VTT')
  clickedButton.addEventListener('click', () => {
    const moveContainer = clickedButton.parentElement?.parentElement?.children[0]
    if (!moveContainer) return

    const moveHeaderContainer = moveContainer.parentElement?.children[0]
    const nameContainer = moveHeaderContainer?.children[0]?.children[0]
    const moveNameContent = nameContainer?.textContent

    const moves = getPokemonMoveset(sheet)
    if (!moves) {
      console.error('Moves could not be found when clicking button')
      return
    }
    const clickedMove = moves.find((move) => move.name === moveNameContent)
    if (clickedMove)
      chrome.runtime.sendMessage({
        type: 'POKEROLEDEX-MOVE',
        isRollForGm,
        payload: {
          pokemonName: getRollerName(sheet),
          name: clickedMove.name || 'Unnamed move',
          accuracy: clickedMove?.accuracy || 0,
          damage: clickedMove?.damage || 0,
          effects: clickedMove.effects || 'None',
        },
      })
  })

  return clickedButton
}

function addInterfaceButtons(sheet: Element): void {
  // This is just the classes on the moves divs inside Pokeroll - this could break quite easily if this were to change...
  const movesDivs = sheet.querySelectorAll('div.flex.flex-col.flex-grow.rounded-3xl.overflow-hidden.justify-center')

  movesDivs.forEach((move) => {
    if (move.querySelector('.pokeroll-move-controls')) return
    // Replace controls left in an open sheet by the previous extension version.
    move.querySelectorAll('button.pokeroll-button').forEach((button) => button.remove())
    const controls = document.createElement('div')
    controls.className = 'pokeroll-move-controls flex gap-2 justify-center items-center py-2'
    controls.appendChild(generateMoveRollButton(sheet))
    move.appendChild(controls)
  })
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
    'will',
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

// Vector adaptations of the Pokémon HOME category symbols in Bulbagarden Archives:
// https://bulbapedia.bulbagarden.net/wiki/File:Physical_icon_HOME.png
// https://bulbapedia.bulbagarden.net/wiki/File:Special_icon_HOME.png
const clashIconPaths = {
  physical:
    'M33 9 52 1 44 12 65 8 48 20 62 24 46 28 51 38 36 34 30 50 24 37 10 46 18 32 1 32 14 23 2 14 20 16 15 5 29 11 31 1Z',
  special: [
    'M33 5a28 19 0 1 1 0 38 28 19 0 1 1 0-38Z',
    'M33 9a24 15 0 1 1 0 30 24 15 0 1 1 0-30Z',
    'M33 12a18 12 0 1 1 0 24 18 12 0 1 1 0-24Z',
    'M33 16a14 8 0 1 1 0 16 14 8 0 1 1 0-16Z',
    'M33 19a8 5 0 1 1 0 10 8 5 0 1 1 0-10Z',
  ].join(' '),
}

function createClashIcon(category: keyof typeof clashIconPaths) {
  const ns = 'http://www.w3.org/2000/svg'
  const icon = document.createElementNS(ns, 'svg')
  icon.setAttribute('viewBox', '0 0 66 52')
  icon.setAttribute('width', '22')
  icon.setAttribute('height', '18')
  icon.setAttribute('aria-hidden', 'true')
  icon.setAttribute('focusable', 'false')
  const symbol = document.createElementNS(ns, 'path')
  symbol.setAttribute('d', clashIconPaths[category])
  symbol.setAttribute('fill', 'currentColor')
  symbol.setAttribute('fill-rule', 'evenodd')
  icon.appendChild(symbol)
  return icon
}

const maneuvers = [
  { name: 'Physical Clash', icon: 'physical', attribute: 'strength', skill: 'clash' },
  { name: 'Special Clash', icon: 'special', attribute: 'special', skill: 'clash' },
  { name: 'Evade', icon: null, attribute: 'dexterity', skill: 'evasion' },
] as const

function addManeuverButtons(sheet: Element, header: Element) {
  if (header.querySelector('.pokeroll-maneuvers')) return

  const row = document.createElement('div')
  row.className = 'pokeroll-maneuvers col-span-full flex flex-wrap gap-2 justify-center'
  row.appendChild(createAudienceToggle())
  for (const { name, icon, attribute, skill } of maneuvers) {
    const button = createRollButton(name)
    if (icon) {
      button.classList.add('gap-2')
      button.prepend(createClashIcon(icon))
    }
    button.addEventListener('click', () => {
      const attributes = getPokemonAttributes(sheet)
      const skills = getPokemonSkills(sheet)
      const pokemonName = getRollerName(sheet)
      if (!attributes || !skills || !pokemonName) return

      chrome.runtime.sendMessage({
        type: 'POKEROLEDEX-MOVE',
        isRollForGm,
        payload: { kind: 'maneuver', pokemonName, name, pool: attributes[attribute] + skills[skill] },
      })
    })
    row.appendChild(button)
  }
  header.appendChild(row)
}

function refreshPokemonSheets() {
  for (const sheet of document.querySelectorAll('[data-radix-scroll-area-viewport]')) {
    const header = getNameLabel(sheet)?.parentElement?.parentElement
    if (!header || header.closest('[data-radix-scroll-area-viewport]') !== sheet) continue
    if (!getParentElementFromChildLabel(sheet, 'Skills')) continue
    addManeuverButtons(sheet, header)
    addInterfaceButtons(sheet)
  }
}

refreshPokemonSheets()
new MutationObserver(refreshPokemonSheets).observe(document.body, { childList: true, subtree: true })
