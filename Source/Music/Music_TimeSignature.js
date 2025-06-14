
class Music_TimeSignature
{
	constructor(beatsPerMeasure, durationForBeat)
	{
		this.beatsPerMeasure = beatsPerMeasure;
		this.durationForBeat = durationForBeat;
	}

	static Instances()
	{
		if (this._instances == null)
		{
			this._instances = new Music_TimeSignature_Instances();
		}
		return this._instances;
	}

}

class Music_TimeSignature_Instances
{
	constructor()
	{
		this.FourFour = new Music_TimeSignature(4, 4);
	}
}
