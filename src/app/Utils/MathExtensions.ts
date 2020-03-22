export class MathExtensions {
    static round(number: number, precision: number) : number {
        return Math.round(number * 100) / 100;
    }
}