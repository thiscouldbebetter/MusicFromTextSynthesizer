
class Music_Movement
{
	constructor(name, timeSignature, tempo, parts)
	{
		this.name = name;
		this.timeSignature = timeSignature;
		this.tempo = tempo;
		this.parts = parts;

		this.ticksPerSecond = 8; // hack
	}

	static fromString(stringToParse)
	{
		var newline = "\n";
		var blankLine = newline + newline;
		var multipartPassagesAsStrings =
			stringToParse.split(blankLine);

		var passagesCount = multipartPassagesAsStrings.length;

		var partGroupsForPassagesAsStringArrays =
			multipartPassagesAsStrings.map(x => x.split(newline) );

		var partsForPassage0AsStrings =
			partGroupsForPassagesAsStringArrays[0];

		var partsCount = partsForPassage0AsStrings.length;

		var partsAsStrings = partsForPassage0AsStrings;

		for (var i = 1; i < passagesCount; i++)
		{
			var partsForPassageAsStrings =
				partGroupsForPassagesAsStringArrays[i];

			for (var j = 0; j < partsForPassageAsStrings.length; j++)
			{
				var partForPassageAsString =
					partsForPassageAsStrings[j];

				partsAsStrings[j] += partForPassageAsString;
			}
		}

		// hack - These should be configurable.
		var movementName = "[movement from string]";
		var timeSignature = Music_TimeSignature.Instances().FourFour;
		var tempo = Music_Tempo.Instances().Default;

		var returnMovement = new Music_Movement
		(
			movementName,
			timeSignature,
			tempo,
			[] // parts
		);

		var partsParsed = partsAsStrings.map
		(
			x => Music_Part.fromString(x)
		);

		returnMovement.parts.push(...partsParsed);


		return returnMovement;
	}

	ticksPerQuarterNote()
	{
		var beatsPerQuarterNote =
			this.timeSignature.beatsPerQuarterNote();
		var secondsPerBeat =
			this.tempo.secondsPerBeat();
		var ticksPerBeat = this.ticksPerSecond * secondsPerBeat;
		var ticksPerQuarterNote =
			ticksPerBeat * beatsPerQuarterNote;
		return ticksPerQuarterNote;
	}
}
