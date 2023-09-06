const errorMessage = 'I have no idea what you are talking about'
const regexSetCredits = new RegExp(/\b\w+(?:\s+\w+)*\s+is\s+(\d+\s+Credits)\b/)
const regexSetRoman = new RegExp(/^\w+\sis\s[IVXLCDM]$/)
const translationMap = new Map<string, string>();
const romanArabicMap = new Map<string, number>([['I',1], ['V',5], ['X', 10],['L', 50],['C', 100],['D', 500],['M', 1000]])

function checkIfQuestion(input: string): boolean {
    return (input.startsWith('how much') || input.startsWith('how many')) && input.endsWith('?')
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
        return;
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
