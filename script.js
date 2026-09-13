const travelForm = document.getElementById('travelForm');
const cityInput = document.getElementById('city');
const travelResults = document.getElementById('travelResults');
const estimateMessage = document.getElementById('estimateMessage');
const studioOption = document.querySelector('input[value="studio"]');
const travelDetails = document.getElementById('travelDetails');
const peopleSelect = document.getElementById('people');
const exactPeople = document.getElementById('exactPeople');
const bobigny = ileDeFranceCommunes.find((commune) => commune.code === '93008');

function normalizeCity(value) {
	return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function distanceInKilometers(firstCoordinates, secondCoordinates) {
	const earthRadius = 6371;
	const [firstLongitude, firstLatitude] = firstCoordinates.map((coordinate) => coordinate * Math.PI / 180);
	const [secondLongitude, secondLatitude] = secondCoordinates.map((coordinate) => coordinate * Math.PI / 180);
	const latitudeDifference = secondLatitude - firstLatitude;
	const longitudeDifference = secondLongitude - firstLongitude;
	const haversine = Math.sin(latitudeDifference / 2) ** 2
		+ Math.cos(firstLatitude) * Math.cos(secondLatitude) * Math.sin(longitudeDifference / 2) ** 2;

	return earthRadius * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function findCity(value) {
	const normalizedValue = normalizeCity(value);
	const postcode = value.match(/\b\d{5}\b/)?.[0];
	const cityName = normalizedValue.replace(/\s+\d{1,2}(?:er|e)?$/, '').trim();

	return ileDeFranceCommunes.find((commune) => postcode && commune.codesPostaux.includes(postcode))
		|| ileDeFranceCommunes.find((commune) => normalizeCity(commune.nom) === cityName);
}

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
		travelResults.classList.remove('is-nearby', 'is-far');
		estimateMessage.textContent = '';
	}
}

updateTravelMode();

travelForm.addEventListener('submit', (event) => {
	event.preventDefault();
	const city = cityInput.value.trim();

	if (studioOption.checked) {
		travelResults.hidden = true;
		estimateMessage.textContent = 'Aucun supplément de déplacement : vous venez chez Mitou.';
		return;
	}

	const selectedCity = findCity(city);
	if (!selectedCity) {
		travelResults.hidden = true;
		estimateMessage.textContent = 'Ville non reconnue. Saisissez une commune d’Île-de-France ou son code postal.';
		return;
	}

	const distance = distanceInKilometers(bobigny.centre.coordinates, selectedCity.centre.coordinates);
	const nearby = distance <= 30;

	travelResults.hidden = false;
	travelResults.classList.toggle('is-nearby', nearby);
	travelResults.classList.toggle('is-far', !nearby);
	estimateMessage.textContent = nearby
		? `Estimation pour ${selectedCity.nom} : ${distance.toFixed(1)} km depuis Bobigny, supplément de déplacement de +60€.`
		: `Estimation pour ${selectedCity.nom} : ${distance.toFixed(1)} km depuis Bobigny, supplément de déplacement de +80€.`;
});

document.querySelectorAll('input[name="travelMode"]').forEach((option) => {
	option.addEventListener('change', () => {
		if (option.checked) updateTravelMode();
	});
});
