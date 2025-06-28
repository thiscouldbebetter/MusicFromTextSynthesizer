
class Music_Volume
{
	constructor(name, relativeLoudness)
	{
		this.name = name;
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

	static byIndex(index)
	{
		return this.Instances().byIndex(index);
	}
}

class Music_Volume_Instances
{
	constructor()
	{
		this.Quiet = new Music_Volume("Quiet", .001);
		this.Medium = new Music_Volume("Medium", .01);
		this.Loud = new Music_Volume("Loud", .1);

		this._All =
		[
			this.Quiet,
			this.Medium,
			this.Loud,
		];
	}

	byIndex(index)
	{
		return this._All[index];
	}
}
