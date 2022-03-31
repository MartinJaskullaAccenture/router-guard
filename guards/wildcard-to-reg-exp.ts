// https://gist.github.com/donmccurdy/6d073ce2c6f3951312dfa45da14a420f

/**
 * Creates a RegExp from the given string, converting asterisks to .* expressions,
 * and escaping all other characters.
 */
export function wildcardToRegExp (s: string): RegExp {
    return new RegExp('^' + s.split(/\*+/).map(regExpEscape).join('.*') + '$');
}

/**
 * RegExp-escapes all characters in the given string.
 */
function regExpEscape (s: string): string {
    return s.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}
