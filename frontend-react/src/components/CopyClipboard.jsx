import React, { useState } from 'react';
import Button from '../components/Button';
import './CopyClipboard.scss'

function CopyClipboard({ accessLink }) {
	const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    const copy = async (text) => {
      return await navigator.clipboard.writeText(text)
    }

    copy(accessLink)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false)
        }, 2000);
      })
      .catch((err) => {
        console.log(err.messag);
      });
  };

  const buttonColor = isCopied ? 'green' : 'white';

	return (
		<div className="access-link-container-parent">
			<div className="access-link-container">
				<input className="access-link" type="text" value={accessLink} readOnly />
				{/* <Button className="access-link-copy" {...(isCopied ? "green" : "white")} onClick={copyToClipboard}> */}
				<Button className="access-link-copy" green={isCopied} white={!isCopied} onClick={copyToClipboard}>
					{ isCopied ? "Copied!" : "Copy" }
				</Button>
			</div>
		</div>

		// <div>
		//   <input type="text" value={copyText} readOnly />
		//   <button>
		//     <span>{isCopied ? 'Copied!' : 'Copy'}</span>
		//   </button>
		// </div>
	);
}

export default CopyClipboard;
