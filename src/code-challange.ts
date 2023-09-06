const errorMessage = 'I have no idea what you are talking about'
const regexSetCredits = new RegExp(/\b\w+(?:\s+\w+)*\s+is\s+(\d+\s+Credits)\b/)
const regexSetRoman = new RegExp(/^\w+\sis\s[IVXLCDM]$/)
const translationMap = new Map<string, string>();
const romanArabicMap = new Map<string, number>([['I',1], ['V',5], ['X', 10],['L', 50],['C', 100],['D', 500],['M', 1000]])
const resourceCostMap = new Map<string, number>()

function checkIfQuestion(input: string): boolean {
    return (input.startsWith('how much') || input.startsWith('how many')) && input.endsWith('?')
}

function getRomanNumberInArabicNumber(romanNumber: string): number {
    const romanNumberArray = romanNumber.trim().split('')
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

function getWordInArabicNumber(alienNumber: string): number {
    const alienDigitArray = alienNumber.trim().split(' ')
    let romanNumber = ''
    alienDigitArray.forEach((x) => {
        romanNumber += translationMap.get(x)
    })

    return getRomanNumberInArabicNumber(romanNumber)
}

function handleSettingInformation(input: string) {
    if(regexSetRoman.test(input)) {
        const alienNumber = input.split(' is ')[0]
        const romanNumber = input.split(' is ')[1]

        if(!romanArabicMap.has(romanNumber)) {
            throw errorMessage
        }

        translationMap.set(alienNumber.trim(), romanNumber.trim())
        return
    } else if(regexSetCredits.test(input)) {
        const resourceWithAmount = input.split(' is ')[0]
        const costWithAmount = Number(input.split(' is ')[1].split(' ')[0])

        const resourceWithAmountArray = resourceWithAmount.split(' ')

        let amountInAlienNumber = ''
        resourceWithAmountArray.forEach((x) => {
            const word = x.trim()
            if(translationMap.has(word)) {
                amountInAlienNumber += word+' '
            }
        })

        const resource = resourceWithAmount.replace(amountInAlienNumber.trim(), '')
        const amountInArabicNumber = getWordInArabicNumber(amountInAlienNumber)
        const costPerResource = costWithAmount / amountInArabicNumber
        resourceCostMap.set(resource.trim(), costPerResource)
        return
    }
    throw errorMessage
}

export function handleInput(input: string): string | unknown {
    try {
        if(!checkIfQuestion(input)) {
        } else if(input.startsWith('how much')) {

        } else if (input.startsWith('how many')) {
        }
    } catch (e) {
        return errorMessage
    }

    return errorMessage
}
