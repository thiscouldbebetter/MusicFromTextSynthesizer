
class Music_Pitch
{
	constructor(octave, noteLetter)
	{
		this.octave = octave;
		this.noteLetter = noteLetter;
	}

	frequencyInCyclesPerSecond()
	{
		var returnValue = 
			this.octave.frequencyOfNoteLetterC 
			* this.noteLetter.frequencyMultiplier;

		return returnValue;
	}
}
