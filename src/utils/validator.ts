import { ValidateInter } from '../vendor/interfaces.js'

export default class Validate {

    must: string;

    constructor(ops : ValidateInter) {
        this.must = ops.must
    }

    condition(string : string) {

        if(this.must == 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            return emailRegex.test(string)
        }
        
    }

}