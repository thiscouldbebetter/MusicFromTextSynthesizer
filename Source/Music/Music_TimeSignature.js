
class Music_TimeSignature
{
	constructor(beatsPerMeasure, beatsPerWholeNote)
	{
		this.beatsPerMeasure = beatsPerMeasure;
		this.beatsPerWholeNote = beatsPerWholeNote;
	}

	static Instances()
	{
		if (this._instances == null)
		{
			this._instances = new Music_TimeSignature_Instances();
		}
		return this._instances;
	}

	beatsPerQuarterNote()
	{
		var quarterNotesPerWholeNote = 4;
		return this.beatsPerWholeNote / quarterNotesPerWholeNote;
	}
}

class Music_TimeSignature_Instances
{
	constructor()
	{
		this.FourFour = new Music_TimeSignature(4, 4);
	}
}
