function escapeStringRegexp(candidateString: string): string {
	if (typeof candidateString !== 'string') {
		throw new TypeError('Expected a string');
	}

	return candidateString
		.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
		.replace(/-/g, '\\x2d');
}

export {
    escapeStringRegexp
}