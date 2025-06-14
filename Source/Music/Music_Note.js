
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

		var returnValue = new Music_Note
		(
			[
				pitch
			],
			volume,
			parseFloat(durationAsString)
		);

		return returnValue;
	}
}
