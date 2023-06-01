function escapeStringRegexp(candidateString: string): string {
	if (typeof candidateString !== 'string') {
		throw new TypeError('Expected a string');
	}

	return candidateString
		.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
		.replace(/-/g, '\\x2d');
}

function isEmailValid(email: any) {
	const testerRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
	if (!email) return false;

	const emailParts = email.split('@');

	if (emailParts.length !== 2) return false;

	const account = emailParts[0];
	const address = emailParts[1];

	if (account.length > 64) return false;

	else if (address.length > 255) return false;

	const domainParts = address.split('.');
	
	return (!domainParts.some((part: string) => part.length > 63 )) 
		? testerRegex.test(email) : false;
}

export {
    escapeStringRegexp,
	isEmailValid
}