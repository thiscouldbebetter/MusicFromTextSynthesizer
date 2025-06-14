
class Music_Voice
{
	constructor(name, sample)
	{
		this.name = name;
		this.sample = sample;
	}

	static Instances()
	{
		if (this._instances == null)
		{
			this._instances = new Music_Voice_Instances();
		}
		return this._instances;
	}
}

class Music_Voice_Instances
{
	constructor()
	{
		this.Sine = new Music_Voice
		(
			"Sine",
			// sampleAtSecondsAndFrequency
			(timeOffsetInSeconds, frequencyInCyclesPerSecond) =>
			{
				var timeOffsetInCycles =
					timeOffsetInSeconds * frequencyInCyclesPerSecond;
				var fractionOfCycleCurrent =
					timeOffsetInCycles - Math.floor(timeOffsetInCycles);
				var returnValue =
					Math.sin(fractionOfCycleCurrent * Math.PI * 2.0); 

				return returnValue;
			}
		);
	}

	static Instances()
	{
		if (this._instances == null)
		{
			this._instances = new Music_Voice_Instances();
		}
		return this._instances;
	}
}
