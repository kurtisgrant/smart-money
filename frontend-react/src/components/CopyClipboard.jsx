import React, { useState } from 'react';
import Button from '../components/Button';

function CopyClipboard({ accessLink }) {
	const [isCopied, setIsCopied] = useState(false);

	// TODO: Implement copy to clipboard functionality

	return (
		<div className="simulation-control-panel-container">
			<div className="access-link-container">
				<input className="access-link" type="text" value={accessLink} />
				<Button className="access-link-copy" white>
					Copy
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
