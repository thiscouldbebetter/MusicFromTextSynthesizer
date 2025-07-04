
class Music_Note
{
	constructor(pitches, volume, durationInQuarterNotes)
	{
		this.pitches = pitches;
		this.volume = volume;
		this.durationInQuarterNotes = durationInQuarterNotes;
	}

	static fromPitchVolumeAndDurationInQuarterNotes
	(
		pitch, volume, durationInQuarterNotes
	)
	{
		return new Music_Note
		(
			[ pitch ], volume, durationInQuarterNotes
		);
	}

	static fromPitchesVolumeAndDurationInQuarterNotes
	(
		pitches, volume, durationInQuarterNotes
	)
	{
		return new Music_Note
		(
			pitches, volume, durationInQuarterNotes
		);
	}

	durationInSecondsForMovement(movement)
	{
		var durationInTicks =
			this.durationInTicksForMovement(movement);
		var ticksPerSecond = movement.ticksPerSecond;
		var durationInSeconds =
			durationInTicks / ticksPerSecond;
		return durationInSeconds;
	}

	durationInTicksForMovement(movement)
	{
		var ticksPerQuarterNote =
			movement.ticksPerQuarterNote();
		var durationInTicks =
			this.durationInQuarterNotes * ticksPerQuarterNote;
		return durationInTicks;
	}

	valid()
	{
		var isValid =
			this.pitches != null
			&& this.pitches.some(x => x.valid() == false) == false
			&& this.volume != null
			&& this.durationInQuarterNotes != null;

		return isValid;
	}
}
