import { IResult } from "../Core/Interface724"

export class MockResult {
    public static Results: IResult[] = [
        // Lose result
        {
            Symbols: [
                [0, 2, 1, 3],
                [1, 2, 0, 3],
                [3, 1, 2, 0],
                [2, 0, 1, 3],
                [0, 3, 2, 1],
            ],
            Paylines: []
        },

        // Win result
        {
            Symbols: [
                [3, 1, 2, 1],
                [3, 1, 0, 2],
                [3, 2, 0, 1],
                [3, 0, 1, 2],
                [3, 1, 0, 2],
            ],
            Paylines: [
                [0, 0, 0, 0, 0]
            ]
        },
        {
            Symbols: [
                [1, 2, 1, 3],
                [1, 0, 3, 2],
                [1, 2, 0, 3],
                [1, 0, 3, 2],
                [1, 2, 0, 3],
            ],
            Paylines: [
                [0, 0, 0, 0, 0],
                [3, 2, 3, 2, 3],
            ]
        },
    ];
}