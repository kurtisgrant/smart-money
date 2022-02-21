
const fancyLog = (emoji, message, indentation = 0, prefixNewLine) => {
  const indentStr = new Array(indentation).join('     ');
  const prefix = prefixNewLine ? '\n' : '';
  let msg = message;
  if (typeof message !== 'string') {
    msg = message.join(' ');
  }
  console.log(prefix + indentStr + emoji + '  ' + msg);
};
const log = (variableWrappedInCurlyBraces) => {
  const name = Object.keys(variableWrappedInCurlyBraces)[0];
  const value = variableWrappedInCurlyBraces[name];
  console.log('\n\n🟣', name, value, '\n');
};


module.exports = { fancyLog, log };