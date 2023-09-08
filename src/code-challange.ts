const translationMap = new Map<string, string>();
const romanArabicMap = new Map<string, number>([['I',1], ['V',5], ['X', 10],['L', 50],['C', 100],['D', 500],['M', 1000]])
const resourceCostMap = new Map<string, number>()
const errorMessage = 'I have no idea what you are talking about'
const setRomanRegex = new RegExp(/^\w+\sis\s[IVXLCDM]$/)
const howMuchQuestionString = 'how much is '
const howManyQuestionString = 'how many Credits is '

function getSetCreditsRegex() {
    return new RegExp(`(${Array.from(translationMap.keys()).join('|')})\\s\\w+\\sis\\s\\d+\\sCredits`);
}

function checkIfQuestion(input: string): boolean {
    return (input.startsWith(howMuchQuestionString) || input.startsWith(howManyQuestionString)) && input.endsWith('?')
}

function getRomanNumberInArabicNumber(romanNumber: string): number {
    const romanNumberArray = romanNumber.split('')
    let arabicNumber = 0
    let skipNextNumber = false
    for(let i=0; i<romanNumber.length; i++)  {
        if(skipNextNumber) {
            skipNextNumber = false
            continue
        }

        const arabicNumberFromMap = romanArabicMap.get(romanNumberArray[i])

        if(!arabicNumberFromMap) {
            throw errorMessage
        }

        const nextNumber = i < romanNumber.length-1 ? romanArabicMap.get(romanNumberArray[i+1]) : undefined

        if(nextNumber && (nextNumber > arabicNumberFromMap)) {
            arabicNumber += nextNumber - arabicNumberFromMap
            skipNextNumber = true
            continue
        }

        arabicNumber += arabicNumberFromMap
    }

    return arabicNumber
}

function getIntergalacticNumberInArabicNumber(intergalacticNumber: Array<string>): number {
    let romanNumber = ''
    intergalacticNumber.forEach((x) => {
        romanNumber += translationMap.get(x)
    })

    return getRomanNumberInArabicNumber(romanNumber)
}

function handleTranslateNumber(input: string) {
    const intergalacticNumber = input.split(' ')[0]
    const romanNumber = input.split(' ')[2]

    if(!romanArabicMap.has(romanNumber)) {
        throw errorMessage
    }

    translationMap.set(intergalacticNumber, romanNumber)
    return
}

function handleSetResourceValue(input: string) {
    const resourceWithAmount = input.split(' is ')[0]
    const costWithAmount = Number(input.split(' is ')[1].split(' ')[0])

    const resourceWithAmountArray = resourceWithAmount.split(' ')

    const amountInIntergalacticNumber: Array<string> = []
    resourceWithAmountArray.forEach((word) => {
        if(translationMap.has(word)) {
            amountInIntergalacticNumber.push(word)
        }
    })

    const resource = resourceWithAmount.replace(amountInIntergalacticNumber.join(' '), '').trim()
    const amountInArabicNumber = getIntergalacticNumberInArabicNumber(amountInIntergalacticNumber)
    const costPerResource = costWithAmount / amountInArabicNumber
    resourceCostMap.set(resource, costPerResource)
}

function handleHowMuchQuestion(input: string) {
    const intergalacticNumber = input.replace(howMuchQuestionString, '').replace('?', '')

    const arabicNumber = getIntergalacticNumberInArabicNumber(intergalacticNumber.trim().split(' '))

    return `${intergalacticNumber}is ${arabicNumber}`
}
function handleHowManyQuestion(input: string) {
    const numberAndResources = input.replace(howManyQuestionString, '').split(' ')

    const intergalacticNumber:Array<string> = []
    let resource = ''

    for (let i=0; i< numberAndResources.length; i++) {
        if(translationMap.has(numberAndResources[i])) {
            intergalacticNumber.push(numberAndResources[i])
            continue
        }
        if(resourceCostMap.has(numberAndResources[i])) {
            resource = numberAndResources[i]
            break
        }
    }

    if(intergalacticNumber.length === 0) {
        throw errorMessage
    }

    const amount = getIntergalacticNumberInArabicNumber(intergalacticNumber)
    const costPerResource = resourceCostMap.get(resource)

    if(!costPerResource) {
        throw errorMessage
    }

    const cost = costPerResource * amount

    return `${intergalacticNumber.join(' ')} ${resource} is ${cost} Credits`
}

export function handleInput(input: string): string | unknown {
    try {
        if(setRomanRegex.test(input)) {
            return handleTranslateNumber(input)
        } else if(getSetCreditsRegex().test(input)){
            return handleSetResourceValue(input)
        } else if(input.startsWith(howMuchQuestionString)) {
            return handleHowMuchQuestion(input);
        } else if (input.startsWith(howManyQuestionString)) {
            return handleHowManyQuestion(input)
        }
    } catch (e) {
        return errorMessage
    }

    return errorMessage
}
