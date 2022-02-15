export default function generateRandomString(length) {
	let randomString = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return randomString;
}