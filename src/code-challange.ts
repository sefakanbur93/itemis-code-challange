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

function handleSettingInformation(input: string) {
    if(regexSetRoman.test(input)) {
        const intergalacticNumber = input.split(' ')[0]
        const romanNumber = input.split(' ')[2]

        if(!romanArabicMap.has(romanNumber)) {
            throw errorMessage
        }

        translationMap.set(intergalacticNumber, romanNumber)
        return
    } else if(regexSetCredits.test(input)) {
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
        return
    }
    throw errorMessage
}

export function handleInput(input: string): string | unknown {
    try {
        if(!checkIfQuestion(input)) {
            handleSettingInformation(input)
        } else if(input.startsWith('how much')) {
            const intergalacticNumber = input.split(' is ')[1].replace('?', '')

            const arabicNumber = getIntergalacticNumberInArabicNumber(intergalacticNumber.trim().split(' '))

            return `${intergalacticNumber}is ${arabicNumber}`
        } else if (input.startsWith('how many')) {
            const numberAndResources = input.split(' is ')[1].replace('?', '').trim().split(' ')

            let intergalacticNumber = ''
            let resource = ''

            numberAndResources.forEach((numberAndResource) => {
                if(translationMap.has(numberAndResource)) {
                    intergalacticNumber += numberAndResource + ' '
                    return
                }

                resource = numberAndResource
                return
            })

            if(intergalacticNumber === '') {
                return errorMessage
            }

            const amount = getIntergalacticNumberInArabicNumber(intergalacticNumber.trim().split(' '))
            const costPerResource = resourceCostMap.get(resource)

            if(!costPerResource) {
                return errorMessage
            }

            const cost = costPerResource * amount

            return `${intergalacticNumber}${resource} is ${cost} Credits`
        }
    } catch (e) {
        return errorMessage
    }

    return errorMessage
}
