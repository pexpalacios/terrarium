export const MINUTES_PER_HOUR = 60;
export const MINUTES_PER_DAY = 24 * MINUTES_PER_HOUR;

export const DEFAULT_PERIODS = {
	dawn: 6,
	noon: 12,
	sunset: 18,
	night: 0
}

// clock basically starts a counter at the start of the game and calculates day hour and minute with that counter.
export const createClock = ({ day = 1, hour = 11, minute = 0} = {}) => ({
	total: (day - 1) * MINUTES_PER_DAY + hour * MINUTES_PER_HOUR + minute
})

export const advanceClock = (clock, minutes = 0) => {
	const amount = Number(minutes);
	if (!Number.isFinite(amount) || amount <= 0)
		return (clock);
	return ({total: clock.total + Math.round(amount)})
}

export const getDay = (clock) => Math.floor(clock.total / MINUTES_PER_DAY) + 1;
export const getMinuteOfDay = (clock) => clock.total % MINUTES_PER_DAY;
export const getHour = (clock) => Math.floor(getMinuteOfDay(clock) / MINUTES_PER_HOUR);
export const getMinute = (clock) => clock.total % MINUTES_PER_HOUR;

// Los ifs estos son un mierodn y las variable h y p tambien
export const getPeriod = (clock) => {
	const period = DEFAULT_PERIODS;
	const hour = getMinuteOfDay(clock) / MINUTES_PER_HOUR;

	if (hour >= period.night || hour < period.dawn)
		return 'night';
	if (hour >= period.sunset)
		return 'sunset';
	if (hour >= period.noon)
		return 'noon';
	return 'dawn';
}

// esto se puede cambiar a que tambien tenga opcion de 12 horas, pero que les jodan a los que no saben leer 24
export const formatTime = (clock) => {
	const hour = getHour(clock);
	const min = String(getMinute(clock)).padStart(2, '0');

	return (`${String(hour).padStart(2, '0')}:${min}`);
}

// so if something lasts for 90 min it can say 1h 30min, idk if I''l acually use it tho
export const formatDuration = (minutes) => {
	const hour = Math.floor(minutes / MINUTES_PER_HOUR);
	const min = minutes % MINUTES_PER_HOUR;
	if (hour === 0)
		return (`${min} min`);
	if (min === 0)
		return (`${hour} h`);
	return (`${hour} h ${min} min`);
}

export const hourBoundaries = (from, to) => {
	const boundaries = []
	for (let hour = Math.floor(from / MINUTES_PER_HOUR) + 1; hour * MINUTES_PER_HOUR <= to; hour++)
		boundaries.push(hour * MINUTES_PER_HOUR);
	return (boundaries);
}