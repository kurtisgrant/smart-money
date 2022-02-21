
const fancyLog = (emoji, message, indentation = 0, prefixNewLine) => {
  const indentStr = new Array(indentation).join('     ');
  const prefix = prefixNewLine ? '\n' : '';
  let msg = message;
  if (typeof message !== 'string') {
    msg = message.join(' ');
  }
  console.log(prefix + indentStr + emoji + '  ' + msg);
};
const log = (variable) => {
  const name = Object.keys({ variable })[0];
  console.log('\n\n🟣', name, variable, '\n');
};


module.exports = { fancyLog, log };