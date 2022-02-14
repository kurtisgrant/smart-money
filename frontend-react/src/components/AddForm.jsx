import Button from "./Button";

function AddForm({
	onSubmit,
	inputOneValue,
	inputOnePlaceholder,
  setInputOne,
	inputTwoValue,
	inputTwoPlaceholder,
  setInputTwo
}) {
	return (
		<form className="add-form" onSubmit={onSubmit}>
			<input
				type="text"
				placeholder={inputOnePlaceholder}
				value={inputOneValue}
				onChange={(e) => setInputOne(e.target.value)}
			/>
			<input
				type="text"
				placeholder={inputTwoPlaceholder}
				value={inputTwoValue}
				onChange={(e) => setInputTwo(e.target.value)}
			/>
			<Button green type="submit">
				Submit
			</Button>
		</form>
	);
}

export default AddForm;
