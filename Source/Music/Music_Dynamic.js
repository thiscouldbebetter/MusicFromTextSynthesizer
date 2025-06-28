
class Music_Dynamic
{
	constructor(code, value, applyToPart)
	{
		this.code = code;
		this.value = value;
		this._applyToPart = applyToPart; // todo - Split into definition class.
	}

	static Instances()
	{
		if (this._instances == null)
		{
			this._instances = new Music_Dynamic_Instances();
		}
		return this._instances;
	}

	static byCode(code)
	{
		return this.Instances().byCode(code);
	}

	applyToPart(part)
	{
		this._applyToPart(part);
	}

	clone()
	{
		return new Music_Dynamic(this.code, this.value, this._applyToPart);
	}

	valueSet(valueToSet)
	{
		this.value = valueToSet;
		return this;
	}
}

class Music_Dynamic_Instances
{
	constructor()
	{
		this.Octave = new Music_Dynamic("O", null, this.applyToPart_Octave);
		this.Volume = new Music_Dynamic("V", null, this.applyToPart_Volume);

		this._All = [ this.Octave, this.Volume ];
		this._AllByCode = new Map(this._All.map(x => [x.code, x] ) );
	}

	byCode(code)
	{
		return this._AllByCode.get(code);
	}

	applyToPart_Octave(part)
	{
		var octaveIndex = part.octaveCurrent.octaveIndex;

		octaveIndex =
			this.value == "+"
			? octaveIndex + 1
			: this.value == "-"
			? octaveIndex - 1
			: isNaN(this.value)
			? null
			: parseInt(this.value);

		if (octaveIndex == null)
		{
			throw new Error("Octave index is not a number.")
		}

		var octave = Music_Octave.byIndex(octaveIndex);
		part.octaveCurrent = octave;
	}

	applyToPart_Volume(part)
	{
		var volumeCode = part.volumeCurrent.volumeCode;

		volumeCode =
			this.value == "+"
			? volumeCode + 1
			: this.value == "-"
			? volumeCode - 1
			: isNaN(this.value)
			? null
			: parseInt(this.value);

		if (volumeCode == null)
		{
			throw new Error("Volume Code is not a number.")
		}

		var volume = Music_Volume.byCode(volumeCode);
		part.volumeCurrent = volume;
	}

}