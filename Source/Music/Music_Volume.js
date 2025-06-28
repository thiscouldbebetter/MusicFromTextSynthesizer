
class Music_Volume
{
	constructor(name, code, relativeLoudness)
	{
		this.name = name;
		this.code = code;
		this.relativeLoudness = relativeLoudness;
	}

	static Instances()
	{
		if (this._instances == null)
		{
			this._instances = new Music_Volume_Instances();
		}
		return this._instances;
	}

	static byCode(code)
	{
		return this.Instances().byCode(code);
	}
}

class Music_Volume_Instances
{
	constructor()
	{
		this.Silent = 		new Music_Volume("Silent", 0, 0);
		this.Quietest = 	new Music_Volume("Quietest", 1, .001);
		this.Medium = 		new Music_Volume("Medium", 5, .01);
		this.Loudest = 		new Music_Volume("Loudest", 9, .1);

		this.Default = this.Medium;

		this._All =
		[
			this.Silent,
			this.Quietest,
			this.Medium,
			this.Loudest
		];

		this._AllByCode = new Map(this._All.map(x => [x.code, x] ) );
	}

	byCode(code)
	{
		return this._AllByCode.get(code);
	}
}
