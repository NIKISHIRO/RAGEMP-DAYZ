export class Char{
    static random(Maximum, Minimal){
        let random = (Math.random() * Maximum) + Minimal;
        return random
    }
}