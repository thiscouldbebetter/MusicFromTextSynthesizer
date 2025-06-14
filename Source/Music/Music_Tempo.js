
class Music_Tempo
{
	constructor(name, beatsPerMinute)
	{
		this.name = name;
		this.beatsPerMinute = beatsPerMinute;
	}

	static Instances()
	{
		if (this._instances == null)
		{
			this._instances = new Music_Tempo_Instances();
		}
		return this._instances;
	}
}

class Music_Tempo_Instances
{
	constructor()
	{
		this.Default = new Music_Tempo("Default", 80);

		this.Andante = new Music_Tempo("Andante", 60);
	}
}
