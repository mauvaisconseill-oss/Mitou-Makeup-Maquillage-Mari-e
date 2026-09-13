const travelForm = document.getElementById('travelForm');
const cityInput = document.getElementById('city');
const travelResults = document.getElementById('travelResults');
const estimateMessage = document.getElementById('estimateMessage');
const studioOption = document.querySelector('input[value="studio"]');
const travelDetails = document.getElementById('travelDetails');
const peopleSelect = document.getElementById('people');
const exactPeople = document.getElementById('exactPeople');

peopleSelect.addEventListener('change', () => {
	const hasManyPeople = peopleSelect.value === '7';
	exactPeople.hidden = !hasManyPeople;
	exactPeople.required = hasManyPeople;
	if (!hasManyPeople) exactPeople.value = '';
});

function updateTravelMode() {
	const comingToMitou = studioOption.checked;
	travelDetails.hidden = comingToMitou;
	cityInput.required = !comingToMitou;
	if (comingToMitou) {
		travelResults.hidden = true;
		estimateMessage.textContent = 'Aucun supplément de déplacement : vous venez chez Mitou.';
	} else {
		travelResults.hidden = false;
		estimateMessage.textContent = '';
	}
}

updateTravelMode();

travelForm.addEventListener('submit', (event) => {
	event.preventDefault();
	const city = cityInput.value.trim();
	const postcode = city.match(/\b(75|77|78|91|92|93|94|95)\d{3}\b/)?.[0] || '';
	const nearbyCities = /bobigny|paris|vincennes|montreuil|saint[- ]?mandé|charenton|bagnolet|fontenay|créteil|ivry|villes?juif|boulogne|clichy|neuilly/i.test(city);
	const nearby = postcode.startsWith('75') || postcode.startsWith('92') || postcode.startsWith('93') || postcode.startsWith('94') || nearbyCities;

	if (studioOption.checked) {
		travelResults.hidden = true;
		estimateMessage.textContent = 'Aucun supplément de déplacement : vous venez chez Mitou.';
		return;
	}

	travelResults.hidden = false;
	travelResults.classList.toggle('is-nearby', nearby);
	travelResults.classList.toggle('is-far', !nearby);
	estimateMessage.textContent = nearby
		? `Estimation pour ${city} : supplément de déplacement de +60€.`
		: `Estimation pour ${city} : supplément de déplacement de +80€.`;
});

document.querySelectorAll('input[name="travelMode"]').forEach((option) => {
	option.addEventListener('change', () => {
		if (option.checked) updateTravelMode();
	});
});
