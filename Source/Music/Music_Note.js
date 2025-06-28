
class Music_Note
{
	constructor(pitches, volume, durationInQuarterNotes)
	{
		this.pitches = pitches;
		this.volume = volume;
		this.durationInQuarterNotes = durationInQuarterNotes;
	}

	static parseFromString(volume, octave, noteAsString)
	{
		var noteLetterAsString = noteAsString.substring(0, 2);
		var durationAsDenominatorAsString = noteAsString.substring(2);
		var durationAsDenominator =
			parseInt(durationAsDenominatorAsString);

		var durationInQuarterNotes =
			4 /
			durationAsDenominator;

		var noteLetter = Music_NoteLetter.parseFromString
		(
			noteLetterAsString
		);

		var pitch = new Music_Pitch
		(
			octave,
			noteLetter
		);

		var returnValue = new Music_Note
		(
			[ pitch ],
			volume,
			durationInQuarterNotes
		);

		if (returnValue.valid() == false)
		{
			var errorMessage =
				"Error attempting to parse note from string: '"
				+ noteAsString + "'.";
			throw new Error(errorMessage);
		}

		return returnValue;
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
