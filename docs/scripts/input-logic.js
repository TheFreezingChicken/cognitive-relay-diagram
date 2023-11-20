export function deleteLastCharacter() {
    const input = document.getElementById('animals');
    input.value = input.value.slice(0, -1); // Deletes the last character
}