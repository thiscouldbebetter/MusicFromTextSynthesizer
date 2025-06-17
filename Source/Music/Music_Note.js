
class Music_Note
{
	constructor(pitches, volume, duration)
	{
		this.pitches = pitches;
		this.volume = volume;
		this.duration = duration;
	}

	static parseFromString(volume, octave, noteAsString)
	{
		var noteLetterAsString = noteAsString.substring(0, 2);
		var durationAsString = noteAsString.substring(2);

		var noteLetter = Music_NoteLetter.parseFromString
		(
			noteLetterAsString
		);

		var pitch = new Music_Pitch
		(
			octave,
			noteLetter
		);

		var duration = parseFloat(durationAsString);

		var returnValue = new Music_Note
		(
			[ pitch ],
			volume,
			duration
		);

		if (returnValue.valid() == false)
		{
			throw new Error("Error attempting to parse note from string: '" + noteAsString + "'.");
		}

		return returnValue;
	}

	valid()
	{
		var isValid =
			this.pitches != null
			&& this.pitches.some(x => x.valid() == false) == false
			&& this.volume != null
			&& this.duration != null;

		return isValid;
	}
}
