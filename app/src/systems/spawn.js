import bugsData from '../content/bugs.json'

const bugs = Object.entries(bugsData).map(([id, bug]) => ({ id, ...bug }));

export const getViableBugs = (locationKey, period, weather) =>
	bugs.filter((b) =>
		b.locations.includes(locationKey) && b.time.includes(period) && b.weather.includes(weather)
	);

export const rollSpawns = (location, locationKey, period, weather, caught = []) => {
	const spots = [ ...(location?.spots ?? [])];
	spots.sort(() => Math.random() - 0.5);

	const spawned = [];
	for (const bug of getViableBugs(locationKey, period, weather))
	{
		if (spots.length === 0)
			break;
		if (Math.random() < bug.probability)
			spawned.push({ spotId: spots.pop().id, bug})
	}
	
	return (spawned);
}