import { handleInput} from "./code-challange";

describe("Math functions", () => {
    it("should multiply 5 by 3", () => {
        handleInput('glob is I');
        handleInput('prok is V');
        handleInput('pish is X');
        handleInput('tegj is L');
        handleInput('glob glob Silver is 34 Credits');
        handleInput('glob prok Gold is 57800 Credits');
        handleInput('pish pish Iron is 3910 Credits');

        expect(handleInput('how much is pish tegj glob glob ?')).toEqual('pish tegj glob glob is 42');
        expect(handleInput('how many Credits is glob prok Silver ?')).toEqual('glob prok Silver is 68 Credits');
        expect(handleInput('how many Credits is glob prok Gold ?')).toEqual('glob prok Gold is 57800 Credits');
        expect(handleInput('how many Credits is glob prok Iron ?')).toEqual('glob prok Iron is 782 Credits');
        expect(handleInput('how much wood could a woodchuck chuck if a woodchuck could chuck wood ?')).toEqual('I have no idea what you are talking about');
    });
});
