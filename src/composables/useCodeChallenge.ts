import {computed} from "vue";

export default () => {
    const translationMap = new Map<string, string>();
    const romanArabicMap = new Map<string, number>([['I',1], ['V',5], ['X', 10],['L', 50],['C', 100],['D', 500],['M', 1000]])
    const resourceCostMap = new Map<string, number>()
    const errorMessage = 'I have no idea what you are talking about'
    const setRomanRegex = new RegExp(/^\w+\sis\s[IVXLCDM]$/)
    const romanNumberRegex = /^(M{0,3})(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
    const howMuchQuestionString = 'how much is '
    const howManyQuestionString = 'how many Credits is '

    // This regex should be dynamic. It requires already set translations.
    const setCreditsRegex = computed<RegExp>(() => {
        return new RegExp(`(${Array.from(translationMap.keys()).join('|')})\\s\\w+\\sis\\s\\d+\\sCredits`);
    })

    function getRomanNumberInArabicNumber(romanNumber: string): number {
        if(!romanNumberRegex.test(romanNumber)) {
            throw new Error('Invalid Roman Number')
        }

        const romanNumberArray = romanNumber.split('')
        let arabicNumber = 0
        let skipNextNumber = false
        for (let i=0; i < romanNumber.length; i++)  {
            // The calculation with this number already done, so we can skip here.
            if(skipNextNumber) {
                skipNextNumber = false
                continue
            }

            const arabicNumberFromMap = romanArabicMap.get(romanNumberArray[i])

            if(!arabicNumberFromMap) {
                throw new Error('Arabic number not found')
            }

            const nextNumber = i < romanNumber.length-1 ? romanArabicMap.get(romanNumberArray[i+1]) : undefined

            // If there is next number, and it is bigger than this one we divide.
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

    function handleTranslateNumber(input: string): void {
        const intergalacticNumber = input.split(' ')[0]
        const romanNumber = input.split(' ')[2]

        if(!romanArabicMap.has(romanNumber)) {
            throw new Error('Roman number not found')
        }

        translationMap.set(intergalacticNumber, romanNumber)
        return
    }

    function handleSetResourceValue(input: string): void {
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

    function handleHowMuchQuestion(input: string): string {
        const intergalacticNumber = input.replace(howMuchQuestionString, '').replace('?', '')

        const arabicNumber = getIntergalacticNumberInArabicNumber(intergalacticNumber.trim().split(' '))

        return `${intergalacticNumber}is ${arabicNumber}`
    }
    function handleHowManyQuestion(input: string): string {
        const numberAndResources = input.replace(howManyQuestionString, '').split(' ')

        const intergalacticNumber:Array<string> = []
        let resource = ''

        for (let i=0; i< numberAndResources.length; i++) {
            if(translationMap.has(numberAndResources[i])) {
                intergalacticNumber.push(numberAndResources[i])
                continue
            }

            // We skip every other word after resource due to invalid input
            if(resourceCostMap.has(numberAndResources[i])) {
                resource = numberAndResources[i]
                break
            }
        }

        if(intergalacticNumber.length === 0) {
            throw new Error('Invalid input. Intergalactic number and resource not found.')
        }

        const amount = getIntergalacticNumberInArabicNumber(intergalacticNumber)
        const costPerResource = resourceCostMap.get(resource)

        if (!costPerResource) {
            throw new Error('Resource not found.')
        }

        const cost = costPerResource * amount

        return `${intergalacticNumber.join(' ')} ${resource} is ${cost} Credits`
    }

    function handleInput(input: string): string | unknown {
        try {
            if(setRomanRegex.test(input)) {
                return handleTranslateNumber(input)
            } else if(setCreditsRegex.value.test(input)){
                return handleSetResourceValue(input)
            } else if(input.startsWith(howMuchQuestionString)) {
                return handleHowMuchQuestion(input);
            } else if (input.startsWith(howManyQuestionString)) {
                return handleHowManyQuestion(input)
            } else {
                console.log('Invalid input.')
                return errorMessage
            }
        } catch (e) {
            console.log(e)
            return errorMessage
        }
    }

    return { handleInput }
}
