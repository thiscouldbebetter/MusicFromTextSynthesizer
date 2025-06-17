
class Music_Movement
{
	constructor(name, timeSignature, tempo, parts)
	{
		this.name = name;
		this.timeSignature = timeSignature;
		this.tempo = tempo;
		this.parts = parts;
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

		var parts = partsAsStrings.map(x => Music_Part.fromString(x) );

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
