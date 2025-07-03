
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
		this.B = new Music_NotationFormat("B", this.songParse_B);

		this._All =
		[
			this.A,
			this.B
		];

		this._AllByName = new Map(this._All.map(x => [x.name, x] ) );
	}

	byName(name)
	{
		return this._AllByName.get(name);
	}

	// Parsers.

	// Shared.

	songParse_AB
	(
		name,
		stringToParse,
		movementDelimiter,
		movementParse
	)
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
			stringToParse =
				stringToParse.substring(0, stringToParse.length - 1);
		}

		var movementsAsStrings =
			stringToParse.split(movementDelimiter);

		var movements = movementsAsStrings.map
		(
			x => movementParse(x)
		);

		var song = new Music_Song(name, movements);

		return song;
	}

	songParse_AB_Movement
	(
		stringToParse,
		multipartPassageDelimiter,
		partDelimiterWithinMultipartPassage,
		partParse
	)
	{
		var multipartPassagesAsStrings =
			stringToParse.split(multipartPassageDelimiter);

		var passagesCount = multipartPassagesAsStrings.length;

		var partGroupsForPassagesAsStringArrays =
			multipartPassagesAsStrings
				.map(x => x.split(partDelimiterWithinMultipartPassage) );

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
			x => partParse(x)
		);

		returnMovement.parts.push(...partsParsed);

		return returnMovement;
	}

	songParse_AB_Movement_Part_Dynamic(stringToParse)
	{
		var codeAndValue = stringToParse.split(":");
		var code = codeAndValue[0];
		var dynamicForCode = Music_Dynamic.byCode(code);
		var value = codeAndValue[1];
		var returnDynamic = dynamicForCode.clone().valueSet(value);
		return returnDynamic;
	}

	// A.

	songParse_A(name, stringToParse)
	{
		var newline = "\n";
		var twoBlankLines = newline + newline + newline;
		var movementDelimiter = twoBlankLines;

		var movementParse =
			(x) => this.songParse_A_Movement(x);

		return this.songParse_AB
		(
			name,
			stringToParse,
			movementDelimiter,
			movementParse
		);
	}

	songParse_A_Movement(stringToParse)
	{
		var newline = "\n";
		var blankLine = newline + newline;
		var multipartPassageDelimiter = blankLine;

		var partDelimiterWithinMultipartPassage = newline;

		var partParse =
			(x) => this.songParse_A_Movement_Part(x);

		return this.songParse_AB_Movement
		(
			stringToParse,
			multipartPassageDelimiter,
			partDelimiterWithinMultipartPassage,
			partParse
		);
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
		partAsString = partAsString.split(".").join("");
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
						volumeCurrent = volumes.byCode(controlCodeArgument);
					}
				}

				notesOrDynamics[n] = note;
			}
		}

		return part;
	}

	songParse_A_Movement_Part_Dynamic(stringToParse)
	{
		return this.songParse_AB_Movement_Part_Dynamic(stringToParse)
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

	// B.

	songParse_B(name, stringToParse)
	{
		var newline = "\n";
		var threeBlankLines =
			newline + newline + newline + newline;
		var movementDelimiter = threeBlankLines;
		var movementParse =
			(x) => this.songParse_B_Movement(x);
		return this.songParse_AB
		(
			name, stringToParse, movementDelimiter, movementParse
		);
	}

	songParse_B_Movement(stringToParse)
	{
		var newline = "\n";
		var blankLine = newline + newline;
		var twoBlankLines = blankLine + newline;
		var multipartPassageDelimiter = twoBlankLines;
		var partDelimiterWithinMultipartPassage = blankLine;

		var partParse =
			(x) => this.songParse_B_Movement_Part(x);

		return this.songParse_AB_Movement
		(
			stringToParse,
			multipartPassageDelimiter,
			partDelimiterWithinMultipartPassage,
			partParse
		);
	}

	songParse_B_Movement_Part(stringToParse)
	{
		stringToParse = stringToParse.split(".").join(" ");

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

		var charsPerQuarterNote = 4; // hack

		var notesOrDynamicsAsStrings =
			stringToParse.split(" ");
		for (var nod = 0; nod < notesOrDynamicsAsStrings.length; nod++)
		{
			var noteOrDynamicAsString =
				notesOrDynamicsAsStrings[nod];

			var noteLetterSymbol =
				noteOrDynamicAsString.substr(0, 2);

			var noteLetter =
				Music_NoteLetter.bySymbol(noteLetterSymbol);

			var isDynamicNotNote = (noteLetter == null);

			if (isDynamicNotNote)
			{
				var dynamicAsString = noteOrDynamicAsString;
				var dynamic =
					this.songParse_B_Movement_Part_Dynamic(dynamicAsString);
				notesOrDynamics[nod] = dynamic;
				dynamic.applyToPart(part);
			}
			else
			{
				var octave = part.octaveCurrent;

				var pitch =
					Music_Pitch.fromOctaveAndNoteLetter(octave, noteLetter);

				var volume = part.volumeCurrent;

				var noteAsString = noteOrDynamicAsString;
				var durationInChars = noteAsString.length;
				var durationInQuarterNotes =
					durationInChars / charsPerQuarterNote;

				var note = Music_Note.fromPitchVolumeAndDurationInQuarterNotes
				(
					pitch,
					volume,
					durationInQuarterNotes
				);

				notesOrDynamics.push(note);
			}
		}

		return part;
	}

	songParse_B_Movement_Part_Dynamic(stringToParse)
	{
		return this.songParse_AB_Movement_Part_Dynamic(stringToParse)
	}

}