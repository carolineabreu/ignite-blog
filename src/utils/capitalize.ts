export function capitalizeTime(string: string): string {
  const firstTwoLetters = string.slice(0, 2); // day ex: 27
  const capitalize = string[3].toLocaleUpperCase(); // first letter month ex:s
  const restOfString = string.slice(4); // rest ex: et 2023

  return `${firstTwoLetters} ${capitalize}${restOfString}`; // 27 Set 2023
}
