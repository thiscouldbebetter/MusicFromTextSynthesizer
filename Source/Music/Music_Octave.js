
class Music_Octave
{
	constructor(octaveIndex, frequencyOfNoteLetterC)
	{
		this.octaveIndex = octaveIndex;
		this.frequencyOfNoteLetterC = frequencyOfNoteLetterC;
	}

	static Instances()
	{
		if (this._instances == null)
		{
			this._instances = new Music_Octave_Instances();
		}
		return this._instances;
	}
}

class Music_Octave_Instances
{
	constructor()
	{
		this.Octave0 = new Music_Octave(0, 55);
		this.Octave1 = new Music_Octave(1, 110);
		this.Octave2 = new Music_Octave(2, 220);
		this.Octave3 = new Music_Octave(3, 440);
		this.Octave4 = new Music_Octave(4, 880);

		this._All = 
		[
			this.Octave0,
			this.Octave1,
			this.Octave2,
			this.Octave3,
			this.Octave4,
		];
	}

	byIndex(index)
	{
		return this._All[index];
	}
}
