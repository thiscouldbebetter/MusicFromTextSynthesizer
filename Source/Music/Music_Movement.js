
class Music_Movement
{
	constructor(name, timeSignature, tempo, parts)
	{
		this.name = name;
		this.timeSignature = timeSignature;
		this.tempo = tempo;
		this.parts = parts;
	}

	static parseFromStrings(partsAsStrings)
	{
		var numberOfParts = partsAsStrings.length;
		var parts = [];
		for (var p = 0; p < numberOfParts; p++)
		{
			var partAsString = partsAsStrings[p].trim();
			if (partAsString.length > 0)
			{
				var part = Music_Part.parseFromString(partAsString);
				parts.push(part);
			}
		}

		var returnMovement = new Music_Movement
		(
			"[movement from string]",
			Music_TimeSignature.Instances().FourFour,
			Music_Tempo.Instances().Default,
			parts
		);

		return returnMovement;
	}
}
