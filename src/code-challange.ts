const errorMessage = 'I have no idea what you are talking about'

function checkIfQuestion(input: string): boolean {
    return (input.startsWith('how much') || input.startsWith('how many')) && input.endsWith('?')
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
