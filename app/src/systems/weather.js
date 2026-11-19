import { hourBoundaries } from './clock.js';

export const WEATHER_TYPES = ['sunny', 'cloudy', 'rainy'];
export const INITIAL_WEATHER = 'cloudy';

export const TRANSITIONS = {
	sunny: { sunny: 0.7, cloudy: 0.3},
	cloudy: { sunny: 0.2, cloudy: 0.5, rainy: 0.3},
	rainy: { cloudy: 0.6, rainy: 0.4}
}

export const WEATHER_INFO = {
	sunny: { label: 'Sunny', icon: 'fa-solid fa-sun'},
	cloudy: { label: 'Cloudy', icon: 'fa-solid fa-cloud'},
	rainy: { label: 'Rainy', icon: 'fa-solid fa-cloud-rain'}
}

const pickWeighted = (weight, rng) => {
	const entries = Object.entries(weight);
	const total = entries.reduce((sum, [, w]) => sum + w, 0);
	let roll = rng() * total;

	for (const [type, weight] of entries)
	{
		roll -= weight;
		if (roll < 0)
			return (type);
	}
	return (entries[entries.length - 1][0]);
}

export const nextWeather = (current, rng = Math.random) => {
	return (pickWeighted(TRANSITIONS[current] ?? TRANSITIONS[INITIAL_WEATHER], rng));
}

export const advanceWeather = (weather, fromTotal, toTotal, rng = Math.random) => {
	let result = weather;
	for (let i = 0; i < hourBoundaries(fromTotal, toTotal).length; i++)
		result = nextWeather(result, rng);
	return (result);
}