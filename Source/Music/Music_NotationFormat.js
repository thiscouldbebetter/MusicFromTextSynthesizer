
class Music_NotationFormat
{
	constructor(name, songParseFromNameAndString)
	{
		this.name = name;
		this._songParseFromNameAndString =
			songParseFromNameAndString;
	}

	static Instances()
	{
		if (this._instances == null)
		{
			this._instances = new Music_NotationFormat_Instances();
		}
		return this._instances;
	}

	static byName(name)
	{
		return this.Instances().byName(name);
	}

	songParseFromNameAndString(name, stringToParse)
	{
		return this._songParseFromNameAndString.call
		(
			Music_NotationFormat.Instances(), // this
			name,
			stringToParse
		);
	}
}

class Music_NotationFormat_Instances
{
	constructor()
	{
		this.A = new Music_NotationFormat("A", this.songParse_A);

		this._All =
		[
			this.A
		];

		this._AllByName = new Map(this._All.map(x => [x.name, x] ) );
	}

	byName(name)
	{
		return this._AllByName.get(name);
	}

	// Parsers.

	songParse_A(name, stringToParse)
	{
		var newline = "\n";
		var commentMarker = "//";

		stringToParse =
			stringToParse
				.split(newline)
				.filter(x => x.startsWith(commentMarker) == false)
				.map(x => x.trim() )
				.join(newline);

		while (stringToParse.startsWith(newline) )
		{
			stringToParse = stringToParse.substring(1);
		}
		while (stringToParse.endsWith(newline) )
		{
			stringToParse = stringToParse.substring(0, stringToParse.length - 1);
		}

		var twoBlankLines = newline + newline + newline;
		var movementsAsStrings = stringToParse.split(twoBlankLines);
		var movements = movementsAsStrings.map
		(
			x => this.songParse_A_Movement(x)
		);
		var song = new Music_Song(name, movements);
		return song;
	}

	songParse_A_Movement(stringToParse)
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
			x => this.songParse_A_Movement_Part(x)
		);

		returnMovement.parts.push(...partsParsed);

		return returnMovement;
	}

	songParse_A_Movement_Part(partAsString)
	{
		var octaves = Music_Octave.Instances();
		var volumes = Music_Volume.Instances();
		var noteLetters = Music_NoteLetter.Instances();
		var voices = Music_Voice.Instances();

		var notesOrDynamics = [];

		var part = new Music_Part
		(
			"[part from string]",
			voices.Sine, // hack
			volumes.Medium, // hack
			notesOrDynamics
		);

		partAsString = partAsString.split(" ").join("");
		partAsString = partAsString.split("-").join("");
		partAsString = partAsString.split("_").join("");
		partAsString = partAsString.split("\t").join("");
		partAsString = partAsString.split("|").join("");

		var notesOrDynamicsAsStrings =
			partAsString.split(";").filter(x => x.trim() != "");
		var numberOfNotesOrDynamics = notesOrDynamicsAsStrings.length;

		for (var n = 0; n < numberOfNotesOrDynamics; n++)
		{
			var noteOrDynamicAsString = notesOrDynamicsAsStrings[n];

			var dynamicCodeMaybe = noteOrDynamicAsString[0];
			var dynamicForCode =
				Music_Dynamic.byCode(dynamicCodeMaybe);

			if (dynamicForCode != null)
			{
				var dynamicAsString = noteOrDynamicAsString;
				var dynamic =
					this.songParse_A_Movement_Part_Dynamic(dynamicAsString);
				notesOrDynamics[n] = dynamic;
				dynamic.applyToPart(part);
			}
			else
			{
				var noteAsString = noteOrDynamicAsString;

				var note = this.songParse_A_Movement_Part_Note
				(
					part.volumeCurrent,
					part.octaveCurrent,
					noteAsString
				);
				var noteLetter = note.pitches[0].noteLetter;
				if (noteLetter.isControlCode)
				{
					var controlCodeArgument = note.durationInTicks;

					if (noteLetter == noteLetters.Octave)
					{
						octaveCurrent = octaves.byIndex(controlCodeArgument);
					}
					else if (noteLetter == noteLetters.Volume)
					{
						volumeCurrent = volumes.byIndex(controlCodeArgument);
					}
				}

				notesOrDynamics[n] = note;
			}
		}

		return part;
	}

	songParse_A_Movement_Part_Dynamic(stringToParse)
	{
		var codeAndValue = stringToParse.split(":");
		var code = codeAndValue[0];
		var dynamicForCode = Music_Dynamic.byCode(code);
		var value = codeAndValue[1];
		var returnDynamic = dynamicForCode.clone().valueSet(value);
		return returnDynamic;
	}

	songParse_A_Movement_Part_Note
	(
		volume, octave, noteAsString
	)
	{
		var noteLetterAsString = noteAsString.substring(0, 2);
		var durationAsDenominatorAsString = noteAsString.substring(2);
		var durationAsDenominator =
			parseInt(durationAsDenominatorAsString);

		var durationInQuarterNotes =
			4 /
			durationAsDenominator;

		var noteLetter = Music_NoteLetter.parseFromString
		(
			noteLetterAsString
		);

		var pitch = new Music_Pitch
		(
			octave,
			noteLetter
		);

		var returnValue = new Music_Note
		(
			[ pitch ],
			volume,
			durationInQuarterNotes
		);

		if (returnValue.valid() == false)
		{
			var errorMessage =
				"Error attempting to parse note from string: '"
				+ noteAsString + "'.";
			throw new Error(errorMessage);
		}

		return returnValue;
	}

}