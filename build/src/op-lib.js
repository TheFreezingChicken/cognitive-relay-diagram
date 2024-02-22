"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oppositeGrantOrder = void 0;
/**
 * Returns the opposite grant order.
 * @throws {TypeError} If {@link grantOrder} is not a number.
 * @throws {Error} If {@link grantOrder} is not an integer or is out of range.
 */
function oppositeGrantOrder(grantOrder) {
    if (!Number.isInteger(grantOrder))
        throw new Error("Not an integer.");
    switch (grantOrder) {
        case 0: return 3;
        case 1: return 2;
        case 2: return 1;
        case 3: return 0;
        default: throw new Error("Out of range.");
    }
}
exports.oppositeGrantOrder = oppositeGrantOrder;
/**
 * Checks if the grant order is valid.
 * @param grantOrder The grant order to check.
 * @throws {TypeError} If grantOrder is not a number.
 * @throws {Error} If grantOrder is not an integer or is out of bounds (0-3).
 */
function checkGrantOrder(grantOrder) {
    if (!Number.isInteger(grantOrder))
        throw new Error("Invalid Grant order index. Not an integer.");
    if (grantOrder < 0 || grantOrder >= 4)
        throw new Error("Invalid Grant order index. Out of bounds (0-3).");
}
