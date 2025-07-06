
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

		stringToParse = stringToParse.trimEnd();

		stringToParse =
			stringToParse
				.split(newline)
				.filter(x => x.startsWith(commentMarker) == false)
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
		trackDelimiterWithinPart,
		partParseFromStrings
	)
	{
		var multipartPassagesAsStrings =
			stringToParse.split(multipartPassageDelimiter);

		var passage0 = multipartPassagesAsStrings[0];
		var passage0Parts =
			passage0.split(partDelimiterWithinMultipartPassage);
		var partCount = passage0Parts.length;
		var passage0Part0 = passage0Parts[0];
		var passage0Part0Tracks =
			passage0Part0.split(trackDelimiterWithinPart);
		var tracksPerPart = passage0Part0Tracks.length;

		var tracksForPartsAsStringArrays = [];

		for (var i = 0; i < partCount; i++)
		{
			var tracksForPartAsStrings = [];

			for (var j = 0; j < tracksPerPart; j++)
			{
				var trackAsString = "";
				tracksForPartAsStrings.push(trackAsString);
			}

			tracksForPartsAsStringArrays
				.push(tracksForPartAsStrings);
		}

		for (var i = 0; i < multipartPassagesAsStrings.length; i++)
		{
			var multipartPassageAsString = 
				multipartPassagesAsStrings[i];

			var partsInPassageAsStrings =
				multipartPassageAsString
					.split(partDelimiterWithinMultipartPassage);

			for (var j = 0; j < partsInPassageAsStrings.length; j++)
			{
				var partInPassageAsString =
					partsInPassageAsStrings[j];

				var tracksInPartInPassageAsStrings =
					partInPassageAsString
						.split(trackDelimiterWithinPart)
						.map(x => x.split("//")[0] );

				var tracksForPartAsStrings =
					tracksForPartsAsStringArrays[j];

				for (var k = 0; k < tracksInPartInPassageAsStrings.length; k++)
				{
					var trackInPartInPassageAsString =
						tracksInPartInPassageAsStrings[k];

					tracksForPartAsStrings[k] +=
						trackInPartInPassageAsString;
				}
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

		var partsParsed = tracksForPartsAsStringArrays.map
		(
			tracksForPartAsStrings =>
				partParseFromStrings(tracksForPartAsStrings)
		);

		returnMovement.parts.push(...partsParsed);

		return returnMovement;
	}

	songParse_AB_Movement_Part_Dynamic
	(
		stringToParse, delimiterOfCodeAndValue
	)
	{
		var codeAndValue =
			stringToParse.split(delimiterOfCodeAndValue);
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
		var trackDelimiterWithinPart = newline; // Intentionally same.

		var partParseFromStrings =
			(x) => this.songParse_A_Movement_Part(x);

		return this.songParse_AB_Movement
		(
			stringToParse,
			multipartPassageDelimiter,
			partDelimiterWithinMultipartPassage,
			trackDelimiterWithinPart,
			partParseFromStrings
		);
	}

	songParse_A_Movement_Part(partAsStrings)
	{
		var partAsString = partAsStrings[0];

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

		partAsString =
			partAsString
				.split(" ").join("")
				.split("-").join("")
				.split(".").join("")
				.split("\t").join("")
				.split("|").join("");

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
					this.songParse_A_Movement_Part_Dynamic
					(
						dynamicAsString
					);
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
		return this.songParse_AB_Movement_Part_Dynamic
		(
			stringToParse,
			":" // delimiterOfCodeAndValue
		)
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
		var trackDelimiterWithinPart = newline;

		var partParseFromStrings =
			(x) => this.songParse_B_Movement_Part(x);

		return this.songParse_AB_Movement
		(
			stringToParse,
			multipartPassageDelimiter,
			partDelimiterWithinMultipartPassage,
			trackDelimiterWithinPart,
			partParseFromStrings
		);
	}

	songParse_B_Movement_Part(partTracksAsStrings)
	{
		var track0AsString = partTracksAsStrings[0];
		var partLengthInChars = track0AsString.length;

		// todo - Pad strings to the same length.

		var charsPerQuarterNote = 4; // hack

		var tokensSoFar = [];
		var tokensInProgressForTracks = [];

		var trackCount = partTracksAsStrings.length;

		for (var i = 0; i < trackCount; i++)
		{
			tokensInProgressForTracks[i] = "";
		}

		for (var i = 0; i < partLengthInChars; i++)
		{
			for (var j = 0; j < trackCount; j++)
			{
				var trackAsString = partTracksAsStrings[j];
				var tokenInProgress = tokensInProgressForTracks[j];

				var charCurrent = trackAsString[i];

				if (charCurrent == " ")
				{
					// Do nothing, and don't count the time.
					if (tokenInProgress != "")
					{
						tokensSoFar.push(tokenInProgress);
						tokenInProgress = "";
					}
				}
				else if (charCurrent == ".")
				{
					// Rest.
					var tokenInProgressIsNotRest =
						(tokenInProgress.split(".").join("").length > 0);
					if (tokenInProgressIsNotRest)
					{
						tokensSoFar.push(tokenInProgress);
						tokenInProgress = "";
					}
					tokenInProgress += charCurrent;
				}
				else if (charCurrent >= "A" && charCurrent <= "G")
				{
					// Start of note.
					tokensSoFar.push(tokenInProgress);
					tokenInProgress = charCurrent;
				}
				else if
				(
					// Continuation of note.
					charCurrent == "_"
					|| charCurrent == "#"
					|| charCurrent == "_"
				)
				{
					tokenInProgress += charCurrent;
				}
				else if (charCurrent == "V" || charCurrent == "O")
				{
					// Start of volume or octave change.
					tokensSoFar.push(tokenInProgress);
					tokenInProgress = charCurrent;
				}
				else if
				(
					// End of volume or octave change.
					isNaN(parseInt(charCurrent) ) == false
					|| charCurrent == "+"
					|| charCurrent == "-"
				)
				{
					tokenInProgress += charCurrent;
				}
				else
				{
					throw new Error("Unexpected character: " + charCurrent);
				}

				tokensInProgressForTracks[j] = tokenInProgress;
			}
		}

		tokensSoFar.push(...tokensInProgressForTracks);

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

		tokensSoFar =
			tokensSoFar.filter(x => x.length > 0);

		var tokensAsNotes =
			tokensSoFar.map
			(
				x =>
					this.songParse_B_Movement_Part_NoteOrDynamic
					(
						x,
						part,
						notesOrDynamics
					)
			);

		return part;
	}

	songParse_B_Movement_Part_NoteOrDynamic
	(
		noteOrDynamicAsString,
		part,
		notesOrDynamics
	)
	{
		var noteOrDynamic;

		var durationInChars = noteOrDynamicAsString.length;
		var charsPerQuarterNote = 4; // hack
		var durationInQuarterNotes =
			durationInChars / charsPerQuarterNote;

		if (noteOrDynamicAsString.split(".").join("").length == 0)
		{
			// Rest.
			noteOrDynamic = Music_Note.restFromDurationInQuarterNotes
			(
				durationInQuarterNotes
			);
		}
		else
		{
			var noteLetterSymbol =
				noteOrDynamicAsString.substr(0, 2);

			var noteLetter =
				Music_NoteLetter.bySymbol(noteLetterSymbol);

			var isDynamicNotNote = (noteLetter == null);

			if (isDynamicNotNote)
			{
				var dynamicAsString = noteOrDynamicAsString;
				var dynamic =
					this.songParse_B_Movement_Part_NoteOrDynamic_Dynamic
					(
						dynamicAsString
					);
				noteOrDynamic = dynamic;
				dynamic.applyToPart(part);
			}
			else
			{
				var octave = part.octaveCurrent;

				var pitch =
					Music_Pitch.fromOctaveAndNoteLetter(octave, noteLetter);

				var volume = part.volumeCurrent;

				var noteAsString = noteOrDynamicAsString;

				var note = Music_Note.fromPitchVolumeAndDurationInQuarterNotes
				(
					pitch,
					volume,
					durationInQuarterNotes
				);

				noteOrDynamic = note;
			}
		}

		notesOrDynamics.push(noteOrDynamic);
	}

	songParse_B_Movement_Part_NoteOrDynamic_Dynamic(stringToParse)
	{
		return this.songParse_AB_Movement_Part_Dynamic
		(
			stringToParse, "" // delimiterOfCodeAndValue
		)
	}

}